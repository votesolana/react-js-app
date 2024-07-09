import React, { useMemo, useState, useEffect } from 'react';
import "./App.css";
import VoteBar from './VoteBar.jsx';
import VoteComponent from './VoteComponent.js';
import PresidentDisplay from './PresidentDisplay.js';

import { fetchUserVoteInfo, getTreasuryBalance, fetchGlobalAccountData } from './blockchainData/globalVotes';
import { ConnectionProvider, WalletProvider, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Program, Idl, AnchorProvider, setProvider, BN } from "@coral-xyz/anchor";
import { Buffer } from 'buffer';
import idl from "./blockchainData/idl.json";
global.Buffer = Buffer;

import '@solana/wallet-adapter-react-ui/styles.css';

const programId = new PublicKey("FfUTJ9ehMc2wbB4mXp6KmM2idNZE1p4qFFVPysGFB3Gi");
const program = new Program(idl as Idl, programId);


const formatNumberWithCommas = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
};

const App = () => {
    const network = WalletAdapterNetwork.Testnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);

    const [amount, setAmount] = useState(5000);
    const [candidate, setCandidate] = useState("tremp");
    const [timeLength, setTimeLength] = useState("1 day");
    const [voteData, setVoteData] = useState(null);
    const [treasuryData, setTreasuryData] = useState(null);

    useEffect(() => {
        const getVoteData = async () => {
            const data = await fetchGlobalAccountData();
            setVoteData(data);
        };

        const getTreasuryData = async () => {
            const data = await getTreasuryBalance();
            setTreasuryData(data);
        };

        getVoteData();
        getTreasuryData();

        const voteDataInterval = setInterval(() => {
            getVoteData();
        }, 9000);

        const treasuryDataInterval = setInterval(() => {
            getTreasuryData();
        }, 9000);

        return () => {
            clearInterval(voteDataInterval);
            clearInterval(treasuryDataInterval);
        };
    }, []);

    if (!voteData || !treasuryData) {
        return <p>Loading data...</p>;
    }

    let { tremp, boden } = voteData;
    if (boden === 0) {
        boden = 1;
    }

    const getImageForCandidate = (candidate, timeLength) => {
        if (candidate === 'tremp') {
            if (timeLength === '1 day') return '/test/tremp1.png';
            if (timeLength === '1 week') return '/test/tremp2.png';
            if (timeLength === '1 month') return '/test/tremp3.png';
            return '/test/tremp4.png';
        } else {
            if (timeLength === '1 day') return '/test/biden1.png';
            if (timeLength === '1 week') return '/test/biden2.png';
            if (timeLength === '1 month') return '/test/biden3.png';
            return '/test/biden4.png';
        }
    };

    const trempImage = candidate === 'tremp' ? getImageForCandidate('tremp', timeLength) : '/test/tremp1.png';
    const bodenImage = candidate === 'boden' ? getImageForCandidate('boden', timeLength) : '/test/biden1.png';

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <div className="app-container">
                        <img src="/test/header.png" alt="Header" className="header-image" />
                        <div className="horizontal-layout">
                            <PresidentDisplay imageSrc={bodenImage} isSelected={candidate === 'boden'} totalVotes={boden} presidentTitle={"Jeo Boden"} podiumImageSrc={"/test/podium.png"} presidentLink={"https://www.boden4pres.com/"} />
                            <VoteBar timeLength={timeLength} candidate={candidate} trempAmount={tremp} bodenAmount={boden} />
                            <PresidentDisplay imageSrc={trempImage} isSelected={candidate === 'tremp'} totalVotes={tremp} presidentTitle={"Doland Tremp"} podiumImageSrc={"/test/podium2.png"} presidentLink={"https://www.tremp.xyz/"} />
                        </div>
                        <VoteComponent
                            amount={amount}
                            setAmount={setAmount}
                            candidate={candidate}
                            setCandidate={setCandidate}
                            timeLength={timeLength}
                            setTimeLength={setTimeLength}
                        />

                        <a href="https://explorer.solana.com/address/Bbptu2vKaMXrcAsfRvU8XJHj3U5J5U4GTY8PJwzosFkT?cluster=testnet">
                            <div className="treasury-container">
                                <h2 className="treasury-title">Treasury Amount</h2>
                                <img src="/test/voteVaultBackground.png" alt="TreasuryBackground" className="treasury-image" />

                                <div className="treasury-value">{formatNumberWithCommas(Math.round(treasuryData))}<br />$VOTE</div>

                            </div>
                        </a>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
