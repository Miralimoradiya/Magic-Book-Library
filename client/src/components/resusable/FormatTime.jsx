// FormatTime.jsx
import React from 'react';

const FormatTime = ({ dateString }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    return `${hours}:${minutes} ${period}`;
  };
  return <>{formatTime(dateString)}</>;
};

export default FormatTime;
