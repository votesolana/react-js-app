import { useConnection, useWallet, useAnchorWallet  } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import { Slider, Select, MenuItem, Button, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { getTokenBalance, getTrempTokenAddress } from './blockchainData/globalVotes';
import idl from "./blockchainData/idl.json";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  Program,
  Idl,
  AnchorProvider,
  setProvider,
  BN
} from "@coral-xyz/anchor";




const PlaceVote = ({ amount, setAmount, candidate, setCandidate, timeLength, setTimeLength }) => {
  const { connect, connected, publicKey  } = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [treasuryAccount, setTreasuryAccount] = useState(null);
  const [voteWifTrempAccount, setVoteWifTrempAccount] = useState(null);
  const [voteInfo, setVoteInfo] = useState(null);
  const [globalVoteAccount, setGlobalVoteAccount] = useState(null);
  const [voteAccount, setVoteAccount] = useState(null);


  const provider = new AnchorProvider(connection, wallet, {
    commitment: "processed",
  });
  setProvider(provider)
  
  const programId = new PublicKey("98q6XA7arUMxoc7bLNW1ZQtUvckjQzyo4DzH67w6boe6")
  const MINT = new PublicKey('7Ub3EfvT4x7qBpLaYEvMzqNFiGJR1WRc4K5QiPSugb4y');

  const program = new Program(idl as Idl, programId)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!publicKey) {
          return;
        }

        const publicKeyBuffer = publicKey.toBuffer();
        
        // Example usage of PublicKey.findProgramAddressSync, adjust as per your needs
        let [treasury] = PublicKey.findProgramAddressSync(
          [Buffer.from("vote_vaulttremp")],
          program.programId
        );
        setTreasuryAccount(treasury);

        let userTrempToken = await getTrempTokenAddress(publicKey).then(tokenAddress => {
          return tokenAddress;
        })
        .catch(error => {
          console.error("Error fetching token address:", error);
        });
        setVoteWifTrempAccount(userTrempToken)
        let [voteInfoAddress] = PublicKey.findProgramAddressSync(
          [Buffer.from("votewiftremp_info"), publicKeyBuffer],
          program.programId
        );
        setVoteInfo(voteInfoAddress);

        let [globalVote] = PublicKey.findProgramAddressSync(
          [Buffer.from("votewiftrempglobal")],
          program.programId
        );
        setGlobalVoteAccount(globalVote);

        let [voteToken] = PublicKey.findProgramAddressSync(
          [Buffer.from("votewiftremptoken"), publicKeyBuffer],
          program.programId
        );
        setVoteAccount(voteToken);

        const balance = await getTokenBalance(publicKey);
        setTokenBalance(balance);
        setIsLoading(false);
        console.log("voteaccount", voteAccount)
    console.log("voteInfoaccount", voteInfo)
    console.log("userVotewiftrempAccount", voteWifTrempAccount)
    console.log("treasuryAccount", treasuryAccount)
    console.log("global vote", globalVoteAccount)

      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [publicKey, connection]); // Added publicKey as a dependency

  const handleAmountChange = (event, newValue) => {
    setAmount(newValue);
  };

  const handleSubmit = async() => {
    if (amount < 5000) {
      alert('You need to have at least 5000 votes to submit.');
      return;
    }
    console.log(voteInfo, treasuryAccount, globalVoteAccount, voteAccount,voteWifTrempAccount, MINT, wallet?.publicKey);
console.log(provider)
      const tx = await program.methods
      .vote(new BN(10000), true , { oneMinute: {} })
        .accounts({
          voteInfoAccount: voteInfo,
          treasuryAccount: treasuryAccount,
          globalVoteAccount: globalVoteAccount,
          voteAccount: voteAccount,
          userVoteWifTrempAccount: voteWifTrempAccount,
          mint: MINT,
          signer: wallet?.publicKey,
          // Add more accounts as needed
        }).transaction();
        provider.sendAndConfirm(tx);
        tx.feePayer = wallet?.publicKey;
    
        console.log("Your transaction signature place vote", tx)
    
  

        
  };

  if (!connected) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <WalletMultiButton />
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (tokenBalance < 5000) {
    return (
      <div style={{ margin: '20px auto', textAlign: 'center' }}>
        <p>You need to have at least 5000 votes to place your vote.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="time-length-label">Time Length</InputLabel>
        <Select
          labelId="time-length-label"
          value={timeLength}
          onChange={(e) => setTimeLength(e.target.value)}
        >
          <MenuItem value="1 day">1 day</MenuItem>
          <MenuItem value="1 week">1 week</MenuItem>
          <MenuItem value="1 month">1 month</MenuItem>
          <MenuItem value="election day">Election Day</MenuItem>
        </Select>
      </FormControl>

      <div style={{ margin: '20px 0' }}>
        <InputLabel>Amount: {amount}</InputLabel>
        <Slider
          value={amount}
          min={5000}
          max={tokenBalance}
          step={100}
          onChange={handleAmountChange}
          valueLabelDisplay="auto"
        />
      </div>

      <FormControl component="fieldset" margin="normal">
        <RadioGroup value={candidate} onChange={(e) => setCandidate(e.target.value)}>
          <FormControlLabel value="boden" control={<Radio />} label="Boden" />
          <FormControlLabel value="tremp" control={<Radio />} label="Tremp" />
        </RadioGroup>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Place Vote
      </Button>
    </div>
  );
};

export default PlaceVote;
