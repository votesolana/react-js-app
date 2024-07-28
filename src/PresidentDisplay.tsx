import React, { useState, useEffect } from 'react';
import './PresidentDisplay.css'; // Assuming you have CSS for PresidentDisplay

const formatNumberWithCommas = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

const PresidentDisplay = ({ imageSrc, podiumImageSrc, isSelected, totalVotes, presidentTitle, onClick }) => {
  const [playExplosion, setPlayExplosion] = useState(false);

  const getBackgroundColor = () => {
    if (presidentTitle === 'Kamala Horriss') {
      return '#454af5'; // Background color for Boden
    } else if (presidentTitle === 'Doland Tremp') {
      return '#ff3838'; // Background color for Tremp
    }
    return 'transparent'; // Default background color
  };

  useEffect(() => {
    if (isSelected) {
      setPlayExplosion(true);
      setTimeout(() => {
        setPlayExplosion(false);
      }, 570); // Adjust the timeout to match the duration of your explosion GIF
    }
  }, [isSelected]);

  return (
    <div className={`president-display ${isSelected ? 'selected' : ''}`} onClick={onClick}    style={isSelected ? {
      backgroundColor: getBackgroundColor(),
    } : {}}>
    
     
        <div className="image-overlay">
          <img className="president-image" src={imageSrc} alt="Candidate" />
          <div className="podium-overlay">
            {playExplosion && (
              <img className="explosion-gif" src="./explosion.gif" alt="Explosion" />
            )}
            <img className="podium-image" src={podiumImageSrc} alt="Podium" />
          </div>
        </div>
        <div className="president-info">
          <p className="president-title">{presidentTitle}</p>
        </div>
        <div className="global-total-votes">
          <p>Votes: {formatNumberWithCommas(totalVotes)}</p>
        </div>
 

    </div>
  );
};

export default PresidentDisplay;
