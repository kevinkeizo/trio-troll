// Sons sintetizados com Web Audio (sem arquivos). O contexto só nasce no primeiro clique.
let ctx = null;
let out = null;
let lastTick = 0;
let muted = (() => {
  try { return localStorage.getItem("trio-mute") === "1"; } catch (e) { return false; }
})();

function ac() {
  if (muted) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      out = ctx.createGain();
      out.gain.value = 0.5;
      out.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch (e) {
    return null;
  }
}

function tone(c, { f, to, type = "sine", at = 0, dur = 0.15, vol = 0.2, attack = 0.004 }) {
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(out);
  o.start(t);
  o.stop(t + dur + 0.03);
}

const noiseBufs = new Map();
function noise(c, { at = 0, dur = 0.03, vol = 0.15, freq = 3000, q = 1, type = "bandpass", to }) {
  const t = c.currentTime + at;
  const key = Math.round(dur * 1000);
  let buf = noiseBufs.get(key);
  if (!buf) {
    const len = Math.max(1, Math.ceil(c.sampleRate * dur));
    buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
    noiseBufs.set(key, buf);
  }
  const s = c.createBufferSource();
  s.buffer = buf;
  const fl = c.createBiquadFilter();
  fl.type = type;
  fl.frequency.setValueAtTime(freq, t);
  if (to) fl.frequency.exponentialRampToValueAtTime(to, t + dur);
  fl.Q.value = q;
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(fl);
  fl.connect(g);
  g.connect(out);
  s.start(t);
}

const play = (fn) => () => { const c = ac(); if (c) fn(c); };
const NOTES = [523.25, 659.25, 783.99, 1046.5];

export const sfx = {
  click: play((c) => {
    noise(c, { dur: 0.02, vol: 0.12, freq: 4200, q: 2 });
    tone(c, { f: 1600, type: "triangle", dur: 0.03, vol: 0.03 });
  }),
  tick: () => {
    const now = performance.now();
    if (now - lastTick < 40) return;
    lastTick = now;
    const c = ac(); if (!c) return;
    noise(c, { dur: 0.015, vol: 0.09, freq: 5200, q: 3 });
    tone(c, { f: 1100 + Math.random() * 250, type: "triangle", dur: 0.025, vol: 0.035 });
  },
  roll: play((c) => {
    noise(c, { dur: 0.35, vol: 0.18, freq: 400, to: 3200, q: 0.8 });
    tone(c, { f: 160, to: 640, type: "sawtooth", dur: 0.3, vol: 0.035, attack: 0.02 });
    tone(c, { f: 80, to: 50, dur: 0.25, vol: 0.25 });
  }),
  reveal: (i = 0) => {
    const c = ac(); if (!c) return;
    const f = NOTES[i % NOTES.length];
    noise(c, { dur: 0.09, vol: 0.25, freq: 220, type: "lowpass" });
    tone(c, { f: 70, to: 45, dur: 0.18, vol: 0.3 });
    tone(c, { f, type: "triangle", dur: 0.6, vol: 0.12 });
    tone(c, { f: f * 2, dur: 0.4, vol: 0.04, at: 0.01 });
    tone(c, { f: f * 1.5, type: "sine", dur: 0.5, vol: 0.03, at: 0.03 });
  },
  level: (n = 0) => {
    const c = ac(); if (!c) return;
    const f = [330, 392, 494, 587][n] || 440;
    tone(c, { f, type: "triangle", dur: 0.14, vol: 0.1 });
    tone(c, { f: f * 1.5, type: "triangle", dur: 0.12, vol: 0.06, at: 0.05 });
    if (n === 3) {
      tone(c, { f: 90, to: 55, type: "sawtooth", dur: 0.35, vol: 0.07, at: 0.02 });
      noise(c, { dur: 0.25, vol: 0.1, freq: 900, q: 0.7, at: 0.02 });
    }
  },
  lock: (on) => {
    const c = ac(); if (!c) return;
    const [a, b] = on ? [660, 990] : [990, 660];
    noise(c, { dur: 0.02, vol: 0.14, freq: 2600, q: 2 });
    tone(c, { f: a, type: "square", dur: 0.06, vol: 0.03 });
    tone(c, { f: b, type: "square", dur: 0.08, vol: 0.03, at: 0.06 });
  },
  swap: play((c) => {
    noise(c, { dur: 0.12, vol: 0.12, freq: 1200, to: 4000, q: 1 });
    tone(c, { f: 600, to: 900, type: "triangle", dur: 0.12, vol: 0.06 });
  }),
  copy: play((c) => {
    tone(c, { f: 784, type: "sine", dur: 0.12, vol: 0.1 });
    tone(c, { f: 1175, type: "sine", dur: 0.2, vol: 0.1, at: 0.07 });
  }),
  error: play((c) => {
    tone(c, { f: 220, to: 180, type: "square", dur: 0.14, vol: 0.04 });
  }),
};

export const isMuted = () => muted;
export function setMuted(m) {
  muted = m;
  try { localStorage.setItem("trio-mute", m ? "1" : "0"); } catch (e) { /* ok */ }
}
