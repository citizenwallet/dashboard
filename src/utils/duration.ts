interface Duration {
  [key: string]: number;
}

export const parseDuration = (seconds: number): Duration => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return { days, hours, minutes, seconds };
};

export const readableDuration = (seconds: number): string => {
  const duration = parseDuration(seconds);

  return Object.keys(duration).reduce((acc, key) => {
    const value: number = duration[key] as number;
    if (value > 0) {
      acc += `${value} ${value === 1 ? key.replace(/s$/, "") : key}`;
    }
    return acc;
  }, "");
};
