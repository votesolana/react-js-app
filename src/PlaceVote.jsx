import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Connection, Struct } from "@solana/web3.js";
import { useState, useEffect } from "react";

import * as borsh from 'borsh';
import { Buffer } from "buffer";

const globalInfoAccount = "7uGibYhUzB8mrLvHqR6uSZotmnuSQTFtMfrTcDDD5Sq3";
const globalInfoPublicKey = new PublicKey(globalInfoAccount);


const connectionLocal = new Connection('http://127.0.0.1:8899', 'confirmed')




// Flexible class that takes properties and imbues them
// to the object instance
class Assignable {
  constructor(properties) {
    Object.keys(properties).map((key) => {
      return (this[key] = properties[key]);
    });
  }
}

export class AccoundData extends Assignable {}

const dataSchema = new Map([
  [
    AccoundData,
    {
      kind: "struct",
      fields: [
        ["tremp", "u32"],
        ["boden", "u32"],
      ],
    },
  ],
]);


export async function getAccountData(
  connection,
  account
){
  let nameAccount = await connection.getAccountInfo(account, "processed");
  return borsh.deserialize(dataSchema, AccoundData, nameAccount.data);
}


console.log(getAccountData(connectionLocal, globalInfoPublicKey));








const PlaceVote = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [title, setTitle] = useState("Place Vote Component");




  return (
    <div>
      <h1>{title}</h1>
      <button onClick={() => setTitle(publicKey ? publicKey.toBase58() : "No PublicKey")}>
        Change Title
      </button>
    </div>
  );
};

export default PlaceVote;
