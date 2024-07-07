import { PublicKey, Connection } from "@solana/web3.js";
import { u32, struct, u8 } from '@solana/buffer-layout';
import { u64, bool  } from '@solana/buffer-layout-utils';




const payee = new PublicKey("Ew824EPiCGbFnL6jkY1JP8qY6n5oRu1DhSLo59fmwkdb");

const programId = new PublicKey("FfUTJ9ehMc2wbB4mXp6KmM2idNZE1p4qFFVPysGFB3Gi");
const MINT = new PublicKey('6ufvLNfXc5MhwnTx2437xzP3PHYu9xt54TPf3ACshE56');    // e.g., EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

const globalInfoAccount = "CfVK3uzDMvN36arGDL3ZutE5yd3qc1Z6Lc6b9rtnDvFX";
const globalInfoPublicKey = new PublicKey(globalInfoAccount);


const connectionLocal = new Connection('https://api.testnet.solana.com', 'confirmed');


const GlobalVoteLayout = struct([
  u32('tremp'),
  u32('boden'),
]);

const UserVoteInfo = struct([
  u64('vote_locked_until'), // Exact time slot vote is placed
  bool('is_voted'),
  bool('wif_tremp'),
  u32('vote_amount'),
]);

export const fetchGlobalAccountData = async () => {
  try {
    const accountInfo = await connectionLocal.getAccountInfo(globalInfoPublicKey);
    if (accountInfo) {
      const bufferedData = Buffer.from(accountInfo.data);
      const modifiedBuffer = bufferedData.slice(8);
      const deserialized = GlobalVoteLayout.decode(modifiedBuffer);

      return deserialized;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return null;
};

export const fetchUserVoteInfo = async (accountAddress) => {
  try {
    const accountInfo = await connectionLocal.getAccountInfo(accountAddress);
    if (accountInfo) {
      const bufferedData = Buffer.from(accountInfo.data);
      const modifiedBuffer = bufferedData.slice(8);
      const deserialized = UserVoteInfo.decode(modifiedBuffer);

      return deserialized;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return null;
};

export const getTrempTokenAddress =  async (owner) => {
  try {
    // Find associated token address
    const [tokenAddress] = await PublicKey.findProgramAddress(
      [
        owner.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        MINT.toBuffer()
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    return tokenAddress;
  } catch (error) {
    console.error("Error fetching token address", error);
    return null;
  }
};



export const getTokenBalance = async (owner) => {
  try {
    // Find associated token address
    const [tokenAddress] = await PublicKey.findProgramAddress(
      [
        owner.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        MINT.toBuffer()
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Fetch token account balance
    const balance = await connectionLocal.getTokenAccountBalance(tokenAddress);
    console.log("Token balance:", balance); // Log balance for debugging

    return balance.value.uiAmount; // Return token balance
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return null;
  }
};


