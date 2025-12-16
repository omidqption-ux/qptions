// reuse one AudioContext for all sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

/**
 * Core helper: plays a simple sine wave tone.
 * @param {number} frequency – in Hz (default 440)
 * @param {number} duration – in ms (default 100)
 */
export function playBeep(frequency = 440, duration = 100) {
     const osc = audioCtx.createOscillator()
     osc.type = 'sine'
     osc.frequency.value = frequency

     const gain = audioCtx.createGain()
     // simple envelope: ramp down to avoid clicks
     gain.gain.setValueAtTime(1, audioCtx.currentTime)
     gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + duration / 1000
     )

     osc.connect(gain).connect(audioCtx.destination)
     osc.start()
     osc.stop(audioCtx.currentTime + duration / 1000)
}

/**
 * A very short, high-pitched click.
 */
export function playClick() {
     playBeep(2000, 20)
}

/**
 * A little “celebration” – three ascending notes.
 */
export function playWin() {
     const notes = [523.25, 659.25, 784] // C5, E5, G5
     notes.forEach((freq, i) => {
          setTimeout(() => playBeep(freq, 150), i * 200)
     })
}

/**
 * A short “failure” motif – three descending notes.
 */
export function playLose() {
     const notes = [784, 659.25, 587.33] // G5, E5, D5
     notes.forEach((freq, i) => {
          setTimeout(() => playBeep(freq, 150), i * 200)
     })
}

// Example usage:
// playClick();
// playBeep();         // default 440 Hz, 100 ms
// playWin();
// playLose();
