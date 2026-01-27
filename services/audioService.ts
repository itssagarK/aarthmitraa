import { Howl, Howler } from 'howler';

const STORAGE_KEY_MUTE = 'arth_mitra_muted';

// Initialize global mute state
const initialMute = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_MUTE) === 'true' : false;
Howler.mute(initialMute);

// Initialize sounds with reliable CDN URLs
// Using Mixkit free preview assets for UI sounds
const soundAssets = {
  // Soft pop/click for UI interactions
  click: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], 
    volume: 0.3,
    preload: true
  }),
  // Pleasant chime for positive outcomes
  success: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'], 
    volume: 0.3,
    preload: true
  }),
  // Low thud/tone for negative outcomes
  error: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'], 
    volume: 0.3,
    preload: true
  }),
  // Celebratory tune for game win
  win: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3'], 
    volume: 0.5,
    preload: true
  }),
  // Sad/Somber tune for game loss
  lose: new Howl({ 
    src: ['https://assets.mixkit.co/active_storage/sfx/290/290-preview.mp3'], 
    volume: 0.5,
    preload: true
  }),
};

export type SoundType = keyof typeof soundAssets;

export const playSound = (type: SoundType) => {
  try {
    // Stop previous instance of the same sound to prevent overlap if clicked rapidly
    // mostly relevant for UI clicks
    if (type === 'click') {
        // Optional: randomness to pitch for organic feel
        soundAssets[type].rate(0.9 + Math.random() * 0.2); 
    } else {
        soundAssets[type].rate(1.0);
    }
    
    soundAssets[type].play();
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
};

export const toggleMute = (): boolean => {
  const currentState = localStorage.getItem(STORAGE_KEY_MUTE) === 'true';
  const newState = !currentState;
  Howler.mute(newState);
  localStorage.setItem(STORAGE_KEY_MUTE, String(newState));
  return newState;
};

export const isMuted = (): boolean => {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_MUTE) === 'true';
};