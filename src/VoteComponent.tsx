import React, { useState, useEffect, useMemo } from 'react';
import { useWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Slider, Select, MenuItem, Button, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';
import { PublicKey, Keypair } from '@solana/web3.js';
import { Program, Idl, AnchorProvider, setProvider, BN } from '@coral-xyz/anchor';
import { fetchUserVoteInfo, getTokenBalance, getTrempTokenAddress } from './blockchainData/globalVotes';
import idl from './blockchainData/idl.json';
import { mintTo } from "@solana/spl-token";
import "./VoteComponent.css";



const formatNumberWithCommas = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

const VoteComponent = ({ candidate, setCandidate, timeLength, setTimeLength }) => {
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
  const [acknowledge, setAcknowledge] = useState(false);

  const [countdown, setCountdown] = useState(0);

  const provider = useMemo(() => new AnchorProvider(connection, wallet, { commitment: 'processed' }), [connection, wallet]);
  setProvider(provider);


  const programId = new PublicKey('H6tgcEthAFnd2aiJp8ne4mE7FaonG1eP9ryXeodqn1ep');
  const MINT = new PublicKey('7xyVxmGWot6kWD3Su7g717UU4JiBWxsKGfzNtn61vbcV');
  const program = new Program(idl as Idl, programId);

  useEffect(() => {
    if (tokenBalance < 5000 && (!voteInfoData || !voteInfoData.is_voted)) {
      // Ensure the script runs on the client side
      if (typeof window !== 'undefined' && window.Jupiter) {
        window.Jupiter.init({
          displayMode: 'integrated',
          strictTokenList: false,
          integratedTargetId: 'integrated-terminal',
          endpoint: 'https://api.mainnet-beta.solana.com',
          formProps: {
            initialOutputMint: '7xyVxmGWot6kWD3Su7g717UU4JiBWxsKGfzNtn61vbcV',
            fixedOutputMint: false,
          },
        });
      }
    }
  }, [tokenBalance, voteInfoData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!publicKey) return;

        let userVoteInfoAddress = PublicKey.findProgramAddressSync(
          [Buffer.from("votewiftremp_info"), publicKey.toBuffer()],
          program.programId
        );
        let voteInfo = await fetchUserVoteInfo(userVoteInfoAddress[0]);
        setVoteInfoData(voteInfo);

        if (voteInfo && voteInfo.is_voted) {
          const endTime = Number(voteInfo.vote_locked_until) - Math.floor(Date.now() / 1000);
          setCountdown(endTime > 0 ? endTime : 0);
        }

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
        setIsLoading(false);
        setDataFetched(true);
      } catch (error) {
        if (error.message === "Account does not exist") {
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
    }, 30000);

    return () => clearInterval(interval);

  }, [publicKey, connection, dataFetched]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleAmountChange = (event, newValue) => {
    setAmount(newValue);
  };

  const calculateRewards = useMemo(() => {
    let rewardRateDenominator = 0.1;

    switch (timeLength) {
      case '1 day':
        rewardRateDenominator /= (5.0 * 4 * 7 * 3);
        break;
      case '1 week':
        rewardRateDenominator /= (5.0 * 4 * 2);
        break;
      case '1 month':
        rewardRateDenominator /= (5.0 * 1.5);
        break;
      case 'election day':
        rewardRateDenominator = 0.1;
        break;
      default:
        rewardRateDenominator = 0.1;
    }

    return formatNumberWithCommas(Math.round(amount * rewardRateDenominator));
  }, [amount, timeLength]);

  const handleSubmit = async () => {
    if (amount < 5000) {
      alert('You need to have at least 5000 votes to submit.');
      return;
    }

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
    //console.log(voteInfo, treasuryAccount, globalVoteAccount, voteAccount, voteWifTrempAccount, MINT)
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
          voteInfoAccount: voteInfo.publicKey,
          voteAccount: voteInfo.vote_account,
          userVoteWifTrempAccount: voteInfo.user_vote_wif_tremp_account,
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

  const formatTime = (seconds) => {
    if (seconds <= 0) return "0M 0D 0H 0m 0s";

    const months = Math.floor(seconds / (30 * 24 * 60 * 60));
    seconds -= months * 30 * 24 * 60 * 60;
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return `${formatNumberWithCommas(months)}M ${formatNumberWithCommas(days)}D ${formatNumberWithCommas(hours)}H ${formatNumberWithCommas(minutes)}m ${formatNumberWithCommas(seconds)}s`;
  }

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

  

  if (tokenBalance < 5000 && (!voteInfoData || !voteInfoData.is_voted)) {

    return (
      <div className="vote-container">
        <p><b>You need at least 5000 tokens to place a vote.</b></p>
        <p>Buy some vote below:</p>
        <div id="integrated-terminal"></div>

      </div>
    );
  }

  if (voteInfoData && voteInfoData.is_voted) {
    return (
      <div className="vote-container">
        <h2>Your Votes Are Sealed</h2>
        <p>Vote Amount: {formatNumberWithCommas(voteInfoData.vote_amount)}</p>
        <p>Voted for: {voteInfoData.wif_tremp ? 'Doland Tremp' : 'Kamala Horris'}</p>
        {countdown > 0 ? (
          <div className="clock-countdown">
            <p>Time Left: {formatTime(countdown)}</p>
          </div>
        ) : (
          <p>Your votes and rewards are unlocked.</p>
        )}
        <div className="button-container">
          <Button variant="contained" color="primary" onClick={handleClaim} disabled={countdown > 0}>
            Claim
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="vote-container">
      <h3>Place Your Vote:</h3>
       <div className="form-wrapper">
      <FormControl fullWidth margin="normal" className="form-control">
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

      <div className="slider-container">
        <InputLabel className="slider-label">Amount: {formatNumberWithCommas(amount)}</InputLabel>
        <Slider
          value={amount}
          min={5000}
          max={tokenBalance}
          step={100}
          onChange={handleAmountChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatNumberWithCommas}
        />
      </div>

      <FormControl component="fieldset" className="form-control">
        <RadioGroup value={candidate} onChange={(e) => setCandidate(e.target.value)} className="radio-group">
          <FormControlLabel value="boden" control={<Radio />} label="Kamala Horris" />
          <FormControlLabel value="tremp" control={<Radio />} label="Doland Tremp" />
        </RadioGroup>
      </FormControl>

      <div className="token-info">
        <p>Your Tokens: {formatNumberWithCommas(tokenBalance)}</p>
        <p>Estimated Rewards: {calculateRewards} tokens</p>
      </div>
    
      <FormControlLabel
        control={
              
              

          <Checkbox
            checked={acknowledge}
            onChange={(e) => setAcknowledge(e.target.checked)}
            name="acknowledge"
            color="primary"
          />
        }
        label="I acknowledge that I can only place one vote, and it will be locked until the time expires."
      />

      <div className="button-container">
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={amount < 5000 || !acknowledge}>
          Place Vote
        </Button>
      </div>
      </div>
    </div>
  );
};

export default VoteComponent;
