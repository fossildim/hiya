// Unified 3-tier rating visual system across all themes.
// Level 1: subtle translucent (low-key background, lets date number shine)
// Level 2: standard theme primary color
// Level 3: metallic / glow gradient (the "medal")

export type RatingLevel = 1 | 2 | 3;

export interface RatingVisuals {
  background: string;
  boxShadow: string;
  border?: string;
  /** Color for the date number on top of this background. */
  numberColor: string;
  numberShadow: string;
}

const isDark = () => document.documentElement.classList.contains('dark');

/**
 * Per-theme metallic gradient for Level 3 (the "medal" tier).
 * Each theme gets a tailored highlight gradient that feels premium.
 */
const METALLIC_GRADIENTS: Record<string, string> = {
  red:    'linear-gradient(135deg, #FCA5A5 0%, #F87171 25%, #DC2626 55%, #991B1B 100%)',
  orange: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 20%, #FBBF24 45%, #F97316 75%, #C2410C 100%)', // 流沙金
  yellow: 'linear-gradient(135deg, #FFFBEB 0%, #FDE68A 25%, #FACC15 55%, #B45309 100%)',
  green:  'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 25%, #10B981 55%, #047857 100%)',
  cyan:   'linear-gradient(135deg, #CFFAFE 0%, #67E8F9 25%, #06B6D4 55%, #0E7490 100%)',
  blue:   'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 25%, #3B82F6 55%, #1D4ED8 100%)',
  purple: 'linear-gradient(135deg, #F3E8FF 0%, #C4B5FD 25%, #8B5CF6 55%, #6D28D9 100%)',
  pink:   'linear-gradient(135deg, #FCE7F3 0%, #F9A8D4 25%, #EC4899 55%, #BE185D 100%)',
  // 冷冽电光绿 with neon glow feel
  black:  'linear-gradient(135deg, #BBF7D0 0%, #4ADE80 30%, #22C55E 60%, #15803D 100%)',
  // 全息镭射
  white:  'linear-gradient(135deg, #FCA5A5 0%, #FBBF24 20%, #4ADE80 40%, #60A5FA 60%, #C084FC 80%, #F472B6 100%)',
};

/**
 * Glow shadow for Level 3 to create the medal effect.
 */
const METALLIC_GLOW: Record<string, string> = {
  red:    '0 0 22px rgba(220, 38, 38, 0.55), 0 6px 18px rgba(220, 38, 38, 0.35)',
  orange: '0 0 22px rgba(249, 115, 22, 0.55), 0 6px 18px rgba(234, 88, 12, 0.35)',
  yellow: '0 0 22px rgba(250, 204, 21, 0.6), 0 6px 18px rgba(202, 138, 4, 0.35)',
  green:  '0 0 22px rgba(16, 185, 129, 0.55), 0 6px 18px rgba(5, 150, 105, 0.35)',
  cyan:   '0 0 22px rgba(6, 182, 212, 0.55), 0 6px 18px rgba(14, 116, 144, 0.35)',
  blue:   '0 0 22px rgba(59, 130, 246, 0.55), 0 6px 18px rgba(29, 78, 216, 0.35)',
  purple: '0 0 22px rgba(139, 92, 246, 0.55), 0 6px 18px rgba(109, 40, 217, 0.35)',
  pink:   '0 0 22px rgba(236, 72, 153, 0.55), 0 6px 18px rgba(190, 24, 93, 0.35)',
  black:  '0 0 28px rgba(74, 222, 128, 0.75), 0 0 12px rgba(74, 222, 128, 0.5), 0 6px 18px rgba(34, 197, 94, 0.4)',
  white:  '0 0 22px rgba(192, 132, 252, 0.5), 0 6px 18px rgba(99, 102, 241, 0.3)',
};

/**
 * Level 1 translucent tint per theme — very subtle so the date number
 * remains the focal point. Tuned to be visible but never dominant.
 */
