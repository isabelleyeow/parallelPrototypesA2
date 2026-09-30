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
let volume;
let holding = false;

const chimeGap = {
  night:     5,
  dawn:      3.5,
  morning:   2,
  midday:    1.5,
  afternoon: 2,
  dusk:      3.5
};

function playChime(note) {
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = note;

  const chimeVolume = audioCtx.createGain();
  chimeVolume.gain.setValueAtTime(0, now);
  chimeVolume.gain.linearRampToValueAtTime(0.15, now + 0.02);       
  chimeVolume.gain.exponentialRampToValueAtTime(0.001, now + 4);  

  osc.connect(chimeVolume);
  chimeVolume.connect(volume);
  osc.start(now);
  osc.stop(now + 4);
}

function ringNext() {
  const notes = chords[timeOfDay];
  const note = notes[Math.floor(Math.random() * notes.length)] * 2;
  playChime(note);

  // press and hold 
  let gap = chimeGap[timeOfDay];
  if (holding) gap = gap / 2;
  setTimeout(ringNext, gap * 1000);
}

function startSound() {
  audioCtx = new AudioContext();

  volume = audioCtx.createGain();
  volume.gain.value = 1;
  volume.connect(audioCtx.destination);

  const hum = audioCtx.createGain();
  hum.gain.value = 0;
  hum.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 5);
  hum.connect(volume);

  chords[timeOfDay].slice(0, 2).forEach((note) => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = note;
    osc.connect(hum);
    osc.start();
  });

  ringNext();

  document.querySelector("#hint").classList.add("is-gone");
}

document.addEventListener("pointerdown", startSound, { once: true });

document.addEventListener("pointerdown", () => {
  holding = true;
  orb.classList.add("breathing");
});

document.addEventListener("pointerup", () => {
  holding = false;
  orb.classList.remove("breathing");
});