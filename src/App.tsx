


import VoteBar from './VoteBar.jsx';
import PlaceVote from './PlaceVote.js';
import PresidentDisplay from './PresidentDisplay.js';

import React, { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider,useAnchorWallet,useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';









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
      <div className="horizontal-layout">
        
     
        <PresidentDisplay imageSrc={bodenImage} isSelected={candidate === 'boden'} />
        <VoteBar timeLength={timeLength} candidate={candidate} />
        <PresidentDisplay imageSrc={trempImage} isSelected={candidate === 'tremp'} />
      </div>
      <PlaceVote
        amount={amount}
        setAmount={setAmount}
        candidate={candidate}
        setCandidate={setCandidate}
        timeLength={timeLength}
        setTimeLength={setTimeLength}
      />
    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;