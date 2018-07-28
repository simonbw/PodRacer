// Useful for having multiple overlapping sounds not start in sync
export function startAtRandomOffset(source: AudioBufferSourceNode): void {
  source.start(undefined, Math.random() * source.buffer.duration);
}
