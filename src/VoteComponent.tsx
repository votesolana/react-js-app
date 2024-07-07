import React, { useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Slider, Select, MenuItem, Button, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { PublicKey, Keypair } from '@solana/web3.js';
import { Program, Idl, AnchorProvider, setProvider, BN } from '@coral-xyz/anchor';
import { fetchUserVoteInfo, getTokenBalance, getTrempTokenAddress } from './blockchainData/globalVotes';
import idl from './blockchainData/idl.json';
import { mintTo } from "@solana/spl-token";

const mintKeypair = Keypair.fromSecretKey(new Uint8Array([
    228, 20, 203, 114, 138, 221, 55, 253, 249, 14, 147,
    163, 173, 20, 151, 0, 11, 17, 10, 157, 49, 178,
    185, 26, 156, 224, 229, 49, 149, 103, 54, 123, 87,
    200, 164, 167, 140, 182, 196, 90, 158, 150, 65, 160,
    113, 178, 68, 130, 117, 64, 104, 126, 104, 40, 216,
    248, 29, 116, 77, 168, 169, 120, 236, 65
]));

const VoteComponent = () => {
  const { connected, publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  const [treasuryAccount, setTreasuryAccount] = useState(null);
  const [voteWifTrempAccount, setVoteWifTrempAccount] = useState(null);
  const [voteInfo, setVoteInfo] = useState(null);
  const [voteInfoData, setVoteInfoData] = useState(null);
  const [globalVoteAccount, setGlobalVoteAccount] = useState(null);
  const [voteAccount, setVoteAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [amount, setAmount] = useState(5000);
  const [candidate, setCandidate] = useState('tremp');
  const [timeLength, setTimeLength] = useState('1 day');

  const provider = useMemo(() => new AnchorProvider(connection, wallet, { commitment: 'processed' }), [connection, wallet]);
  setProvider(provider);

  const programId = new PublicKey('FfUTJ9ehMc2wbB4mXp6KmM2idNZE1p4qFFVPysGFB3Gi');
  const MINT = new PublicKey('6ufvLNfXc5MhwnTx2437xzP3PHYu9xt54TPf3ACshE56');
  const program = new Program(idl as Idl, programId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!publicKey) return;

        let userVoteInfoAddress = PublicKey.findProgramAddressSync(
          [Buffer.from("votewiftremp_info"), publicKey.toBuffer()],
          program.programId
        );
        console.log("voteinfo", userVoteInfoAddress[0]);
        let voteInfo = await fetchUserVoteInfo(userVoteInfoAddress[0]);
        setVoteInfoData(voteInfo);
        console.log(voteInfo);

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
        setVoteWifTrempAccount(userTrempToken);

        let [voteInfoAddress] = PublicKey.findProgramAddressSync(
          [Buffer.from("votewiftremp_info"), publicKey.toBuffer()],
          program.programId
        );
        setVoteInfo(voteInfoAddress);

        let [globalVote] = PublicKey.findProgramAddressSync(
          [Buffer.from("votewiftrempglobal")],
          program.programId
        );
        setGlobalVoteAccount(globalVote);

        let [voteToken] = PublicKey.findProgramAddressSync(
          [Buffer.from("votewiftremptoken"), publicKey.toBuffer()],
          program.programId
        );
        setVoteAccount(voteToken);

        const balance = await getTokenBalance(publicKey);
        setTokenBalance(balance);
        console.log('hi')
        setIsLoading(false);
        setDataFetched(true);
      } catch (error) {
        if (error.message === "Account does not exist") {
          // This means the user has never voted before
          setVoteInfoData(null);
          setIsLoading(false);
          setDataFetched(true);
        } else {
          setError(error);
          setIsLoading(false);
        }
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData()
    }, 9000);

    return () => clearInterval(interval);

  }, [publicKey, connection, dataFetched]);

  const handleAmountChange = (event, newValue) => {
    setAmount(newValue);
  };

  const calculateRewards = useMemo(() => {
    const baseRate = 20; // 20 tokens for 100 tokens input for 5 months
    let rewardRateDenominator = 0.2;

    switch (timeLength) {
      case '1 day':
        rewardRateDenominator /= (5.0 * 4 * 7 * 3); // Adjusted for 1 day lock
        break;
      case '1 week':
        rewardRateDenominator /= (5.0 * 4 * 2); // Adjusted for 1 week lock
        break;
      case '1 month':
        rewardRateDenominator /= (5.0 * 1.5); // Adjusted for 1 month lock
        break;
      case 'election day':
        rewardRateDenominator = 0.2; // Adjusted for election day lock
        break;
      default:
        rewardRateDenominator = 0.2; // Default to 1 if no valid timeLength is provided
    }

    // Calculate rewards based on the adjusted reward rate denominator
    return Math.round(amount * rewardRateDenominator);
  }, [amount, timeLength]);

  const handleSubmit = async () => {
    if (amount < 5000) {
      alert('You need to have at least 5000 votes to submit.');
      return;
    }

    // Dynamically set the time length object key
    const timeLengthObj = (() => {
      switch (timeLength) {
        case '1 day':
          return { oneDay: {} };
        case '1 week':
          return { oneWeek: {} };
        case '1 month':
          return { oneMonth: {} };
        case 'election day':
          return { electionDay: {} };
        default:
          return { oneDay: {} };
      }
    })();
    console.log(voteInfo, treasuryAccount, globalVoteAccount, voteAccount, voteWifTrempAccount, MINT)
    console.log("[rpgram id", program.programId)
    const tx = await program
      .methods
      .vote(new BN(amount), candidate === 'tremp', timeLengthObj)
      .accounts({
        voteInfoAccount: voteInfo,
        treasuryAccount,
        globalVoteAccount,
        voteAccount,
        userVoteWifTrempAccount: voteWifTrempAccount,
        mint: MINT,
        signer: wallet?.publicKey,
      })
      .transaction();

    provider.sendAndConfirm(tx);
    tx.feePayer = wallet?.publicKey;

    console.log('Your transaction signature place vote', tx);
  };

  const handleClaim = async () => {
    try {
      const tx = await program.methods
        .collectVote()
        .accounts({
          voteInfoAccount: voteInfo.publicKey, // Use the correct voteInfo account public key
          voteAccount: voteInfo.vote_account, // Assuming vote_account is a part of voteInfo object
          userVoteWifTrempAccount: voteInfo.user_vote_wif_tremp_account, // Assuming user_vote_wif_tremp_account is a part of voteInfo object
          mint: MINT,
          signer: wallet.publicKey,
        }).transaction();
      provider.sendAndConfirm(tx);
      tx.feePayer = wallet?.publicKey;

      console.log('Your transaction signature claim vote', tx);
    } catch (error) {
      console.error('Claim vote transaction error:', error);
    }
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
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
        <p>You need at least 5000 vote tokens to place a vote.</p>
      </div>
    );
  }

  if (voteInfoData && voteInfoData.is_voted) {
    console.log("bob", voteInfoData)
    const endTime = Number(voteInfoData.vote_locked_until) - Math.floor(Date.now() / 1000);
    const formatTime = (seconds) => {
      const months = Math.floor(seconds / (30 * 24 * 60 * 60));
      seconds -= months * 30 * 24 * 60 * 60;
      const days = Math.floor(seconds / (24 * 60 * 60));
      seconds -= days * 24 * 60 * 60;
      const hours = Math.floor(seconds / (60 * 60));
      seconds -= hours * 60 * 60;
      const minutes = Math.floor(seconds / 60);
      seconds -= minutes * 60;
      return `${months}M ${days}D ${hours}H ${minutes}m ${seconds}s`;
    }

    return (
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
        <p>Vote Amount: {voteInfoData.vote_amount}</p>
        <p>Voted for: {voteInfoData.wif_tremp ? 'Tremp' : 'Boden'}</p>
        {endTime > 0 ? (
          <p>Time Left: {formatTime(endTime)}</p>
        ) : (
          <p>Your votes and rewards are unlocked.</p>
        )}
        <Button variant="contained" color="primary" onClick={handleClaim} disabled={endTime > 0}>
          Claim
        </Button>
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

      <div style={{ margin: '20px 0' }}>
        <p>Total Vote Tokens: {tokenBalance}</p>
        <p>Estimated Rewards: {calculateRewards} tokens</p>
      </div>

      <Button variant="contained" color="primary" onClick={handleSubmit} disabled={amount < 5000}>
        Place Vote
      </Button>
    </div>
  );
};

export default VoteComponent;
