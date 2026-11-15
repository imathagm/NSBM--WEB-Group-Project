// Run against a separate test database. This script creates and removes test records.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const base = process.env.SPORTSHUB_TEST_URL;
const email = process.env.SPORTSHUB_TEST_ADMIN_EMAIL;
const password = process.env.SPORTSHUB_TEST_ADMIN_PASSWORD;
if (!base || !email || !password) {
  throw new Error('Set SPORTSHUB_TEST_URL, SPORTSHUB_TEST_ADMIN_EMAIL and SPORTSHUB_TEST_ADMIN_PASSWORD for a separate test database.');
}
function client() {
  const cookies = new Map();
  let csrf = '';
  return {
    async request(route, method = 'GET', data, expected = 200, withCsrf = true) {
      const headers = { Accept: 'application/json', Cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join('; ') };
      if (withCsrf) headers['X-CSRF-Token'] = csrf;
      if (data !== undefined) headers['Content-Type'] = 'application/json';
      const response = await fetch(new URL(`backend/api/${route}`, base), {
        method, headers, body: data === undefined ? undefined : JSON.stringify(data),
      });
      for (const cookie of response.headers.getSetCookie()) {
        const [name, ...value] = cookie.split(';')[0].split('=');
        cookies.set(name, value.join('='));
      }
      const text = await response.text();
      let payload;
      try { payload = JSON.parse(text); }
      catch { throw new Error(`${route} did not return JSON: ${text.slice(0, 300)}`); }
      assert.equal(response.status, expected, `${method} ${route}: ${text}`);
      if (payload.csrfToken) csrf = payload.csrfToken;
      return payload;
    },
  };
}
const admin = client();
const student = client();
const anonymous = client();
const tag = randomUUID().slice(0, 8);
const studentData = {
  fullName: `Test Student ${tag}`, studentId: `TEST-${tag}`,
  email: `student-${tag}@example.test`, contactNumber: '0771234567',
  sportOfInterest: 'Cricket', password: 'StudentTest2026!',
};
const created = [];
let studentRecord;
let passed = 0;
async function check(name, work) {
  await work();
  console.log(`PASS ${name}`);
  passed++;
}
async function create(entity, data) {
  const result = await admin.request('admin/records.php', 'POST', { entity, data }, 201);
  created.push([entity, result.record.id]);
  return result.record;
}
async function update(entity, id, data) {
  return (await admin.request('admin/records.php', 'PUT', { entity, id, data })).record;
}
async function remove(entity, id) {
  await admin.request('admin/records.php', 'DELETE', { entity, id });
  const index = created.findIndex(row => row[0] === entity && row[1] === id);
  if (index >= 0) created.splice(index, 1);
}
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const later = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

