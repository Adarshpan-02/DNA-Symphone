 # DNA Symphony - Genetic Music Visualizer

Live Demo: https://dna-symphony.netlify.app

---

## Overview

**DNA Symphony** is an interactive web application that visualizes DNA sequences as animated 3D structures and transforms nucleotide sequences into musical compositions. The app maps each nucleotide base (A, T, G, C) to a distinct musical pitch and color. As the animation progresses, the nucleotide bases are played as notes, making your DNA sequence “sing” as both a dynamic visual and an audible experience.

This project bridges science and art—making molecular biology approachable, engaging, and creative.

---

## Features

- Live 3D visualization of a DNA-like double helix (Three.js).
- Per-base color mapping and real-time note playback (Web Audio API).
- Custom sequence input (A/T/G/C) with basic validation and length stats.
- Preset sequences and a random-sequence generator.
- Playback controls: Play/Pause, Reset, Tempo (60–240 BPM).
- Responsive UI suitable for desktop and mobile.
- No build step required — pure client-side HTML/CSS/JavaScript.

---

## How It Works

- The app reads a nucleotide sequence (default example 20 bases; up to 50 displayed).
- For each base, the app creates two spheres (base + complement) and connects them with cylinders to suggest base-pair bonds and backbone segments, forming a helix-like, spiraling stack.
- Each base maps to a color and musical frequency:
  - A → 261.63 Hz (C4) — red
  - T → 329.63 Hz (E4) — orange
  - G → 392.00 Hz (G4) — green
  - C → 440.00 Hz (A4) — pink
- The application steps through the sequence at the selected tempo. The currently-playing base is visually emphasized (scale + emissive intensity) while its note is synthesized using a short oscillator envelope.

---

## User Guide

1. DNA Sequence
   - Enter up to 50 characters using A, T, G, C.
   - Non-ATGC characters are removed automatically.
2. Playback Controls
   - Play/Pause — toggles playback and animation.
   - Reset — stops playback and resets the sequence cursor.
   - Random — generates a random sequence (20–50 bases).
3. Tempo Slider
   - Adjust BPM from 60 to 240. Changing tempo while playing restarts playback at the new speed.
4. Preset Sequences
   - Quick load examples: Simple, Blocks, Repeat, Mirror.
5. 3D Controls
   - Drag (mouse or touch) to rotate the DNA group.
   - Scroll to zoom in/out (mouse wheel).
6. Statistics
   - Length and playback status are displayed in the UI panel.
7. Audio Notes
   - AudioContext is created on first demand. On some mobile browsers, the user must interact (tap/click) to enable audio.

---

## Built With

- JavaScript
- Three.js (r128)
- Web Audio API
- HTML5 & CSS3

---

## File Structure

```
DNA-Symphone/
├── index.html      # Main web page and UI layout
├── style.css       # App styling and responsive layout
└── script.js       # Visualization, controls, and audio logic
```

---

## Run Locally

1. Clone the repository:
   git clone https://github.com/Adarshpan-02/DNA-Symphone.git
   cd DNA-Symphone

2. Open index.html in a modern browser (Chrome, Firefox, Edge).
   - No build steps or server required — pure client-side.

Notes:
- For local file restrictions in some browsers, serve with a simple static server (optional):
  - Python 3: python -m http.server 8000
  - Node: npx serve

---

## Development & Contribution

- Small single-page project — contributions welcome via issues and pull requests.
- Suggested improvements:
  - Add selectable oscillator types (sine, square, sawtooth).
  - Add audio effects (reverb, delay) and richer envelopes.
  - Export generated audio as WAV or MIDI.
  - Support longer sequences with level-of-detail rendering or streaming.
  - Improve accessibility and keyboard controls.

If you want me to open a PR with improvements, specify the changes and I can provide the diff content to paste.

---

## Performance & Compatibility

- The app limits the displayed pairs to 50 to maintain interactive performance.
- Tested in modern desktop and mobile browsers that support WebGL and the Web Audio API.
- On mobile, audio may require a user gesture to start due to autoplay restrictions.

---

## Credits

- Created by Adarshpan-02.
- Uses Three.js for 3D rendering and the Web Audio API for sound generation.

---

## License

This repository does not include a license file. If you want this project to be reusable under a specific license (MIT, Apache-2.0, GPL-3.0, etc.), add a LICENSE file or tell me which license you prefer and I can provide the text.

---

## Live Demo

https://dna-symphony.netlify.app

---

## Acknowledgments

- Three.js
- Web Audio API
- Open-source community and creative-science inspirations

---

Enjoy making your DNA sing!
