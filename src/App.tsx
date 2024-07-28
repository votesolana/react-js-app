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

const programId = new PublicKey("H6tgcEthAFnd2aiJp8ne4mE7FaonG1eP9ryXeodqn1ep");
const program = new Program(idl as Idl, programId);


const formatNumberWithCommas = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
};

const App = () => {
    const network = WalletAdapterNetwork.Mainnet;

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);


    const [candidate, setCandidate] = useState("tremp");
    const [timeLength, setTimeLength] = useState("1 day");
    const [voteData, setVoteData] = useState({ tremp: 0, boden: 0 });
    const [treasuryData, setTreasuryData] = useState(0)

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
        }, 30000);

        const treasuryDataInterval = setInterval(() => {
            getTreasuryData();
        }, 30000);

        return () => {
            clearInterval(voteDataInterval);
            clearInterval(treasuryDataInterval);
        };
    }, []);



    let { tremp, boden } = voteData;
    if (boden === 0) {
        boden = 1;
    }

    const getImageForCandidate = (candidate, timeLength) => {
        if (candidate === 'tremp') {
            if (timeLength === '1 day') return 'tremp1.png';
            if (timeLength === '1 week') return 'tremp2.png';
            if (timeLength === '1 month') return 'tremp3.png';
            return 'tremp4.png';
        } else {
            if (timeLength === '1 day') return '/biden1.png';
            if (timeLength === '1 week') return '/biden2.png';
            if (timeLength === '1 month') return '/biden3.png';
            return '/biden4.png';
        }
    };

    const trempImage = candidate === 'tremp' ? getImageForCandidate('tremp', timeLength) : '/tremp1.png';
    const bodenImage = candidate === 'boden' ? getImageForCandidate('boden', timeLength) : '/biden1.png';
    const totalVotes = tremp + boden;

    const trempPercentage = Math.round((tremp / totalVotes) * 100);
    const bodenPercentage = Math.round((boden / totalVotes) * 100);


    const handleCandidateClick = (newCandidate) => {
        setCandidate(newCandidate);
    };

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className='wallet-button-container'>
                        <WalletMultiButton />
                    </div>

                    <div className="app-container">
                        <img src="/header.png" alt="Header" className="header-image" />
                        <div className="horizontal-layout">
                            <VoteBar timeLength={timeLength} candidate={candidate} trempAmount={tremp} bodenAmount={boden} />
                        </div>


                        <div className="horizontal-layout">

                            <PresidentDisplay imageSrc={bodenImage} isSelected={candidate === 'boden'} totalVotes={boden} presidentTitle={"Kamala Horris"} podiumImageSrc={"/podium1.png"} onClick={() => handleCandidateClick('boden')} />
                            <div className="vote-bar-percentage">{bodenPercentage}% / {trempPercentage}%</div>

                            <PresidentDisplay imageSrc={trempImage} isSelected={candidate === 'tremp'} totalVotes={tremp} presidentTitle={"Doland Tremp"} podiumImageSrc={"/podium2.png"} onClick={() => handleCandidateClick('tremp')} />
                        </div>
                        <VoteComponent
                            candidate={candidate}
                            setCandidate={setCandidate}
                            timeLength={timeLength}
                            setTimeLength={setTimeLength}
                        />

                        <div className='social-media-container'>
                            <div className="social-media-button">
                                <a href="https://t.me/VoteCTO" className="social-button" target="_blank" aria-label="Telegram"><i className="fab fa-telegram"></i></a>
                                <a href="https://x.com/Vote_Solana" className="social-button" target="_blank" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                                <a href="https://discord.gg/BAMfpUN78s" className="social-button" target="_blank" aria-label="Discord"><i className="fab fa-discord"></i></a>
                                <a href="https://docs.votesolana.com" className="social-button" target="_blank" aria-label="Docs"><i className="fa-solid fa-book"></i></a>
                            </div></div>

                        <a href="https://explorer.solana.com/address/GuBRTEBKztmSHSVJuXW4gRqaT1J5HDr7jUFkGjyfFcrk">
                            <div className="treasury-container">
                                <img src="/voteVaultBackground.png" alt="TreasuryBackground" className="treasury-image" />

                                <div className="treasury-value">{formatNumberWithCommas(Math.round(treasuryData))}<br />$VOTE</div>

                            </div>
                        </a>
                        <h1 className="ca">CA: 7xyVxmGWot6kWD3Su7g717UU4JiBWxsKGfzNtn</h1>
        <div className="dextools-widget-container">

                      
                        <iframe

                            id="dextools-widget"
                            title="DEXTools Trading Chart"
                            width="500"
                            height="400"
                            src="https://www.dextools.io/widget-chart/en/solana/pe-light/4bVgF1rVkSQtFqe16Km9szeKdhuspuq8PFqqbn2mktG9?theme=light&chartType=2&chartResolution=30&drawingToolbars=false"
                        ></iframe>
                        </div>
                        <div className="disclaimer">
                            <p>This is a fictional crypto project created for entertainment purposes only. We are not responsible for any real-world implications. If for any circumstances a candidate changes your vote will remain in the according pool.</p>
                        </div>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
