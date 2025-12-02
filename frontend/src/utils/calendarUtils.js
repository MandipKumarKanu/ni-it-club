/**
 * Google Calendar URL Generator
 * Generates a URL that opens Google Calendar with pre-filled event details
 */

/**
 * Format a date and time for Google Calendar URL
 * @param {Date|string} date - The event date
 * @param {string} time - The time in format "HH:MM" or "HH:MM AM/PM"
 * @returns {string} Formatted date string for Google Calendar (YYYYMMDDTHHmmss)
 */
const formatDateTime = (date, time) => {
  const eventDate = new Date(date);
  
  if (time) {
    const timeParts = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeParts) {
      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      const meridiem = timeParts[3];

      if (meridiem) {
        if (meridiem.toUpperCase() === "PM" && hours !== 12) {
          hours += 12;
        } else if (meridiem.toUpperCase() === "AM" && hours === 12) {
          hours = 0;
        }
      }

      eventDate.setHours(hours, minutes, 0, 0);
    }
  }

  // Format as YYYYMMDDTHHmmss
  const year = eventDate.getFullYear();
  const month = String(eventDate.getMonth() + 1).padStart(2, "0");
  const day = String(eventDate.getDate()).padStart(2, "0");
  const hours = String(eventDate.getHours()).padStart(2, "0");
  const mins = String(eventDate.getMinutes()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${mins}00`;
};

/**
 * Generate a Google Calendar event URL
 * @param {Object} event - The event object
 * @param {string} event.name - Event title
 * @param {string} event.date - Event date
 * @param {string} event.timeFrom - Start time
 * @param {string} event.timeTo - End time
 * @param {string} event.location - Event location
 * @param {string} event.description - Event description
 * @param {string} event.shortDetails - Short event details (fallback for description)
 * @returns {string} Google Calendar URL
 */
export const generateGoogleCalendarUrl = (event) => {
  const baseUrl = "https://calendar.google.com/calendar/render";
  
  const startDateTime = formatDateTime(event.date, event.timeFrom);
  const endDateTime = formatDateTime(event.date, event.timeTo);
  
  // Build description with details and optional registration link
  let description = event.description || event.shortDetails || "";
  if (event.registrationLink) {
    description += `\n\nRegister here: ${event.registrationLink}`;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${startDateTime}/${endDateTime}`,
    details: description,
    location: event.location || "",
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use user's timezone
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate an iCal/ICS download for the event
 * @param {Object} event - The event object
 * @returns {string} Data URL for ICS file download
 */
export const generateICalData = (event) => {
  const startDateTime = formatDateTime(event.date, event.timeFrom);
  const endDateTime = formatDateTime(event.date, event.timeTo);
  
  const description = (event.description || event.shortDetails || "").replace(/\n/g, "\\n");
  
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NI-IT Club//Events//EN",
    "BEGIN:VEVENT",
    `DTSTART:${startDateTime}`,
    `DTEND:${endDateTime}`,
    `SUMMARY:${event.name}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${event.location || ""}`,
    `UID:${event._id || Date.now()}@ni-it-club`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
};

/**
 * Open Google Calendar with event details or use provided calendar link
 * @param {Object} event - The event object
 */
export const openGoogleCalendar = (event) => {
  // If event has a custom calendar link, use it
  const url = event.addToCalendarLink || generateGoogleCalendarUrl(event);
  window.open(url, "_blank", "noopener,noreferrer");
};

/**
 * Download ICS file for the event
 * @param {Object} event - The event object
 */
export const downloadICalFile = (event) => {
  const icsData = generateICalData(event);
  const link = document.createElement("a");
  link.href = icsData;
  link.download = `${event.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {
  generateGoogleCalendarUrl,
  generateICalData,
  openGoogleCalendar,
  downloadICalFile,
};
