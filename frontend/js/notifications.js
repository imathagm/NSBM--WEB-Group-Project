var notes = [];
var announcementNotes = [];
var announcementState = "loading";
var icons = {club:"fa-people-group",application:"fa-rectangle-list",match:"fa-trophy",training:"fa-calendar-days",announcement:"fa-bullhorn",system:"fa-circle-info"};
var labels = {club:"Club",application:"Application",match:"Match",training:"Training",announcement:"Announcement",system:"System"};
var f = {cat:"all",status:"all",q:""};
var annEl = document.getElementById("nt-announce");
var listEl = document.getElementById("nt-list");
var scriptUrl = document.currentScript && document.currentScript.src;
var announcementsEndpoint = scriptUrl ? new URL("../../backend/api/announcements.php", scriptUrl) : null;

function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function pad(n){ return n<10 ? "0"+n : ""+n; }

function formatAnnouncementDate(value){
  var parts = value.split("-").map(Number);
  var date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString(undefined, {day:"numeric",month:"short",year:"numeric"});
}

function relativeAnnouncementDate(value){
  var parts = value.split("-").map(Number);
  var date = new Date(parts[0], parts[1] - 1, parts[2]);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var days = Math.round((today.getTime() - date.getTime()) / 86400000);
  if(days <= 0) return "Today";
  if(days === 1) return "Yesterday";
  return days + " days ago";
}

function visible(n){
  if(f.cat!=="all" && n.cat!==f.cat) return false;
  if(f.status==="unread" && n.read) return false;
  if(f.status==="read" && !n.read) return false;
  if(f.q && (n.title+" "+n.msg).toLowerCase().indexOf(f.q)===-1) return false;
  return true;
}

function card(n){
  return '<article class="nt-item nt-item--'+n.cat+(n.read?'':' is-unread')+'" data-id="'+esc(n.id)+'">'+
    '<span class="nt-icon"><i class="fa-solid '+icons[n.cat]+'" aria-hidden="true"></i></span>'+
    '<div class="nt-body"><div class="nt-row"><h3 class="nt-title">'+esc(n.title)+(n.read?'':' <span class="nt-new">New</span>')+'</h3>'+
    '<span class="nt-date"><i class="fa-regular fa-clock" aria-hidden="true"></i> '+esc(n.ago)+'</span></div>'+
    '<p class="nt-msg">'+esc(n.msg)+'</p>'+
    '<div class="nt-foot"><span class="nt-tag nt-tag--'+n.cat+'">'+labels[n.cat]+'</span><span class="nt-full-date">'+esc(n.date)+'</span>'+
    (n.isAnnouncement?'':'<span class="nt-actions">'+
      (n.read?'':'<button type="button" class="nt-btn" data-act="read"><i class="fa-solid fa-check" aria-hidden="true"></i> Mark read</button>')+
      '<button type="button" class="nt-btn nt-btn--danger" data-act="delete" aria-label="Delete notification"><i class="fa-regular fa-trash-can" aria-hidden="true"></i></button>'+
    '</span>')+'</div></div></article>';
}

function fill(el, items, emptyText){
  el.innerHTML = items.length ? items.map(card).join("") : '<div class="nt-empty"><i class="fa-regular fa-bell-slash" aria-hidden="true"></i><p>'+emptyText+'</p></div>';
}

function render(){
  var ann = announcementNotes.filter(visible);
  var rec = notes.filter(function(n){return !n.pinned && visible(n);});
  fill(annEl, ann, announcementState === "loading" ? "Loading announcements…" :
    announcementState === "error" ? "Announcements are unavailable. Please try again later." :
    "No announcements match your filters.");
  fill(listEl, rec, "No notifications here. You are all caught up.");
  document.getElementById("ann-count").textContent = pad(ann.length)+" ITEMS";
  document.getElementById("recent-count").textContent = pad(rec.length)+" ITEMS";
  document.getElementById("stat-total").textContent = notes.length + announcementNotes.length;
  document.getElementById("stat-unread").textContent = notes.filter(function(n){return !n.read;}).length;
  document.getElementById("stat-ann").textContent = announcementNotes.length;
}

