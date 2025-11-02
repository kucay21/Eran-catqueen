import React, { useState, useEffect } from "react";
import {
  ThirdwebProvider,
  ConnectWallet,
  useAddress,
  useContract,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { Base } from "@thirdweb-dev/chains";

const TOKEN_ADDRESS = "0x586f3cb4a16c8dbf6a62b599a73eca9cd0b945fe"; // tokenmu
const STAKING_CONTRACT = "0xef7d6880e7837D06bAa6090F8378592F3B4e174a"; // stakingmu

function StakePage() {
  const address = useAddress();
  const { contract: token } = useContract(TOKEN_ADDRESS);
  const { contract: staking } = useContract(STAKING_CONTRACT);
  const { data: tokenBalance } = useTokenBalance(token, address);
  const [stakedAmount, setStakedAmount] = useState("0");

  useEffect(() => {
    const loadStaked = async () => {
      if (!staking || !address) return;
      try {
        const data = await staking.call("getStakeInfo", [address]);
        setStakedAmount(data[0]?.toString() || "0");
      } catch (e) {
        console.log("Gagal load stake info:", e);
      }
    };
    loadStaked();
  }, [staking, address]);

  return (
    <div style={{ padding: 20, textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>Cat Queen Staking</h1>
      <ConnectWallet theme="dark" />
      {address && (
        <>
          <p><b>Wallet:</b> {address}</p>
          <p><b>Saldo:</b> {tokenBalance?.displayValue} {tokenBalance?.symbol}</p>
          <p><b>Staked:</b> {stakedAmount}</p>

          <Web3Button
            contractAddress={TOKEN_ADDRESS}
            action={async (contract) =>
              await contract.call("approve", [STAKING_CONTRACT, "1000000000000000000000000"])
            }
          >
            Approve Token
          </Web3Button>

          <Web3Button
            contractAddress={STAKING_CONTRACT}
            action={async (contract) => await contract.call("stake", [100])}
          >
            Stake 100 Token
          </Web3Button>

          <Web3Button
            contractAddress={STAKING_CONTRACT}
            action={async (contract) => await contract.call("withdraw", [100])}
          >
            Unstake 100 Token
          </Web3Button>

          <Web3Button
            contractAddress={STAKING_CONTRACT}
            action={async (contract) => await contract.call("claimRewards")}
          >
            Claim Reward
          </Web3Button>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThirdwebProvider clientId="77bdb1a4b615d59917efaef65a2b745e" activeChain={Base}>
      <StakePage />
    </ThirdwebProvider>
  );
}