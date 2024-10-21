import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { fetchAllAccounts, closeAccount } from "../utils/solana";
import Head from "next/head";
import {
  WalletDisconnectButton,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui";

const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";

const Dashboard = () => {
  const { publicKey, connected, signTransaction, sendTransaction } =
    useWallet();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);

  const connection = new Connection("https://api.devnet.solana.com");

  // Fetch all accounts when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      setLoading(true);

      fetchAllAccounts(publicKey)
        .then(setAccounts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [connected, publicKey]);

  // Handle account selection for closure
  const handleAccountSelection = (account: string) => {
    setSelectedAccounts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(account)) {
        newSet.delete(account);
      } else {
        newSet.add(account);
      }
      return newSet;
    });
  };

  // Handle closing selected accounts
  const handleCloseAccounts = async () => {
    if (!publicKey || !signTransaction || !sendTransaction) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setLoading(true);

      for (let account of selectedAccounts) {
        const accountInfo = accounts.find((acc) => acc.pubkey === account);
        if (accountInfo) {
          // Call the universal closeAccount function based on the program ID
          await closeAccount(
            new PublicKey(account), // Account public key
            publicKey, // Wallet public key (authority)
            accountInfo.ownerProgramId, // Owner program ID (Token Program or System Program)
            signTransaction, // Function to sign the transaction
            sendTransaction // Function to send the transaction
          );
        }
      }

      // Fetch updated accounts after closure
      fetchAllAccounts(publicKey).then(setAccounts).catch(console.error);
      setSelectedAccounts(new Set());

      alert("Selected accounts closed successfully!");
    } catch (error) {
      console.error("Error closing accounts:", error);
      alert("Failed to close accounts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-[#3798b0] to-[#665fcf] p-6">
      <Head>
        <title>Solana Token Account Manager</title>
      </Head>
      <div className="text-4xl font-extrabold text-gray-800 flex gap-4 mb-6">
        <h1>Solana Token Account Manager</h1>
        {connected && <WalletDisconnectButton />}
      </div>
      {!connected ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white shadow-md rounded-lg">
          <p className="text-lg text-gray-700">
            Please connect your wallet to continue.
          </p>
          <WalletModalButton />
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-lg text-gray-700 ml-4">
                Loading your accounts...
              </p>
            </div>
          ) : (
            <>
              {accounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white shadow-md rounded-lg">
                  <p className="text-lg text-gray-700">
                    No accounts found for this wallet.
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Your Accounts:
                  </h2>

                  <ul className="space-y-4">
                    {" "}
                    {/* Add spacing between items */}
                    {accounts.map((account) => {
                      // Determine the account type based on the owner program ID
                      let accountType = "Unknown Account";
                      if (account.ownerProgramId === SYSTEM_PROGRAM_ID) {
                        accountType = "Native SOL Account";
                      } else if (account.ownerProgramId === TOKEN_PROGRAM_ID) {
                        accountType = "SPL Token Account";
                      } else {
                        accountType = "Program Account";
                      }

                      return (
                        <li
                          key={account.pubkey}
                          className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
                        >
                          {" "}
                          {/* Better styling for each account item */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedAccounts.has(account.pubkey)}
                              onChange={() =>
                                handleAccountSelection(account.pubkey)
                              }
                              className="mr-3 h-5 w-5" // Better spacing and size for checkbox
                            />
                            <div>
                              <p className="font-mono text-gray-800 break-all">
                                {account.pubkey}
                              </p>{" "}
                              {/* Mono font for public key */}
                              <p className="text-gray-500 text-sm">
                                {accountType}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-800 font-semibold">
                              Balance:{" "}
                              {account.accountData.tokenAmount?.uiAmount || 0}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {selectedAccounts.size > 0 && (
                    <button
                      onClick={handleCloseAccounts}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-5 rounded mt-4 shadow-md"
                    >
                      Close Selected Accounts
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
