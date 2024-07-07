import React from 'react';
import './PresidentDisplay.css'; // Assuming you have CSS for PresidentDisplay

const PresidentDisplay = ({ imageSrc, podiumImageSrc, isSelected, totalVotes, presidentTitle, presidentLink }) => {
  const getImageLevel = (isSelected) => {
    return isSelected ? 1 : 0.5; // Adjust opacity based on selection
  };

  return (
    <div className="president-display">
      <a href={presidentLink}>
        <div className="president-info">
          <p className="president-title">{presidentTitle}</p>
        </div>
        <div className="image-overlay" style={{ opacity: getImageLevel(isSelected) }}>
          <img className="president-image" src={imageSrc} alt="Candidate" />
          <div className={`podium-overlay ${isSelected ? 'tremp' : 'boden'}`}>
            <img className="podium-image" src={podiumImageSrc} alt="Podium" />
          </div>
        </div>
        <div className="total-votes">
          <p>Votes: {totalVotes}</p>
        </div>
      </a>
    </div>
  );
};

export default PresidentDisplay;
