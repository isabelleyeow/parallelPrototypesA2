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