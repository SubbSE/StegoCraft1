import { describe, expect, it } from 'vitest';
import { addEcho, detectEchoBit } from './dsp';
import { generateMelody } from './synth';
import { channelToFloat } from './wav';

describe('echo hiding', () => {
  it('the cepstrum decoder recovers which echo delay was used', () => {
    const melody = generateMelody({ seconds: 2, sampleRate: 22050 });
    const signal = channelToFloat(melody.samples, 1);
    for (const start of [4000, 15000, 30000]) {
      const zero = addEcho(signal, 22, 0.5).subarray(start, start + 4096);
      const one = addEcho(signal, 44, 0.5).subarray(start, start + 4096);
      expect(detectEchoBit(zero, 22, 44).bit).toBe(0);
      expect(detectEchoBit(one, 22, 44).bit).toBe(1);
    }
  });
});
