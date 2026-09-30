const chords = {
  night:     [110, 130.81, 164.81],
  dawn:      [146.83, 185, 220],
  morning:   [130.81, 164.81, 196, 246.94],
  midday:    [146.83, 185, 220, 277.18],
  afternoon: [146.83, 174.61, 220, 261.63],
  dusk:      [110, 130.81, 164.81, 196]
};

const skies = {
  night:     "linear-gradient(#05060f, #141733)",
  dawn:      "linear-gradient(#2d2757, #d4817f)",
  morning:   "linear-gradient(#7fb8e3, #e3f1f8)",
  midday:    "linear-gradient(#4f9ddb, #cde6f6)",
  afternoon: "linear-gradient(#f0a257, #f8d7a4)",
  dusk:      "linear-gradient(#dd5f3a, #7a3364)"
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
document.querySelectorAll("#preview a").forEach((link) => {
  if (link.search === window.location.search) {
    link.classList.add("current");
  }
});

document.body.style.background = skies[timeOfDay];

if (timeOfDay === "morning" || timeOfDay === "midday" || timeOfDay === "afternoon") {
  document.body.style.color = "#1c1b2c";
  document.querySelector("#ring").style.borderColor = "#1c1b2c";
}

const ring = document.querySelector("#orb");
const timeText = document.querySelector("#time");

ring.addEventListener("mouseenter", () => {
  let time;
  if (isPreview) {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    time = h + (hour < 12 ? " AM" : " PM");
  } else {
    time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  timeText.textContent = time + " · " + timeOfDay;
  timeText.classList.add("show");
});

ring.addEventListener("mouseleave", () => {
  timeText.classList.remove("show");
});

// sound
let audioCtx;
let filter;
let volume;

function startSound() {
  audioCtx = new AudioContext();
 filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;
  volume = audioCtx.createGain();
  volume.gain.value = 0;
  filter.connect(volume);
  volume.connect(audioCtx.destination);

  chords[timeOfDay].forEach((note) => {
    const osc = audioCtx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = note;
    osc.connect(filter);
    osc.start();
  });

  volume.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 3);

  document.querySelector("#hint").style.display = "none";
}

document.addEventListener("pointerdown", startSound, { once: true });

// press and hold
document.addEventListener("pointerdown", () => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  filter.frequency.cancelScheduledValues(now);
  filter.frequency.setValueAtTime(filter.frequency.value, now);
  filter.frequency.linearRampToValueAtTime(2500, now + 2);

  ring.classList.add("breathing");
});
document.addEventListener("pointerup", () => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  filter.frequency.cancelScheduledValues(now);
  filter.frequency.setValueAtTime(filter.frequency.value, now);
  filter.frequency.linearRampToValueAtTime(600, now + 4);

  ring.classList.remove("breathing");
});