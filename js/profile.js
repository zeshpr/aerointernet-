const nick=document.getElementById("nicknameInput");nick.value=Aero.state.nickname||"Guest";
document.getElementById("saveProfile").addEventListener("click",()=>{const value=nick.value.trim()||"Guest";Aero.state.nickname=value;Aero.save();document.getElementById("profileSaved").textContent="Profile saved ✓";Aero.toast("Profile updated ✨")});
