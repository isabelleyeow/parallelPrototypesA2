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
}

const sun = document.querySelector("#sun");
const timeText = document.querySelector("#time");

sun.addEventListener("mouseenter", () => {
  let time;
  if (isPreview) {
    // the pretend hour, e.g. "6 PM"
    const h = hour % 12 === 0 ? 12 : hour % 12;
    time = h + (hour < 12 ? " AM" : " PM");
  } else {
    time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  timeText.innerHTML = time + "<small>" + timeOfDay + "</small>";
  timeText.classList.add("show");
  sun.classList.add("raised");
});
sun.addEventListener("mouseleave", () => {
  timeText.classList.remove("show");
  sun.classList.remove("raised");
});

// sound
let audioCtx;
let filter;
let volume;

