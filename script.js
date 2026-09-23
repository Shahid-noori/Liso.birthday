const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const opening = $("#opening"), app = $("#app"), fx = $("#fx");

// Opening sequence
setTimeout(() => $("#openingLine").classList.add("show"), 300);
$("#openGift").addEventListener("click", () => {
  burst(22);
  opening.classList.add("exit");
  document.body.classList.remove("lock");
  setTimeout(() => { opening.remove(); app.classList.remove("hidden"); }, 850);
  startAudioFromUserAction();
});

// Mobile navigation
$("#menuToggle").addEventListener("click", () => {
  const open = $("#navLinks").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", open);
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("visible"); });
}, {threshold:.12});
$$(".reveal").forEach(el => observer.observe(el));

// Click hearts / sparkles
["hero","memories","gallery","wishes","surprise"].forEach(id => {
  const section = document.getElementById(id);
  if(section) section.addEventListener("click", e => {
    if(e.target.closest("button,a")) return;
    if(Math.random() > .55) createFx(e.clientX, e.clientY, ["♡","✦","✧","♥"][Math.floor(Math.random()*4)]);
  });
});
function createFx(x,y,char="♡"){
  const el=document.createElement("span"); el.className="fx-item"; el.textContent=char;
  el.style.left=x+"px"; el.style.top=y+"px"; el.style.color=["#f18fb3","#fff","#ffd2e1","#d96b97"][Math.floor(Math.random()*4)];
  fx.appendChild(el); setTimeout(()=>el.remove(),3000);
}
function burst(n=30){
  for(let i=0;i<n;i++){
    const x=10+Math.random()*80, y=55+Math.random()*35;
    createFx(innerWidth*x/100, innerHeight*y/100, ["♡","✦","🎀","✧","♥"][Math.floor(Math.random()*5)]);
  }
}

// Gallery
const photoData = [
  {
    src: "assets/images/photo_2026-09-23_22-39-11.jpg",
    caption: "A little memory ♡",
  },
  {
    src: "assets/images/photo_2026-09-23_22-40-58.jpg",
    caption: "One for the scrapbook",
  },
  {
    src: "assets/images/photo_2026-09-23_22-41-03.jpg",
    caption: "A beautiful day",
  },
  {
    src: "assets/images/photo_2026-09-23_22-41-07.jpg",
    caption: "Keep this moment",
  },
  {
    src: "assets/images/photo_2026-09-23_22-41-11.jpg",
    caption: "A smile worth saving",
  },
];

const galleryGrid = $("#galleryGrid");

photoData.forEach((photo, index) => {
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const caption = document.createElement("figcaption");

  figure.className = "gallery-item reveal";
  image.src = photo.src;
  image.alt = `Lisa memory ${index + 1}`;
  image.loading = "lazy";
  caption.textContent = photo.caption;

  image.addEventListener("error", () => {
    figure.remove();
  });

  figure.append(image, caption);
  galleryGrid.appendChild(figure);
  observer.observe(figure);

  figure.addEventListener("click", () => openLightbox(index));
});

// Lightbox
let currentPhoto=0;
const lightbox=$("#lightbox"), lightboxImg=$("#lightboxImg");
function openLightbox(i){currentPhoto=i; updateLightbox(); lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden","false");}
function updateLightbox() {
  const photo = photoData[currentPhoto];

  lightboxImg.src = photo.src;
  lightboxImg.alt = photo.caption;
  $("#lightboxCaption").textContent = photo.caption;
  $("#lightboxCounter").textContent = `${currentPhoto + 1} / ${photoData.length}`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}
$("#lightboxClose").addEventListener("click", closeLightbox);

$("#prevPhoto").addEventListener("click", () => {
  currentPhoto = (currentPhoto - 1 + photoData.length) % photoData.length;
  updateLightbox();
});

$("#nextPhoto").addEventListener("click", () => {
  currentPhoto = (currentPhoto + 1) % photoData.length;
  updateLightbox();
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    $("#prevPhoto").click();
  }

  if (event.key === "ArrowRight") {
    $("#nextPhoto").click();
  }
});

