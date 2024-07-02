import { serialize, deserialize, deserializeUnchecked } from "borsh";
import { Buffer } from "buffer";
import {
  Keypair,
  AccountMeta,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";




const dataSchema = new Map([
  [
    {
      kind: "struct",
      fields: [
        ["tremp", "u32"],
        ["boden", "u32"],
      ],
    },
  ],
]);

/**
 * Fetch program account data
 * @param connection - Solana RPC connection
 * @param account - Public key for account whose data we want
 * @return {Promise<AccoundData>} - Keypair
 */
export async function getAccountData(connection, account) {
  let nameAccount = await connection.getAccountInfo(account, "processed");
  return deserializeUnchecked(dataSchema, AccoundData, nameAccount.data);
}
