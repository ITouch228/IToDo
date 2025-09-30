export const formatDateTime = (date = new Date()) => {
  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(date.getDate())}-${pad(
    date.getMonth() + 1
  )}-${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
};

export const parseTaskDate = (dateString) => {
  if (!dateString) return null;
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
};
