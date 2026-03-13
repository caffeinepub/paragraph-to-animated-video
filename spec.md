# Paragraph to Animated Video

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Text input area where users paste a long paragraph
- Auto-scene splitter that breaks text into sentences/chunks (3-7 words per scene)
- Animated video player that plays each scene sequentially with:
  - Animated text entrance effects (fade, slide, typewriter per scene)
  - Dynamic background gradients that shift between scenes
  - Progress bar and scene counter
  - Play/pause/restart controls
  - Adjustable playback speed
- Scene preview list showing all scenes before playing
- Export/download not required (browser-only animation)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: minimal, no backend state needed -- pure frontend app
2. Frontend:
   - Landing/input page: large textarea, convert button
   - Scene splitter logic: split on sentence boundaries, group short sentences
   - Animated player component: fullscreen-style canvas with CSS keyframe animations
   - Controls: play/pause/restart, speed slider, scene scrubber
   - Scene list sidebar showing all generated scenes
   - Smooth gradient background that changes per scene using a color palette