const LEVEL1_TINTS: Record<string, { light: string; dark: string }> = {
  red:    { light: 'rgba(220, 38, 38, 0.18)',  dark: 'rgba(248, 113, 113, 0.18)' },
  orange: { light: 'rgba(249, 115, 22, 0.18)', dark: 'rgba(251, 146, 60, 0.18)' },
  yellow: { light: 'rgba(250, 204, 21, 0.22)', dark: 'rgba(250, 204, 21, 0.18)' },
  green:  { light: 'rgba(34, 197, 94, 0.18)',  dark: 'rgba(74, 222, 128, 0.18)' },
  cyan:   { light: 'rgba(6, 182, 212, 0.18)',  dark: 'rgba(34, 211, 238, 0.18)' },
  blue:   { light: 'rgba(59, 130, 246, 0.18)', dark: 'rgba(96, 165, 250, 0.18)' },
  purple: { light: 'rgba(139, 92, 246, 0.18)', dark: 'rgba(167, 139, 250, 0.18)' },
  pink:   { light: 'rgba(236, 72, 153, 0.18)', dark: 'rgba(244, 114, 182, 0.18)' },
  // BLACK theme: replaced rose-pink (was --accent 330 81% 60%) with dark teal/green
  black:  { light: 'rgba(20, 83, 45, 0.55)',   dark: 'rgba(20, 83, 45, 0.55)' },
  white:  { light: 'rgba(99, 102, 241, 0.15)', dark: 'rgba(129, 140, 248, 0.18)' },
};

const DARK_THEMES = new Set(['black']);

/**
 * Returns the unified rating visuals for a given theme + level.
 * Used by both the homepage 4-week calendar and the dynamics-page big calendar
 * so the design language is identical.
 */
export const getRatingVisuals = (themeId: string, level: RatingLevel): RatingVisuals => {
  const id = themeId || 'orange';
  const themeIsDark = DARK_THEMES.has(id) || isDark();

  // ===== Number colors =====
  // Light/vibrant themes → deep brown/charcoal so digits never get eaten by bg.
  // Dark themes → bright pure white with a subtle shadow.
  const deepNumber  = '#3F2A1A'; // deep warm brown for vibrant themes
  const whiteNumber = '#FFFFFF';

  if (level === 1) {
    const tint = LEVEL1_TINTS[id] || LEVEL1_TINTS.orange;
    return {
      background: themeIsDark ? tint.dark : tint.light,
      boxShadow: themeIsDark
        ? '0 2px 8px rgba(0,0,0,0.3)'
        : '0 2px 8px rgba(0,0,0,0.06)',
      numberColor: themeIsDark ? whiteNumber : deepNumber,
      numberShadow: themeIsDark
        ? '0 1px 3px rgba(0,0,0,0.7)'
        : '0 1px 1px rgba(255,255,255,0.4)',
    };
  }

  if (level === 2) {
    return {
      background: 'hsl(var(--primary))',
      boxShadow: themeIsDark
        ? '0 4px 14px hsl(var(--primary) / 0.45)'
        : '0 4px 14px hsl(var(--primary) / 0.35)',
      numberColor: themeIsDark ? whiteNumber : deepNumber,
      numberShadow: themeIsDark
        ? '0 1px 3px rgba(0,0,0,0.6)'
        : '0 1px 2px rgba(255,255,255,0.35)',
    };
  }

  // Level 3 — the medal
  const gradient = METALLIC_GRADIENTS[id] || METALLIC_GRADIENTS.orange;
  const glow = METALLIC_GLOW[id] || METALLIC_GLOW.orange;
  return {
    background: gradient,
    boxShadow: glow + ', inset 0 1px 0 rgba(255,255,255,0.5)',
    border: themeIsDark
      ? '1.5px solid rgba(255,255,255,0.35)'
      : '1.5px solid rgba(255,255,255,0.7)',
    // For the medal: dark themes use bright white w/ strong shadow for contrast
    // against the bright metallic gradient.
    numberColor: themeIsDark ? whiteNumber : deepNumber,
    numberShadow: themeIsDark
      ? '0 1px 4px rgba(0,0,0,0.85), 0 0 6px rgba(0,0,0,0.6)'
      : '0 1px 2px rgba(255,255,255,0.55), 0 0 4px rgba(255,255,255,0.4)',
  };
};

/**
 * Style for empty (no-entry) cells — kept consistent across calendars.
 */
export const getEmptyCellVisuals = (themeId: string) => {
  const id = themeId || 'orange';
  const themeIsDark = DARK_THEMES.has(id) || isDark();
  return {
    background: themeIsDark ? 'rgba(255,255,255,0.04)' : 'hsl(var(--card) / 0.7)',
    numberColor: themeIsDark ? 'rgba(255,255,255,0.85)' : 'hsl(var(--foreground) / 0.7)',
    numberShadow: themeIsDark ? '0 1px 2px rgba(0,0,0,0.6)' : 'none',
  };
};
