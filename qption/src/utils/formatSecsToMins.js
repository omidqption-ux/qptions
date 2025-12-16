export function formatSecondsToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60); // Get the number of minutes
  const remainingSeconds = seconds % 60; // Get the remaining seconds

  // Format minutes and seconds to always show 2 digits
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
