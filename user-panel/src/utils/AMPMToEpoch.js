export function getTodayEpoch(time) {
    // Get today's date
    const today = new Date();
  
    // Extract hour and minute from input
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!timeMatch) {
      throw new Error("Invalid time format. Use 'hh:mm AM/PM'.");
    }
  
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const period = timeMatch[3].toUpperCase();
  
    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
  
    // Set today's time to the provided hours and minutes
    today.setHours(hours, minutes, 0, 0);
  
    // Return the epoch time
    return today.getTime();
  }  


  export function convertEpochToTime(epoch) {
    // Create a new Date object with the epoch
    const date = new Date(epoch);
  
    // Extract hours, minutes, and seconds
    const hours = date.getHours(); // Returns hours in 24-hour format
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Format time as "HH:MM:SS"
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  
    return formattedTime;
  }
  