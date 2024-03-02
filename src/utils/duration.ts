interface Duration {
  [key: string]: number;
}

export const parseDuration = (seconds: number): Duration => {
  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  seconds -= years * 365 * 24 * 60 * 60;
  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  seconds -= months * 30 * 24 * 60 * 60;
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const duration: Duration = {};
  if (years > 0) {
    duration.years = years;
  }

  if (months > 0) {
    duration.months = months;
  }

  if (days > 0) {
    duration.days = days;
  }

  if (hours > 0) {
    duration.hours = hours;
  }

  if (minutes > 0) {
    duration.minutes = minutes;
  }

  if (seconds > 0) {
    duration.seconds = seconds;
  }

  return duration;
};

export const readableDuration = (seconds: number): string => {
  const duration = parseDuration(seconds);

  return Object.keys(duration).reduce((acc, key, i) => {
    const value: number = duration[key] as number;
    if (value > 0) {
      if (i > 0) {
        acc += " ";
      }
      acc += `${value} ${value === 1 ? key.replace(/s$/, "") : key}`;

      const keysLength = Object.keys(duration).length;
      if (keysLength !== i + 1 && keysLength > 1) {
        acc += ",";
      }
    }
    return acc;
  }, "");
};
