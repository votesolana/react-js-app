

import "./App.css";
import VoteBar from './VoteBar.jsx';
import VoteComponent from './VoteComponent.js';
import PresidentDisplay from './PresidentDisplay.js';

import { fetchUserVoteInfo, getTreasuryBalance } from './blockchainData/globalVotes';

import React, { useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

import { Program, Idl, AnchorProvider, setProvider, BN } from "@coral-xyz/anchor";
import idl from "./blockchainData/idl.json";
import { fetchGlobalAccountData } from './blockchainData/globalVotes.ts';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

const programId = new PublicKey("FfUTJ9ehMc2wbB4mXp6KmM2idNZE1p4qFFVPysGFB3Gi");

const program = new Program(idl as Idl, programId);









const App = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.

    const network = WalletAdapterNetwork.Testnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [

            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );


    const [amount, setAmount] = useState(5000);
    const [candidate, setCandidate] = useState("tremp");
    const [timeLength, setTimeLength] = useState("1 day");
    const [voteData, setVoteData] = useState(null);
    const [treasuryData, setreasuryData] = useState(null);

    useEffect(() => {
        const getVoteData = async () => {
            const data = await fetchGlobalAccountData();
            setVoteData(data);
        };

        const getTreasuryData = async () => {
            const data = await getTreasuryBalance();
            setreasuryData(data);
        };


        getVoteData()
        getTreasuryData();
        const interval = setInterval(() => {
            getVoteData()
        }, 9000);


        return () => clearInterval(interval)
    }, []);

    if (!voteData) {
        return <p>Loading vote data...</p>;
    }

    let { tremp, boden } = voteData;
    if (boden === 0) {
        boden = 1;
    }


    const getImageForCandidate = (candidate, timeLength) => {
        if (candidate === 'tremp') {
            if (timeLength === '1 day') return '../tremp1.png';
            if (timeLength === '1 week') return '../tremp2.png';
            if (timeLength === '1 month') return '../tremp3.png';
            return '../tremp4.png';
        } else {
            if (timeLength === '1 day') return '../biden1.png';
            if (timeLength === '1 week') return '../biden2.png';
            if (timeLength === '1 month') return '../biden3.png';
            return '../biden4.png';
        }
    };
    const trempImage = candidate === 'tremp' ? getImageForCandidate('tremp', timeLength) : '../tremp1.png';
    const bodenImage = candidate === 'boden' ? getImageForCandidate('boden', timeLength) : '../biden1.png';





    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <div className="app-container">
                        <img src="../header.png" alt="Header" className="header-image" />
                        <div className="horizontal-layout">


                            <PresidentDisplay imageSrc={bodenImage} isSelected={candidate === 'boden'} totalVotes={boden} presidentTitle={"Jeo Boden"} podiumImageSrc={"../podium.png"} presidentLink={"https://www.boden4pres.com/"} />
                            <VoteBar timeLength={timeLength} candidate={candidate} trempAmount={tremp} bodenAmount={boden} />
                            <PresidentDisplay imageSrc={trempImage} isSelected={candidate === 'tremp'} totalVotes={tremp} presidentTitle={"Doland Tremp"} podiumImageSrc={"../podium2.png"} presidentLink={"https://www.tremp.xyz/"} />
                        </div>
                        <VoteComponent
                            amount={amount}
                            setAmount={setAmount}
                            candidate={candidate}
                            setCandidate={setCandidate}
                            timeLength={timeLength}
                            setTimeLength={setTimeLength}
                        />
                    </div>

       
                    <div className="treasury-container">
                        <h2 className="treasury-title">Treasury Amount</h2>

                        <img src="../voteVaultBackground.png" alt="TreasuryBackground" className="treasury-image" />
                        <div className="treasury-value">{Math.round(treasuryData)}<br />$VOTE</div>

                    </div>

                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;