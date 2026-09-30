// the sound/chord that plays 
const chords = {
  night:     [110, 130.81, 164.81],
  dawn:      [146.83, 185, 220],
  morning:   [130.81, 164.81, 196, 246.94],
  midday:    [146.83, 185, 220, 277.18],
  afternoon: [146.83, 174.61, 220, 261.63],
  dusk:      [110, 130.81, 164.81, 196]
};
// colours for each time of the day
const colours = {
  night:     ["#05060f", "#141733"],
  dawn:      ["#2d2757", "#d4817f"],
  morning:   ["#7fb8e3", "#e3f1f8"],
  midday:    ["#4f9ddb", "#cde6f6"],
  afternoon: ["#f0a257", "#f8d7a4"],
  dusk:      ["#dd5f3a", "#7a3364"]
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

//preview testing
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
// gradient
const root = document.documentElement;
root.style.setProperty("--sky-top", colours[timeOfDay][0]);
root.style.setProperty("--sky-bottom", colours[timeOfDay][1]);
if (timeOfDay === "morning" || timeOfDay === "midday" || timeOfDay === "afternoon") {
  root.style.setProperty("--ink", "rgb(24, 24, 44)");
}
// orb and hover edits
const orb = document.querySelector("#orb");
const timeText = document.querySelector("#whisper");
// time features
function formatTime(h) {
  const hours = Math.floor(h);
  const minutes = Math.round((h - hours) * 60);
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return h12 + ":" + String(minutes).padStart(2, "0") + (hours < 12 ? " AM" : " PM");
}
orb.addEventListener("mouseenter", () => {
  let time;
  if (isPreview) {
    time = formatTime(hour);
  } else {
    time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  timeText.innerHTML = time + "<small>" + timeOfDay + "</small>";
  timeText.classList.add("show");
});

orb.addEventListener("mouseleave", () => {
  timeText.classList.remove("show");
});
// sound
let audioCtx;
let hum;

const ringGap = {
  night:     12,
  dawn:      9,
  morning:   7,
  midday:    6,
  afternoon: 7,
  dusk:      9
};

function ringBowl() {
  const now = audioCtx.currentTime;
  const note = chords[timeOfDay][0] * 2; 

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

  setTimeout(ringBowl, ringGap[timeOfDay] * 1000);
}

function startSound() {
  audioCtx = new AudioContext();

   hum = audioCtx.createGain();
  hum.gain.value = 0;
  hum.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 5);
  hum.connect(audioCtx.destination);

  chords[timeOfDay].forEach((note) => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = note;
    osc.connect(hum);
    osc.start();
  });

