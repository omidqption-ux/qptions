export type MockPoint = {
  time: number;
  value: number;
};

export const generateInitialData = (count: number = 120): MockPoint[] => {
  const now = Date.now();
  let value = 100;
  const out: MockPoint[] = [];

  for (let i = count - 1; i >= 0; i -= 1) {
    value += (Math.random() - 0.5) * 0.6;
    const time = now - i * 1000;
    out.push({ time, value: Number(value.toFixed(4)) });
  }

  return out;
};

export const generateNextPoint = (prev: MockPoint): MockPoint => {
  const nextValue = prev.value + (Math.random() - 0.5) * 0.6;
  return {
    time: prev.time + 1000,
    value: Number(nextValue.toFixed(4)),
  };
};

export const generatePreviousPoints = (
  first: MockPoint,
  seconds: number
): MockPoint[] => {
  const out: MockPoint[] = [];
  let value = first.value;
  for (let i = seconds; i >= 1; i -= 1) {
    value += (Math.random() - 0.5) * 0.6;
    out.push({
      time: first.time - i * 1000,
      value: Number(value.toFixed(4)),
    });
  }
  return out;
};
