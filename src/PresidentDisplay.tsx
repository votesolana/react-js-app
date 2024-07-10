import React, { useState, useEffect } from 'react';
import './PresidentDisplay.css'; // Assuming you have CSS for PresidentDisplay

const formatNumberWithCommas = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

const PresidentDisplay = ({ imageSrc, podiumImageSrc, isSelected, totalVotes, presidentTitle, presidentLink }) => {
  const [playExplosion, setPlayExplosion] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setPlayExplosion(true);
      setTimeout(() => {
        setPlayExplosion(false);
      }, 570); // Adjust the timeout to match the duration of your explosion GIF
    }
  }, [isSelected]);

  return (
    <div className={`president-display ${isSelected ? 'selected' : ''}`}>
      <a href={presidentLink}>
        <div className="president-info">
          <p className="president-title">{presidentTitle}</p>
        </div>
        <div className="image-overlay">
          <img className="president-image" src={imageSrc} alt="Candidate" />
          <div className="podium-overlay">
            {playExplosion && (
              <img className="explosion-gif" src="test/explosion.gif" alt="Explosion" />
            )}
            <img className="podium-image" src={podiumImageSrc} alt="Podium" />
          </div>
        </div>
        <div className="global-total-votes">
          <p>Votes: {formatNumberWithCommas(totalVotes)}</p>
        </div>
      </a>
    </div>
  );
};

export default PresidentDisplay;
