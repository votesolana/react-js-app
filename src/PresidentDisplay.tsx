import React from 'react';
import './PresidentDisplay.css'; // Assuming you have CSS for PresidentDisplay

const formatNumberWithCommas = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

const PresidentDisplay = ({ imageSrc, podiumImageSrc, isSelected, totalVotes, presidentTitle, presidentLink }) => {
 

  return (
    <div className="president-display">
      <a href={presidentLink}>
        <div className="president-info">
          <p className="president-title">{presidentTitle}</p>
        </div>
        <div className="image-overlay">
          <img className="president-image" src={imageSrc} alt="Candidate" />
          <div className={`podium-overlay ${isSelected ? 'tremp' : 'boden'}`}>
            <img className="podium-image" src={podiumImageSrc} alt="Podium" />
          </div>
        </div>
        <div className="total-votes">
          <p>Votes: {formatNumberWithCommas(totalVotes)}</p>
        </div>
      </a>
    </div>
  );
};

export default PresidentDisplay;
