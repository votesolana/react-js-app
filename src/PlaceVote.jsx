import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Slider, Select, MenuItem, Button, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

const PlaceVote = () => {
  const { publicKey, connect, connected } = useWallet();
  const [amount, setAmount] = useState(5000);
  const [timeLength, setTimeLength] = useState("1 day");
  const [candidate, setCandidate] = useState("tremp");

  const handleAmountChange = (event, newValue) => {
    setAmount(newValue);
  };

  const handleSubmit = () => {
    // Add logic to submit the vote
    console.log("Vote submitted:", { amount, timeLength, candidate });
  };

  if (!connected) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={connect}>
          Connect Wallet
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
          max={30000}
          step={100}
          onChange={handleAmountChange}
          valueLabelDisplay="auto"
        />
      </div>

      <FormControl component="fieldset" margin="normal">
        <RadioGroup value={candidate} onChange={(e) => setCandidate(e.target.value)}>
          <FormControlLabel value="tremp" control={<Radio />} label="Tremp" />
          <FormControlLabel value="boden" control={<Radio />} label="Boden" />
        </RadioGroup>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Place Vote
      </Button>
    </div>
  );
};

export default PlaceVote;
