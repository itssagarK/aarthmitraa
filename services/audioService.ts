import { Howl, Howler } from 'howler';

const STORAGE_KEY_SFX = 'arth_mitra_sfx_vol';
const STORAGE_KEY_MUSIC = 'arth_mitra_bgm_vol';
const STORAGE_KEY_LAST_SFX = 'arth_mitra_last_sfx_vol';
const STORAGE_KEY_LAST_MUSIC = 'arth_mitra_last_bgm_vol';

// --- INITIALIZATION ---
// Get saved volumes or default to 0.5 (50%)
const getSavedVol = (key: string) => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved !== null ? parseFloat(saved) : 0.5;
  }
  return 0.5;
};

let currentSfxVol = getSavedVol(STORAGE_KEY_SFX);
let currentMusicVol = getSavedVol(STORAGE_KEY_MUSIC);

// Initialize sounds with reliable CDN URLs
const soundAssets = {
  // Soft pop/click for UI interactions
  click: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], 
    preload: true
  }),
  // Pleasant chime for positive outcomes
  success: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'], 
    preload: true
  }),
  // Low thud/tone for negative outcomes
  error: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'], 
    preload: true
  }),
  // Celebratory tune for game win
  win: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3'], 
    preload: true
  }),
  // Sad/Somber tune for game loss
  lose: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/290/290-preview.mp3'], 
    preload: true
  }),
  // Calm ambient background music
  bgm: new Howl({
    src: ['/sounds/the_mountain-calm-piano-133291.mp3'],
    html5: true, // Use HTML5 Audio for larger files (streaming)
    loop: true,
    volume: currentMusicVol
  })
};

export type SoundType = keyof Omit<typeof soundAssets, 'bgm'>;

// --- SFX METHODS ---

export const playSound = (type: SoundType) => {
  try {
    const sound = soundAssets[type];
    
    // Stop previous instance if it's a UI click to prevent buildup
    if (type === 'click') {
        sound.rate(0.9 + Math.random() * 0.2); // Organic variation
    } else {
        sound.rate(1.0);
    }
    
    // Set volume specifically for this play instance based on global SFX setting
    sound.volume(currentSfxVol);
    sound.play();
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
};

export const setSfxVolume = (vol: number) => {
  currentSfxVol = Math.max(0, Math.min(1, vol));
  localStorage.setItem(STORAGE_KEY_SFX, currentSfxVol.toString());
};

export const getSfxVolume = () => currentSfxVol;

export const toggleMuteSfx = (): number => {
  const current = getSfxVolume();
  if (current > 0) {
    localStorage.setItem(STORAGE_KEY_LAST_SFX, current.toString());
    setSfxVolume(0);
    return 0;
  } else {
    const saved = localStorage.getItem(STORAGE_KEY_LAST_SFX);
    const restore = saved ? parseFloat(saved) : 0.5;
    const final = restore > 0 ? restore : 0.5;
    setSfxVolume(final);
    return final;
  }
};

// --- MUSIC METHODS ---

export const initMusic = () => {
    // Browsers require interaction before playing audio. 
    // Call this on the first user click/interaction.
    if (!soundAssets.bgm.playing()) {
        soundAssets.bgm.volume(currentMusicVol);
        soundAssets.bgm.play();
        soundAssets.bgm.fade(0, currentMusicVol, 2000); // Fade in
    }
};

export const setMusicVolume = (vol: number) => {
  currentMusicVol = Math.max(0, Math.min(1, vol));
  soundAssets.bgm.volume(currentMusicVol);
  localStorage.setItem(STORAGE_KEY_MUSIC, currentMusicVol.toString());
};

export const getMusicVolume = () => currentMusicVol;

export const toggleMuteMusic = (): number => {
  const current = getMusicVolume();
  if (current > 0) {
    localStorage.setItem(STORAGE_KEY_LAST_MUSIC, current.toString());
    setMusicVolume(0);
    return 0;
  } else {
    const saved = localStorage.getItem(STORAGE_KEY_LAST_MUSIC);
    const restore = saved ? parseFloat(saved) : 0.5;
    const final = restore > 0 ? restore : 0.5;
    setMusicVolume(final);
    return final;
  }
};