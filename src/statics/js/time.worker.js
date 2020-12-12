export function workerTimer(
  fake,
  minutes,
  seconds,
  accumulator,
  completed,
  setMilliseconds
) {
  let stop = null;
  fake = true;
  if (seconds == null) {
    seconds = 60;
  }

  minutes = parseInt(minutes);
  seconds = parseInt(seconds);

  seconds--;

  if (seconds == 0 && minutes > 0) {
    minutes--;
    seconds = 60;
  }

  if (minutes == 0 && seconds == 0) {
    stop = true;
  }
  accumulator = accumulator + 1000;
  completed = (accumulator / setMilliseconds) * 100;

  return {
    fake,
    minutes,
    seconds,
    accumulator,
    completed,
    setMilliseconds,
    stop
  };
}

export function workerChronometer(
  fake,
  minutes,
  seconds,
  accumulatorChronometer
) {
  fake = true;
  if (seconds == null) {
    seconds = 0;
  }

  seconds = parseInt(seconds);
  minutes = parseInt(minutes);
  seconds++;

  if (seconds == 60 && minutes >= 0) {
    minutes++;
    seconds = 0;
  }

  accumulatorChronometer = accumulatorChronometer + 1000;

  return {
    fake,
    minutes,
    seconds,
    accumulatorChronometer
  };
}