async function loadAnnouncements(){
  try {
    var session = await window.sportshubAuth.session();
    if(!session.authenticated) return;
    if(!announcementsEndpoint) throw new Error("The announcements service could not be located.");
    var response = await fetch(announcementsEndpoint, {
      method:"GET",
      credentials:"same-origin",
      cache:"no-store",
      headers:{"Accept":"application/json"}
    });
    var payload;
    try {
      payload = await response.json();
    } catch (error) {
      throw new Error("The announcements service returned an invalid response.");
    }
    if(!response.ok || payload.success !== true || !Array.isArray(payload.announcements)) {
      throw new Error(payload.message || "The announcements request could not be completed.");
    }
    announcementNotes = payload.announcements.map(function(item){
      if(typeof item.title !== "string" || typeof item.content !== "string" ||
          typeof item.publishedDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(item.publishedDate)) {
        throw new Error("The announcements service returned invalid announcement data.");
      }
      return {
        id:item.id,
        cat:"announcement",
        title:item.title,
        msg:item.content,
        date:formatAnnouncementDate(item.publishedDate),
        ago:relativeAnnouncementDate(item.publishedDate),
        read:true,
        isAnnouncement:true
      };
    });
    announcementState = "loaded";
  } catch (error) {
    announcementState = "error";
    console.error("Unable to load student announcements.", error);
  }
  render();
}

function onAction(e){
  var btn = e.target.closest("[data-act]");
  var el = e.target.closest(".nt-item");
  if(!el) return;
  var id = Number(el.dataset.id);
  if(btn && btn.dataset.act==="delete"){ notes = notes.filter(function(n){return n.id!==id;}); }
  else { notes.forEach(function(n){ if(n.id===id) n.read = true; }); }
  render();
}
annEl.addEventListener("click", onAction);
listEl.addEventListener("click", onAction);

document.getElementById("nt-mark-all").addEventListener("click", function(){
  notes.forEach(function(n){ n.read = true; }); render();
});
document.getElementById("cat-filter").addEventListener("change", function(e){ f.cat = e.target.value; render(); });
document.getElementById("status-filter").addEventListener("change", function(e){ f.status = e.target.value; render(); });
document.getElementById("search-filter").addEventListener("input", function(e){ f.q = e.target.value.trim().toLowerCase(); render(); });
document.getElementById("reset-filters").addEventListener("click", function(){
  f = {cat:"all",status:"all",q:""};
  document.getElementById("cat-filter").value = "all";
  document.getElementById("status-filter").value = "all";
  document.getElementById("search-filter").value = "";
  render();
});
render();
loadAnnouncements();

// ===== Theme toggle and mobile menu =====
var root = document.documentElement;
var themeBtn = document.getElementById("theme-toggle");
function setTheme(t){
  root.setAttribute("data-theme", t);
  themeBtn.innerHTML = '<i class="fa-solid ' + (t === "dark" ? "fa-sun" : "fa-moon") + '" aria-hidden="true"></i>';
  themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  try { localStorage.setItem("sportshub-theme", t); } catch (e) {}
}
var saved = null;
try { saved = localStorage.getItem("sportshub-theme"); } catch (e) {}
setTheme(saved === "dark" ? "dark" : "light");
themeBtn.addEventListener("click", function(){
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

var menuBtn = document.getElementById("menu-toggle");
function setMenu(open){
  document.body.classList.toggle("sidebar-open", open);
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
}
menuBtn.addEventListener("click", function(){
  if (window.matchMedia("(max-width: 760px)").matches) {
    setMenu(!document.body.classList.contains("sidebar-open"));
  } else {
    var hidden = document.body.classList.toggle("sidebar-collapsed");
    menuBtn.setAttribute("aria-expanded", hidden ? "false" : "true");
  }
});
document.getElementById("sidebar-backdrop").addEventListener("click", function(){ setMenu(false); });