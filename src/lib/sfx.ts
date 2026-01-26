let lastPlayedAt = 0;
const COOLDOWN_MS = 120; // 防止连续点击重复播放

// 预加载音频以减少延迟
const audioCache: Record<string, HTMLAudioElement> = {};

function getAudio(src: string): HTMLAudioElement {
  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
  }
  return audioCache[src];
}

function canPlayNow(): boolean {
  const now = Date.now();
  if (now - lastPlayedAt < COOLDOWN_MS) return false;
  lastPlayedAt = now;
  return true;
}

function playAudio(src: string) {
  if (typeof window === "undefined") return;
  if (!canPlayNow()) return;

  const audio = getAudio(src);
  audio.currentTime = 0; // 允许快速重播
  audio.play().catch(() => {
    // 静默处理自动播放被阻止的情况
  });
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
