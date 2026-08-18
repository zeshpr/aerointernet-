const Aero = {
  state: JSON.parse(localStorage.getItem("aeroState") || '{"nickname":"Guest","coins":0,"best":0,"visits":0}'),
  save(){localStorage.setItem("aeroState",JSON.stringify(this.state)); this.refreshUI()},
  toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>el.classList.remove("show"),2200)},
  refreshUI(){
    const s=this.state;
    ["homeCoins","profileCoins"].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=s.coins});
    ["homeScore","gameBest","profileBest"].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=s.best});
    ["homeVisits","profileVisits"].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=s.visits||1});
    ["navUser"].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=s.nickname||"Guest"});
  }
};
function showPage(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const page=document.getElementById("page-"+name); if(page) page.classList.add("active");
  document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("current",b.dataset.page===name));
  document.getElementById("mobileMenu")?.classList.remove("open");
  history.replaceState(null,"","#"+name);
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{const btn=e.target.closest("[data-page]");if(btn){e.preventDefault();showPage(btn.dataset.page)}});
document.getElementById("menuButton")?.addEventListener("click",()=>document.getElementById("mobileMenu").classList.toggle("open"));
document.getElementById("profileButton")?.addEventListener("click",()=>showPage("profile"));
const quotes=["The future was supposed to be bright.","Welcome back to the sunny side of the web.","More bubbles. Less minimalism.","Everything is connected. Even the clouds.","The internet is greener than you remember.","Please enjoy your perfectly optimistic afternoon."];
document.getElementById("newQuote")?.addEventListener("click",()=>document.getElementById("dailyQuote").textContent=quotes[Math.floor(Math.random()*quotes.length)]);
function tick(){const d=new Date();document.getElementById("clock").textContent=d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});requestAnimationFrame(()=>setTimeout(tick,1000))} tick();
Aero.state.visits=(Aero.state.visits||0)+1; Aero.save();
const initial=location.hash.slice(1); if(initial&&document.getElementById("page-"+initial)) showPage(initial); else showPage("home");
