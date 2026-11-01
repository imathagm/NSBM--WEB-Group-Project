var notes = [
  {id:1,pinned:true,cat:"club",title:"Sports Fiesta registrations are open",msg:"All clubs are taking part this year. Speak to your club captain before the deadline.",date:"31 Oct 2026",ago:"Today",read:false},
  {id:2,pinned:true,cat:"system",title:"Student portal maintenance",msg:"The portal may be unavailable for a short time this Sunday night.",date:"30 Oct 2026",ago:"Yesterday",read:true},
  {id:3,cat:"training",title:"Cricket practice time changed",msg:"This week's session starts at 4:00 PM at the main ground.",date:"31 Oct 2026",ago:"2 hours ago",read:false},
  {id:4,cat:"application",title:"Application approved",msg:"Your request to join the Football Club has been approved.",date:"30 Oct 2026",ago:"1 day ago",read:false},
  {id:5,cat:"match",title:"Inter-university football match",msg:"Friday 5:30 PM. The squad list is on the Matches & Tournaments page.",date:"29 Oct 2026",ago:"2 days ago",read:false},
  {id:6,cat:"application",title:"Application received",msg:"Your Badminton Club application is under review.",date:"27 Oct 2026",ago:"4 days ago",read:true},
  {id:7,cat:"club",title:"Welcome to SportsHub",msg:"Browse the clubs and apply to join the ones you like.",date:"25 Oct 2026",ago:"6 days ago",read:true}
];
var icons = {club:"fa-people-group",application:"fa-rectangle-list",match:"fa-trophy",training:"fa-calendar-days",system:"fa-circle-info"};
var labels = {club:"Club",application:"Application",match:"Match",training:"Training",system:"System"};
var f = {cat:"all",status:"all",q:""};
var annEl = document.getElementById("nt-announce");
var listEl = document.getElementById("nt-list");

function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function pad(n){ return n<10 ? "0"+n : ""+n; }

function visible(n){
  if(f.cat!=="all" && n.cat!==f.cat) return false;
  if(f.status==="unread" && n.read) return false;
  if(f.status==="read" && !n.read) return false;
  if(f.q && (n.title+" "+n.msg).toLowerCase().indexOf(f.q)===-1) return false;
  return true;
}

function card(n){
  return '<article class="nt-item nt-item--'+n.cat+(n.read?'':' is-unread')+'" data-id="'+n.id+'">'+
    '<span class="nt-icon"><i class="fa-solid '+icons[n.cat]+'" aria-hidden="true"></i></span>'+
    '<div class="nt-body"><div class="nt-row"><h3 class="nt-title">'+esc(n.title)+(n.read?'':' <span class="nt-new">New</span>')+'</h3>'+
    '<span class="nt-date"><i class="fa-regular fa-clock" aria-hidden="true"></i> '+esc(n.ago)+'</span></div>'+
    '<p class="nt-msg">'+esc(n.msg)+'</p>'+
    '<div class="nt-foot"><span class="nt-tag nt-tag--'+n.cat+'">'+labels[n.cat]+'</span><span class="nt-full-date">'+esc(n.date)+'</span>'+
    '<span class="nt-actions">'+
    (n.read?'':'<button type="button" class="nt-btn" data-act="read"><i class="fa-solid fa-check" aria-hidden="true"></i> Mark read</button>')+
    '<button type="button" class="nt-btn nt-btn--danger" data-act="delete" aria-label="Delete notification"><i class="fa-regular fa-trash-can" aria-hidden="true"></i></button>'+
    '</span></div></div></article>';
}

function fill(el, items, emptyText){
  el.innerHTML = items.length ? items.map(card).join("") : '<div class="nt-empty"><i class="fa-regular fa-bell-slash" aria-hidden="true"></i><p>'+emptyText+'</p></div>';
}

function render(){
  var ann = notes.filter(function(n){return n.pinned && visible(n);});
  var rec = notes.filter(function(n){return !n.pinned && visible(n);});
  fill(annEl, ann, "No announcements match your filters.");
  fill(listEl, rec, "No notifications here. You are all caught up.");
  document.getElementById("ann-count").textContent = pad(ann.length)+" ITEMS";
  document.getElementById("recent-count").textContent = pad(rec.length)+" ITEMS";
  document.getElementById("stat-total").textContent = notes.length;
  document.getElementById("stat-unread").textContent = notes.filter(function(n){return !n.read;}).length;
  document.getElementById("stat-ann").textContent = notes.filter(function(n){return n.pinned;}).length;
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