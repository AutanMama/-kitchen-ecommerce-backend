/**
 * Calculates the expected delivery date based on the destination country.
 * Nigeria: 24 hours (1 day) delivery.
 * Outside Nigeria: 7 working days delivery (skipping weekends).
 * * @param {string} country - The destination country.
 * @returns {Date} - The expected delivery date.
 */
export const calculateExpectedDeliveryDate = (country) => {
  const currentDate = new Date();
  const normalizedCountry = country.trim().toLowerCase();

  if (normalizedCountry === 'nigeria') {
    // 24 hours delivery within Nigeria
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
  } else {
    // 7 working days outside Nigeria
    let daysAdded = 0;
    while (daysAdded < 7) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay();
      // 0 is Sunday, 6 is Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysAdded++;
      }
    }
    return currentDate;
  }
};