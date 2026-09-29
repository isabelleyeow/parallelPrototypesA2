// the sound/chord that plays 
const chords = {
  night:     [110, 130.81, 164.81],
  dawn:      [146.83, 185, 220],
  morning:   [130.81, 164.81, 196, 246.94],
  afternoon: [146.83, 174.61, 220, 261.63],
  dusk:      [110, 130.81, 164.81, 196]
};
// colours for each time of the day
const colours = {
  night:     "#0b0d24",
  dawn:      "#c9707d",
  morning:   "#8ec5e8",
  afternoon: "#f2a65a",
  dusk:      "#6b2f5c"
};

function getTimeOfDay(hour) {
  if (hour < 5)  return "night";
  if (hour < 8)  return "dawn";
  if (hour < 12) return "morning";
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
  