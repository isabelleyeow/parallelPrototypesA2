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
