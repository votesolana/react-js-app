import React from "react";
import "./votebar.css";

const VoteBar = ({ trempAmount, bodenAmount }) => {
  const totalVotes = trempAmount + bodenAmount;
  const trempPercentage = Math.round((trempAmount / totalVotes) * 100);
  const bodenPercentage = Math.round((bodenAmount / totalVotes) * 100);

  let winningMessage = "";
  if (trempPercentage > bodenPercentage) {
    winningMessage = "Tremp is winning!";
  } else if (bodenPercentage > trempPercentage) {
    winningMessage = "Boden took the lead!";
  } else {
    winningMessage = "It's all tied up, folks!";
  }

  return (
    <div className="vote-bar-wrapper">
      <div className="winning-message">{winningMessage}</div>
      <div className="vote-bar-container">
        <div className="vote-bar-progress">
          <div className="vote-bar-boden" style={{ width: `${bodenPercentage}%` }}>
            <div className="vote-bar-percentage">{bodenPercentage}%</div>
          </div>
          <div className="vote-bar-tremp" style={{ width: `${trempPercentage}%` }}>
            <div className="vote-bar-percentage">{trempPercentage}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteBar;
