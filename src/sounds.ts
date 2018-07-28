import * as Pixi from "pixi.js";

import engineChug from "./assets/audio/engine-chug1.wav";
import engineGrowl from "./assets/audio/engine-growl1.wav";
import engineWhine from "./assets/audio/engine-whine1.wav";

const soundUrls = {
  engineChug,
  engineGrowl,
  engineWhine
};
type SoundName = keyof typeof soundUrls;

export const sounds: Map<SoundName, AudioBuffer> = new Map();

async function loadSound(
  name: keyof typeof soundUrls,
  url: string,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
      sounds.set(name, buffer);
      return buffer;
    });
}

export function loadAllSounds(audioContext: AudioContext) {
  return Promise.all(
    Object.entries(soundUrls).map(([name, url]) =>
      loadSound(name as SoundName, url as string, audioContext)
    )
  );
}
