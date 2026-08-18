const gallery=[
 ["Sky Garden","A quiet digital garden","🌱"],["Blue World","A tiny blue planet","🌎"],["Cloud Station","Departure to the clouds","☁️"],["Ocean Memory","A postcard from the sea","🌊"],["Sunny Desktop","Everything is online","🖥️"],["Green Future","Tomorrow looks nice","🌿"]
];
const grid=document.getElementById("galleryGrid");
gallery.forEach((g,i)=>{const card=document.createElement("article");card.className="gallery-card";card.innerHTML=`<div class="gallery-art">${g[2]}</div><div class="gallery-caption"><b>${g[0]}</b><small>${g[1]}</small></div>`;card.addEventListener("click",()=>{document.getElementById("lightboxImage").style.display="none";document.getElementById("lightbox").classList.add("open");document.getElementById("lightboxCaption").textContent=g[0]+" — "+g[1]});grid.appendChild(card)});
document.getElementById("closeLightbox").addEventListener("click",()=>document.getElementById("lightbox").classList.remove("open"));document.getElementById("lightbox").addEventListener("click",e=>{if(e.target.id==="lightbox")e.currentTarget.classList.remove("open")});