try {
  await check('anonymous sessions keep a stable CSRF token', async () => {
    const first = await anonymous.request('auth/session.php');
    const second = await anonymous.request('auth/session.php');
    assert.equal(first.authenticated, false);
    assert.equal(second.csrfToken, first.csrfToken);
  });
  await check('admin authorization and CSRF checks', async () => {
    await anonymous.request('admin/records.php?entity=all', 'GET', undefined, 401);
    await admin.request('admin/session.php');
    await admin.request('admin/login.php', 'POST', { email, password }, 403, false);
    await admin.request('admin/login.php', 'POST', { email, password });
  });
  await check('student session lookup does not sign the admin out', async () => {
    assert.equal((await admin.request('auth/session.php')).authenticated, false);
    assert.equal((await admin.request('admin/session.php')).authenticated, true);
  });
  await check('malformed field types return JSON validation errors', async () => {
    await anonymous.request('auth/login.php', 'POST', { identifier: [], password: 'test' }, 400);
    await anonymous.request('auth/register.php', 'POST', [], 400);
  });
  await check('student registration and duplicate account prevention', async () => {
    await student.request('auth/session.php');
    await student.request('auth/register.php', 'POST', studentData, 201);
    await anonymous.request('auth/register.php', 'POST', studentData, 409);
    const all = await admin.request('admin/records.php?entity=all');
    studentRecord = all.records.students.find(item => item.studentId === studentData.studentId);
    assert.ok(studentRecord?.hasAccount);
  });
  let club;
  await check('club creation and public directory', async () => {
    club = await create('clubs', { name: `Cricket ${tag}`, sport: 'Cricket' });
    const result = await anonymous.request('public-content.php?entity=clubs');
    assert.ok(result.records.some(item => item.id === club.id));
  });
  await check('student club application reaches the admin portal', async () => {
    await student.request('club-application.php', 'POST', {
      clubId: club.id, experience: 'Beginner', notes: 'Ready to practise', faculty: 'Computing', academicYear: 'Year 2',
    }, 201);
    const result = await admin.request('admin/records.php?entity=applications');
    assert.ok(result.records.some(item => item.studentId === studentData.studentId && item.club === club.name));
  });
  await check('duplicate applications are blocked', async () => {
    await student.request('club-application.php', 'POST', { clubId: club.id, experience: 'Beginner' }, 409);
  });
  await check('application approval accepts empty optional fields', async () => {
    const result = await admin.request('admin/records.php?entity=applications');
    const application = result.records.find(item => item.studentId === studentData.studentId);
    const { id, ...fields } = application;
    await update('applications', id, { ...fields, status: 'Approved', submittedOn: null, notes: null });
    const dashboard = await student.request('student-dashboard.php');
    assert.equal(dashboard.applications[0].status, 'Approved');
  });
  let training;
  await check('training records appear in the public schedule', async () => {
    training = await create('training', { title: `Practice ${tag}`, club: club.name, date: later, time: '16:00' });
    const result = await anonymous.request('public-content.php?entity=training');
    assert.ok(result.records.some(item => item.id === training.id));
  });
  await check('club rename preserves memberships and training', async () => {
    club = await update('clubs', club.id, { name: `Renamed Cricket ${tag}` });
    const result = await student.request('student-dashboard.php');
    assert.equal(result.applications[0].club, club.name);
    assert.ok(result.training.some(item => item.club === club.name));
  });
  await check('clubs with dependent records cannot be accidentally deleted', async () => {
    await admin.request('admin/records.php', 'DELETE', { entity: 'clubs', id: club.id }, 409);
  });
  let event;
  await check('tournament creation and deadline validation', async () => {
    await admin.request('admin/records.php', 'POST', {
      entity: 'events', data: { kind: 'Tournament', title: 'Invalid dates', sport: 'Cricket', homeClub: club.name, date: today, registrationDeadline: later },
    }, 400);
    event = await create('events', { kind: 'Tournament', title: `Cup ${tag}`, sport: 'Cricket', homeClub: club.name, date: later, registrationDeadline: today });
  });
  const entry = { fullName: studentData.fullName, studentId: studentData.studentId, email: studentData.email, faculty: 'Computing', yearOfStudy: 'Year 2' };
  await check('tournament registration saves faculty and study year', async () => {
    await student.request('tournament-registration.php', 'POST', { ...entry, tournamentId: event.id }, 201);
    const result = await admin.request('admin/records.php?entity=all');
    const saved = result.records.tournamentRegistrations.find(item => item.tournamentId === event.id);
    assert.equal(saved.faculty, 'Computing');
    assert.equal(saved.yearOfStudy, 'Year 2');
  });
  await check('duplicate and forged tournament entries are blocked', async () => {
    await student.request('tournament-registration.php', 'POST', { ...entry, tournamentId: event.id }, 409);
    await student.request('tournament-registration.php', 'POST', { ...entry, tournamentId: event.id, studentId: 'SOMEONE-ELSE' }, 403);
  });
  await check('booking validation and prevention of double booking', async () => {
    const booking = { type: 'Facility', resource: `Ground ${tag}`, date: later, startTime: '10:00', endTime: '11:00', status: 'Approved' };
    await admin.request('admin/records.php', 'POST', { entity: 'facilities', data: { ...booking, endTime: '09:00' } }, 400);
    await create('facilities', booking);
    await admin.request('admin/records.php', 'POST', { entity: 'facilities', data: { ...booking, startTime: '10:30', endTime: '12:00' } }, 409);
    await create('facilities', { ...booking, startTime: '11:00', endTime: '12:00' });
  });
  await check('announcements respect draft, audience and publication date', async () => {
    const publicNote = await create('announcements', { title: `Public ${tag}`, content: 'Public notice', status: 'Published' });
    const memberNote = await create('announcements', { title: `Members ${tag}`, content: 'Member notice', status: 'Published', audience: 'Club members' });
    const draft = await create('announcements', { title: `Draft ${tag}`, content: 'Draft' });
    const future = await create('announcements', { title: `Future ${tag}`, content: 'Future', status: 'Published', publishDate: later });
    const adminOnly = await create('announcements', { title: `Admins ${tag}`, content: 'Admin', status: 'Published', audience: 'Administrators' });
    const publicIds = (await anonymous.request('public-content.php?entity=announcements')).records.map(item => item.id);
    const studentIds = (await student.request('announcements.php')).announcements.map(item => item.id);
    assert.ok(publicIds.includes(publicNote.id));
    assert.ok(!publicIds.includes(memberNote.id));
    assert.ok(studentIds.includes(memberNote.id));
    for (const item of [draft, future, adminOnly]) assert.ok(!studentIds.includes(item.id));
  });
  await check('profile updates reach the admin directory', async () => {
    const { profile } = await student.request('auth/profile.php');
    await student.request('auth/profile.php', 'PUT', { ...profile, fullName: `Updated ${tag}`, degreeProgram: 'Computer Science' });
    const result = await admin.request('admin/records.php?entity=students');
    assert.equal(result.records.find(item => item.id === studentRecord.id).name, `Updated ${tag}`);
  });
  await check('student ID changes preserve applications and tournament entries', async () => {
    await update('students', studentRecord.id, { studentId: `NEW-${tag}` });
    const dashboard = await student.request('student-dashboard.php');
    assert.equal(dashboard.applications[0].studentId, `NEW-${tag}`);
    const result = await admin.request('admin/records.php?entity=all');
    assert.equal(result.records.tournamentRegistrations.find(item => item.tournamentId === event.id).studentId, `NEW-${tag}`);
  });
  await check('event deletion cleans up its registrations', async () => {
    await remove('events', event.id);
    const result = await admin.request('admin/records.php?entity=all');
    assert.ok(!result.records.tournamentRegistrations.some(item => item.tournamentId === event.id));
  });
  await check('student deletion removes login and memberships', async () => {
    await admin.request('admin/records.php', 'DELETE', { entity: 'students', id: studentRecord.id });
    studentRecord = null;
    assert.equal((await student.request('auth/session.php')).authenticated, false);
    await student.request('auth/login.php', 'POST', { identifier: studentData.email, password: studentData.password }, 401);
  });
  await check('password recovery validates email and malformed reset tokens', async () => {
    await anonymous.request('forgot-password.php', 'POST', { email: 'invalid' }, 400);
    await anonymous.request('reset-password.php', 'POST', { token: 'invalid', password: 'StrongPassword123' }, 400);
  });
  console.log(`\n${passed} API checks passed.`);
} finally {
  if (studentRecord) await admin.request('admin/records.php', 'DELETE', { entity: 'students', id: studentRecord.id });
  for (const [entity, id] of created.reverse()) await admin.request('admin/records.php', 'DELETE', { entity, id });
}
