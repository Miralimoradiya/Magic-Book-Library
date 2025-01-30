// CalculateDelayedDays.jsx
export const calculateDelayedDays = (dueDateString, returnDateString) => {
  const dueDate = new Date(dueDateString);
  const returnDate = returnDateString ? new Date(returnDateString) : new Date();
  
  dueDate.setHours(0, 0, 0, 0);
  returnDate.setHours(0, 0, 0, 0);

  const diffInTime = returnDate.getTime() - dueDate.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);

  if (diffInDays > 0) {
    const years = Math.floor(diffInDays / 365);
    const months = Math.floor((diffInDays % 365) / 30);
    const days = Math.floor(diffInDays % 30);

    return (
      <span className="text-red-500">
        {years} years, {months} months, {days} days
      </span>
    );
  }

  return <span className="text-red-500">0 years, 0 months, 0 days</span>;
};