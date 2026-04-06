let lastPlayedAt = 0;
const COOLDOWN_MS = 120;

const audioCache: Record<string, HTMLAudioElement> = {};

function getAudio(src: string): HTMLAudioElement {
  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
  }
  return audioCache[src];
}

function isMuted(): boolean {
  return localStorage.getItem('isSoundMuted') === 'true';
}

function canPlayNow(): boolean {
  const now = Date.now();
  if (now - lastPlayedAt < COOLDOWN_MS) return false;
  lastPlayedAt = now;
  return true;
}

function playAudio(src: string) {
  if (typeof window === "undefined") return;
  if (isMuted()) return;
  if (!canPlayNow()) return;

  const audio = getAudio(src);
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function playHai() {
  playAudio("/audio/hai.mp3");
}

export function playYa() {
  playAudio("/audio/ya.mp3");
}

export function playHaiya() {
  playAudio("/audio/haiya.mp3");
}

export function playRandomSyllable() {
  Math.random() < 0.5 ? playHai() : playYa();
}