// Reasons
$$(".reason-card").forEach(card=>card.addEventListener("click",()=>{
  const old=card.querySelector(".message"); if(old) old.remove();
  const msg=document.createElement("p");msg.className="message";msg.textContent=card.dataset.message;
  msg.style.cssText="margin-top:14px;line-height:1.55;color:#916f7c;font-size:.86rem";
  card.appendChild(msg); createFx(innerWidth/2,innerHeight/2,"♡");
}));

// Countdown: automatically targets the next occurrence of today's month/day if no explicit birthday is configured.
// Change BIRTHDAY_MONTH and BIRTHDAY_DAY to Lisa's real birthday when known.
const BIRTHDAY_MONTH = 9; // 1-12 placeholder
const BIRTHDAY_DAY = 23;  // placeholder day; change this
function nextBirthday(){
  const now=new Date(), year=now.getFullYear();
  let d=new Date(year,BIRTHDAY_MONTH-1,BIRTHDAY_DAY,0,0,0);
  if(d<=now)d=new Date(year+1,BIRTHDAY_MONTH-1,BIRTHDAY_DAY,0,0,0);
  return d;
}
let birthdayTarget=nextBirthday();
function updateCountdown(){
  let diff=birthdayTarget-Date.now();
  if(diff<=0){birthdayTarget=nextBirthday();diff=birthdayTarget-Date.now();burst(45)}
  const s=Math.floor(diff/1000), days=Math.floor(s/86400), hours=Math.floor(s%86400/3600), mins=Math.floor(s%3600/60), secs=s%60;
  $("#days").textContent=String(days).padStart(2,"0");$("#hours").textContent=String(hours).padStart(2,"0");$("#minutes").textContent=String(mins).padStart(2,"0");$("#seconds").textContent=String(secs).padStart(2,"0");
  $("#countdownLabel").textContent=`Counting down to ${birthdayTarget.toLocaleDateString(undefined,{month:"long",day:"numeric"})}.`;
}
updateCountdown();setInterval(updateCountdown,1000);

// Secret note
$("#revealSecret").addEventListener("click",()=>{$("#secretNote").classList.add("show");burst(14)});

// Gift
$("#giftStage").addEventListener("click",()=>{$("#giftStage").classList.add("open");$("#giftMessage").textContent="You opened it! One little gift for one very special person. 🎀";burst(25)});
$("#giftStage").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();$("#giftStage").click()}});

// Music
const audio=$("#audio"), playBtn=$("#playBtn"), muteBtn=$("#muteBtn"), progress=$("#progressBar");
let audioAvailable=true;
audio.addEventListener("error",()=>{audioAvailable=false;playBtn.title="Add assets/music/birthday.mp3 to enable music";});
function startAudioFromUserAction(){ if(audioAvailable) audio.play().then(()=>playBtn.textContent="❚❚").catch(()=>{}); }
playBtn.addEventListener("click",()=>{
  if(!audioAvailable){playBtn.textContent="♪"; return}
  if(audio.paused) audio.play().then(()=>playBtn.textContent="❚❚").catch(()=>{}); else {audio.pause();playBtn.textContent="▶";}
});
muteBtn.addEventListener("click",()=>{audio.muted=!audio.muted;muteBtn.textContent=audio.muted?"🔇":"🔊"});
audio.addEventListener("timeupdate",()=>{progress.style.width=audio.duration?`${audio.currentTime/audio.duration*100}%`:"0%"});
audio.addEventListener("ended",()=>playBtn.textContent="▶");

// Final surprise
$("#finalSurprise").addEventListener("click",()=>{$("#finalOverlay").classList.add("show");burst(60)});
$("#restart").addEventListener("click",()=>{location.reload()});
