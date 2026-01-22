let lastSpokenAt = 0;

type SfxText = "嗨" | "呀" | "嗨呀";

function canSpeakNow() {
  // small global cooldown to avoid machine-gun clicks
  const now = Date.now();
  if (now - lastSpokenAt < 120) return false;
  lastSpokenAt = now;
  return true;
}

function speak(text: SfxText) {
  if (typeof window === "undefined") return;
  if (!canSpeakNow()) return;
  if (!("speechSynthesis" in window)) return;

  // Stop previous utterance so it feels snappy.
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-CN";
  utter.rate = 1.15;
  utter.pitch = 1.05;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

export function playHai() {
  speak("嗨");
}

export function playYa() {
  speak("呀");
}

export function playHaiya() {
  speak("嗨呀");
}

export function playRandomSyllable() {
  // 50/50
  (Math.random() < 0.5 ? playHai : playYa)();
}
