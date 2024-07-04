import React from 'react';

const PresidentDisplay = ({ imageSrc, isSelected, shakeAmount  }) => {
  const getImageLevel = (isSelected) => {
    return isSelected ? 1 : 0.5; // Adjust opacity based on selection
  };

  return (
    <div className="image-display" style={{ opacity: getImageLevel(isSelected) }}>
      <img src={imageSrc} alt="Candidate" />
    </div>
  );
};

export default PresidentDisplay;