
import { PublicKey, Connection } from "@solana/web3.js";
import { u32, struct } from '@solana/buffer-layout';

const globalInfoAccount = "7uGibYhUzB8mrLvHqR6uSZotmnuSQTFtMfrTcDDD5Sq3";
const globalInfoPublicKey = new PublicKey(globalInfoAccount);

const connectionLocal = new Connection('http://127.0.0.1:8899', 'confirmed');

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