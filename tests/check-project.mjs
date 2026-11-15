import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
let checked = 0;

function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (['.git', 'vendor', 'node_modules'].includes(entry.name)) return [];
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(filename) : [filename];
  });
}

function report(filename, message) {
  problems.push(`${path.relative(root, filename)}: ${message}`);
}

function checkLink(filename, value) {
  if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) return;
  const target = value.replace(/&amp;/g, '&').split(/[?#]/)[0];
  if (!target) return;
  try {
    const resolved = path.resolve(path.dirname(filename), decodeURIComponent(target));
    if (!fs.existsSync(resolved)) report(filename, `Missing local file: ${value}`);
  } catch {
    report(filename, `Invalid local URL: ${value}`);
  }
}

for (const filename of filesIn(root)) {
  const extension = path.extname(filename);
  if (!['.html', '.js', '.css'].includes(extension)) continue;
  checked++;
  const source = fs.readFileSync(filename, 'utf8');
  if (/^(?:<{7}|={7}|>{7})(?: |$)/m.test(source)) report(filename, 'Unresolved merge conflict marker');
  if (extension === '.js') {
    try { new vm.Script(source, { filename }); }
    catch (error) { report(filename, error.message); }
  }
  if (extension === '.css') {
    const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
      checkLink(filename, match[1]);
    }
  }
  if (extension === '.html') {
    const html = source.replace(/<!--[\s\S]*?-->/g, '');
    const ids = new Set();
    for (const tag of html.matchAll(/<[a-z][^>]*>/gi)) {
      for (const attr of tag[0].matchAll(/\s(href|src|id)\s*=\s*(["'])(.*?)\2/gi)) {
        if (attr[1].toLowerCase() === 'id') {
          if (ids.has(attr[3])) report(filename, `Duplicate ID: ${attr[3]}`);
          ids.add(attr[3]);
        } else checkLink(filename, attr[3]);
      }
    }
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/\bsrc\s*=|application\/(?:ld\+)?json/i.test(match[1])) continue;
      try { new vm.Script(match[2], { filename }); }
      catch (error) { report(filename, `Inline script: ${error.message}`); }
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problems in ${checked} frontend files.`);
  process.exitCode = 1;
} else {
  console.log(`Passed: ${checked} frontend files (JavaScript syntax, local links, images, styles, and duplicate IDs).`);
}
