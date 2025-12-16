export function getSecondsDifferenceFromNow(date) {
     const now = new Date() // Current date and time
     const differenceInMilliseconds = now.getTime() - date.getTime() // Difference in milliseconds
     return Math.floor(differenceInMilliseconds / 1000) // Convert to seconds
}