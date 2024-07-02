// VoteBar.js
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { fetchData } from './blockchainData/globalVotes';
import "./votebar.css";

const VoteBar = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [voteData, setVoteData] = useState(null);

  useEffect(() => {
    const getVoteData = async () => {
      const data = await fetchData();
      setVoteData(data);
    };

    getVoteData();
  }, []);

  if (!voteData) {
    return <p>Loading vote data...</p>;
  }

  let { tremp, boden } = voteData;
  if(boden == 0) {
    boden = 1;
  }
  const totalVotes = tremp + boden;
  const trempPercentage = (tremp / totalVotes) * 100;
  const bodenPercentage = (boden / totalVotes) * 100;

  return (
    <div className="vote-bar-wrapper">
      <div className="vote-bar-container">
        <div className="vote-bar-label">
          <p>Boden: {boden}</p>
        </div>
        <div className="vote-bar-progress">
          <div className="vote-bar-tremp" style={{ width: `${trempPercentage}%` }} />
          <div className="vote-bar-boden" style={{ width: `${bodenPercentage}%` }} />
          <div className="vote-bar-percentage">
            {bodenPercentage.toFixed(2)}% / {trempPercentage.toFixed(2)}%
          </div>
        </div>
        <div className="vote-bar-label">
          <p>Tremp: {tremp}</p>
        </div>
      </div>
    </div>
  );
};

export default VoteBar;
