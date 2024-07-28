import React from "react";
import "./votebar.css";
const formatNumberWithCommas = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};
const VoteBar = ({ trempAmount, bodenAmount }) => {
  const totalVotes = trempAmount + bodenAmount;
  const trempPercentage = Math.round((trempAmount / totalVotes) * 100);
  const bodenPercentage = Math.round((bodenAmount / totalVotes) * 100);

  let winningMessage = "";
  if (trempPercentage > bodenPercentage) {
    winningMessage = "Tremp is winning!";
  } else if (bodenPercentage > trempPercentage) {
    winningMessage = "Kamala is ahead!";
  } else {
    winningMessage = "It's a tie!";
  }

  return (
    <div className="vote-bar-wrapper">
     
      <div className="vote-bar-container">
        <div className="vote-bar-progress">
        <div className="winning-message">{winningMessage}</div>
          <div className="vote-bar-boden" style={{ width: `${bodenPercentage}%` }}>

          </div>
          <div className="vote-bar-tremp" style={{ width: `${trempPercentage}%` }}>
          
          </div>
        </div>
      </div>
      <div className="total-global-votes">
        Total Votes Locked: {formatNumberWithCommas(totalVotes)}
      </div>
    </div>
  );
};

export default VoteBar;
