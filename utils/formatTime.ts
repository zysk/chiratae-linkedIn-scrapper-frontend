export function formatTime(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  function padWithZero(num: number) {
    return num < 10 ? num + 10 : num;
  }

  return {
    mins: padWithZero(mins),
    secs: padWithZero(secs),
  };
}

export function convertToSeconds(minutes: number, seconds: number) {
  return minutes * 60 + seconds;
}
