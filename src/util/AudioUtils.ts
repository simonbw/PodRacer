// Useful for having multiple overlapping sounds not start in sync
export function startAtRandomOffset(source: AudioBufferSourceNode): void {
  if (!source.buffer) {
    throw new Error("Cannot start a source without a buffer");
  }
  source.start(undefined, Math.random() * source.buffer.duration);
}
