const orb = document.querySelector("#orb");
const timeText = document.querySelector("#time");

orb.addEventListener("mouseenter", () => {
  timeText.textContent = currentTimeText() + " · " + timeOfDay;
  timeText.classList.add("show");
});

orb.addEventListener("mouseleave", () => {
  timeText.classList.remove("show");
});