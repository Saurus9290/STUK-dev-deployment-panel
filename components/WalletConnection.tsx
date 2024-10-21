import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const WalletConnection = () => {
  const { publicKey } = useWallet();

  return (
    <div className="mb-4">
      <WalletMultiButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg" />
      {publicKey && (
        <p className="text-gray-600 font-semibold mt-2">
          Connected:{" "}
          <span className="text-gray-800">{publicKey.toBase58()}</span>
        </p>
      )}
    </div>
  );
};

export default WalletConnection;
