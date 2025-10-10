import { useState } from 'react';

interface ReadMoreProps {
  text: string;
  maxLength?: number; 
}

export function ReadMore({ text, maxLength = 100 }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <p className="synopsis">{text}</p>;
  }

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <p className="synopsis">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <button onClick={toggleText} className="read-more-btn">
        {isExpanded ? 'Leer menos' : 'Leer más'}
      </button>
    </div>
  );
}