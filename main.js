// chords and sound
const chords = {
  night:     [196.00, 246.94, 293.66, 369.99],  
  dawn:      [174.61, 220.00, 261.63, 329.63],  
  morning:   [261.63, 329.63, 392.00, 493.88], 
  midday:    [293.66, 369.99, 440.00, 554.37],  
  afternoon: [196.00, 246.94, 293.66, 440.00],  
  dusk:      [220.00, 261.63, 329.63, 392.00]   
};

// colours 
const colours = {
  night:     ["#05060f", "#0c0e22", "#141733"],
  dawn:      ["#2d2757", "#7d4a7a", "#d4817f"],
  morning:   ["#7fb8e3", "#b3d6ee", "#e3f1f8"],
  midday:    ["#4f9ddb", "#8ec3ea", "#cde6f6"],
  afternoon: ["#f0a257", "#f4bd7d", "#f8d7a4"],
  dusk:      ["#dd5f3a", "#ac4950", "#7a3364"]
};

// the orb colours depending on the time of day
const orbColours = {
  night:     "#e4e8ff",  
  dawn:      "#ffd6c4",  
  morning:   "#fff6dc",  
  midday:    "#fff2c2",  
  afternoon: "#ffdca6",  
  dusk:      "#ffc093"   
};

const ringGap = {
  night:     12,
  dawn:      9,
  morning:   7,
  midday:    6,
  afternoon: 7,
  dusk:      9
};

const pace = {
  night:     "slowly",
  dawn:      "gently",
  morning:   "brightly",
  midday:    "often",
  afternoon: "warmly",
  dusk:      "slowly"
};

function getTimeOfDay(hour) {
  if (hour < 5)  return "night";
  if (hour < 8)  return "dawn";
  if (hour < 11) return "morning";
  if (hour < 14) return "midday";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "dusk";
  return "night";
}

const params = new URLSearchParams(window.location.search);
const isPreview = params.has("hour");

let hour = new Date().getHours();
if (isPreview) {
  hour = Number(params.get("hour"));
}

const timeOfDay = getTimeOfDay(hour);

document.querySelectorAll(".proto-nav a").forEach((link) => {
  if (link.search === window.location.search) {
    link.setAttribute("aria-current", "true");
  }
});

// background editing
const root = document.documentElement;
root.style.setProperty("--sky-top", colours[timeOfDay][0]);
root.style.setProperty("--sky-mid", colours[timeOfDay][1]);
root.style.setProperty("--sky-bottom", colours[timeOfDay][2]);
root.style.setProperty("--orb-core", orbColours[timeOfDay]);

const isDay = timeOfDay === "morning" || timeOfDay === "midday" || timeOfDay === "afternoon";
if (isDay) {
  root.style.setProperty("--ink", "rgb(24, 24, 44)");
}

const particles = document.querySelector("#particles");
const isStarry = timeOfDay === "night" || timeOfDay === "dusk";
particles.classList.add(isStarry ? "stars" : "dust");

for (let i = 0; i < 60; i++) {
  const dot = document.createElement("span");
  dot.style.left = Math.random() * 100 + "%";
  dot.style.top = Math.random() * 100 + "%";
  dot.style.animationDelay = Math.random() * -18 + "s"; 
  particles.appendChild(dot);
}

// the clock part that appears on the orb
const stage = document.querySelector("#stage");
const orb = document.querySelector("#orb");
const timeText = document.querySelector("#whisper");

function formatTime(h) {
  const hours = Math.floor(h);
  const minutes = Math.round((h - hours) * 60);
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return h12 + ":" + String(minutes).padStart(2, "0") + (hours < 12 ? " AM" : " PM");
}
function showTime() {
  let time;
  if (isPreview) {
    time = formatTime(hour);
  } else {
    time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  timeText.innerHTML = time + "<small>" + timeOfDay + "</small>";
  timeText.classList.add("show");
}

function hideTime() {
  timeText.classList.remove("show");
}

orb.addEventListener("mouseenter", showTime);
orb.addEventListener("mouseleave", hideTime);

const bellsBox = document.querySelector("#bells");
const bellCount = document.querySelector("#bell-count");
const caption = document.querySelector("#caption");
let bells = 0;

function countBell() {
  bells = bells + 1;
  bellCount.textContent = bells;
  bellCount.classList.remove("pulse");
  void bellCount.offsetWidth; // restarts the animation
  bellCount.classList.add("pulse");

  if (bells === 1) {
    caption.textContent = "Each bell marks a moment spent here. At " + timeOfDay +
      " the bowl rings " + pace[timeOfDay] + ", about every " + ringGap[timeOfDay] + " seconds.";
    caption.classList.add("show");
    setTimeout(() => caption.classList.remove("show"), 7000);
  }
}
bellsBox.addEventListener("click", () => {
  bellsBox.classList.toggle("open");
});

let audioCtx;
let hum;

function makeRipple() {
  const ripple = document.createElement("div");
  ripple.className = "ripple";
  stage.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());

  const bloom = document.querySelector("#bloom");
  bloom.classList.add("ring");
  setTimeout(() => bloom.classList.remove("ring"), 600);
}

function ringBowl(note) {
  const now = audioCtx.currentTime;

  const bowlVolume = audioCtx.createGain();
  bowlVolume.gain.setValueAtTime(0, now);
  bowlVolume.gain.linearRampToValueAtTime(0.12, now + 0.05);
  bowlVolume.gain.exponentialRampToValueAtTime(0.001, now + 8);
  bowlVolume.connect(audioCtx.destination);

  [note, note * 1.004].forEach((freq) => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(bowlVolume);
    osc.start(now);
    osc.stop(now + 8);
  });

makeRipple();
  countBell();
}

function autoBell() {
  ringBowl(chords[timeOfDay][0] * 2);
  setTimeout(autoBell, ringGap[timeOfDay] * 1000);
}