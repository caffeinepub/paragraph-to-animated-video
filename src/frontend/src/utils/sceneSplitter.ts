/**
 * Splits a long text into cinematic scenes.
 * Each scene is a short, displayable chunk.
 */
export function splitIntoScenes(text: string): string[] {
  if (!text.trim()) return [];

  // Split by sentence-ending punctuation, keeping the delimiter
  const rawSentences = text
    .replace(/([.!?])\s+/g, "$1\n")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const scenes: string[] = [];

  for (const sentence of rawSentences) {
    const words = sentence.split(/\s+/).filter(Boolean);

    if (words.length <= 12) {
      // Short enough — keep as-is
      scenes.push(sentence);
    } else {
      // Long sentence: try splitting at commas first
      const commaParts = sentence
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      if (commaParts.length > 1) {
        let buffer = "";
        for (const part of commaParts) {
          const candidate = buffer ? `${buffer}, ${part}` : part;
          const candidateWords = candidate.split(/\s+/).filter(Boolean);
          if (candidateWords.length > 12 && buffer) {
            scenes.push(
              `${buffer.replace(/,\s*$/, "")}${buffer.match(/[.!?]$/) ? "" : "..."}`,
            );
            buffer = part;
          } else {
            buffer = candidate;
          }
        }
        if (buffer) scenes.push(buffer);
      } else {
        // No commas — split into halves
        const half = Math.ceil(words.length / 2);
        scenes.push(`${words.slice(0, half).join(" ")}...`);
        scenes.push(`...${words.slice(half).join(" ")}`);
      }
    }
  }

  // Merge scenes that are too short (< 3 words) with their neighbor
  const merged: string[] = [];
  for (let i = 0; i < scenes.length; i++) {
    const wordCount = scenes[i].split(/\s+/).filter(Boolean).length;
    if (wordCount < 3 && merged.length > 0) {
      merged[merged.length - 1] += ` ${scenes[i]}`;
    } else {
      merged.push(scenes[i]);
    }
  }

  return merged.filter((s) => s.trim().length > 0);
}

/** Duration for a scene in ms based on word count */
export function sceneDuration(text: string, speedMultiplier = 1): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  const base = Math.min(Math.max(words * 400, 2000), 6000);
  return base / speedMultiplier;
}
