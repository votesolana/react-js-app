import { IdlAccounts, Program, Buffer } from "@coral-xyz/anchor";
import { IDL, GlobalVotes } from "./idl";
import { Connection, PublicKey } from "@solana/web3.js";
 
const programId = new PublicKey("BG9ALv3GkR7Uu6EWDh3KZVJnw1kj6223dmpC7i41CWeA");
const connectionLocal = new Connection('http://127.0.0.1:8899', 'confirmed')
 
// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
export const program = new Program(IDL, programId, {
  connectionLocal,
});
 
export const [globalVoteInfoPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("votewiftrempglobal")],
  program.programId,
);
program.account.counter.fetch(globalVoteInfoPDA).then(data => {
    console.log(data);
  });
