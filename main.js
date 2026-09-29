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
const hour = new Date().getHours();
const timeOfDay = getTimeOfDay(hour);

document.body.style.backgroundColor = colours[timeOfDay];

const orb = document.querySelector("#orb");
const timeText = document.querySelector("#time");

orb.addEventListener("mouseenter", () => {
  const now = new Date();
  timeText.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  timeText.classList.add("show");
});

orb.addEventListener("mouseleave", () => {
  timeText.classList.remove("show");
});

//sound
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
// breathing section
document.addEventListener("pointerdown", () => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  // Brighten the sound over 2 seconds
  filter.frequency.cancelScheduledValues(now);
  filter.frequency.setValueAtTime(filter.frequency.value, now);
  filter.frequency.linearRampToValueAtTime(2500, now + 2);

  orb.classList.add("breathing");
});
document.addEventListener("pointerup", () => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  // Settle back slowly over 4 seconds
  filter.frequency.cancelScheduledValues(now);
  filter.frequency.setValueAtTime(filter.frequency.value, now);
  filter.frequency.linearRampToValueAtTime(600, now + 4);

  orb.classList.remove("breathing");
});