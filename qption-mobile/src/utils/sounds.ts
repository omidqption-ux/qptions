import { Audio } from 'expo-audio';

let clickSound: Audio.Sound | null = null;
let beepSound: Audio.Sound | null = null;
let winSound: Audio.Sound | null = null;

export async function initSounds() {
     if (!clickSound) {
          clickSound = new Audio.Sound();
          await clickSound.loadAsync(require('../../assets/sounds/click.mp3'));
     }
     if (!beepSound) {
          beepSound = new Audio.Sound();
          await beepSound.loadAsync(require('../../assets/sounds/lose.mp3'));
     }
     if (!winSound) {
          winSound = new Audio.Sound();
          await winSound.loadAsync(require('../../assets/sounds/win.mp3'));
     }
}

export async function playClick() {
     if (!clickSound) await initSounds();
     await clickSound!.replayAsync();
}

// Implement playBeep/playWin/playLose similarly or map to a few files
export function playBeep() { }
export function playWin() { }
export function playLose() { }
