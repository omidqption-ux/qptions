import { normalizeEpochMs } from '../src/utils/time';

describe('normalizeEpochMs', () => {
  it('converts seconds to milliseconds', () => {
    expect(normalizeEpochMs(1_700_000_000)).toBe(1_700_000_000_000);
  });

  it('keeps millisecond inputs unchanged', () => {
    expect(normalizeEpochMs(1_700_000_000_123)).toBe(1_700_000_000_123);
  });
});
