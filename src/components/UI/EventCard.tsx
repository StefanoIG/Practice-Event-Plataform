import React from 'react';

interface EventCardProps {
  title: string;
  date: string;
  description: string;
  image: string;
  className?: string;  // Clases CSS opcionales
}

const EventCard: React.FC<EventCardProps> = ({ title, date, description, image, className = '' }) => {
  return (
    <div className={`event-card ${className}`}>
      <img src={image} alt={title} className="event-image" />
      <div className="event-details">
        <h3>{title}</h3>
        <p>{date}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
