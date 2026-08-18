const zones={
 ocean:{icon:"🌊",title:"Ocean",text:"A calm blue zone for music, waves and future underwater discoveries."},
 forest:{icon:"🌲",title:"Aero Forest",text:"A green digital forest full of tiny creatures, plants and hidden links."},
 city:{icon:"🏙️",title:"Aero City",text:"The busiest place in the Aero World. This is where Aero Search, Mail and Community will live."},
 cloud:{icon:"☁️",title:"Cloud Zone",text:"A soft place above the clouds. Perfect for wallpapers, dreams and ambient sounds."},
 space:{icon:"🪐",title:"Aero Space",text:"A zero-gravity corner of the internet. Future home of astronomy games and cosmic radio."}
};
document.querySelectorAll(".zone").forEach(btn=>btn.addEventListener("click",()=>{
 const z=zones[btn.dataset.zone]; document.querySelector(".zone-info-icon").textContent=z.icon;document.getElementById("zoneTitle").textContent=z.title;document.getElementById("zoneText").textContent=z.text;
}));
