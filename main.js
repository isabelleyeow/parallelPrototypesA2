// the sound/chord that plays 
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
  chimeVolume.gain.linearRampToValueAtTime(0.15, now + 0.02);       // quick soft "ting"
  chimeVolume.gain.exponentialRampToValueAtTime(0.001, now + 4);    // long fade

  osc.connect(chimeVolume);
  chimeVolume.connect(volume);
  osc.start(now);
  osc.stop(now + 4);
}