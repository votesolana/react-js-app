import { PublicKey, Connection } from "@solana/web3.js";
import { u32, struct } from '@solana/buffer-layout';




const payee = new PublicKey("Ew824EPiCGbFnL6jkY1JP8qY6n5oRu1DhSLo59fmwkdb");

const programId = new PublicKey("98q6XA7arUMxoc7bLNW1ZQtUvckjQzyo4DzH67w6boe6");
const MINT = new PublicKey('7Ub3EfvT4x7qBpLaYEvMzqNFiGJR1WRc4K5QiPSugb4y');    // e.g., EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

const globalInfoAccount = "7WX6RsrJV8s2dYNcL7eCKFQqo4ZxHsU4trXGCSJMSyre";
const globalInfoPublicKey = new PublicKey(globalInfoAccount);


const connectionLocal = new Connection('https://api.testnet.solana.com', 'confirmed');


const GlobalVoteLayout = struct([
  u32('tremp'),
  u32('boden'),
]);

export const fetchData = async () => {
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
