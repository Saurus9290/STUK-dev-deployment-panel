import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createCloseAccountInstruction,
  getAccount,
} from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com");

const SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";
const TOKEN_PROGRAM_ID_STRING = TOKEN_PROGRAM_ID.toBase58(); // Convert the TOKEN_PROGRAM_ID to string for comparison

// Fetch all accounts (SPL token and non-token accounts)
export const fetchAllAccounts = async (
  walletPublicKey: PublicKey
): Promise<any[]> => {
  try {
    const allAccounts = [];

    // Fetch SPL token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    // Map SPL token accounts
    const parsedTokenAccounts = tokenAccounts.value.map((accountInfo) => ({
      pubkey: accountInfo.pubkey.toBase58(),
      accountData: accountInfo.account.data.parsed.info,
      ownerProgramId: TOKEN_PROGRAM_ID_STRING,
    }));

    allAccounts.push(...parsedTokenAccounts);

    // Fetch all other accounts (not filtered by programId)
    const otherAccounts = await connection.getProgramAccounts(walletPublicKey);

    // Map all other accounts (system, program-owned)
    const mappedOtherAccounts = otherAccounts.map((accountInfo) => ({
      pubkey: accountInfo.pubkey.toBase58(),
      accountData: accountInfo.account.data,
      ownerProgramId: accountInfo.account.owner.toBase58(), // The program ID that owns this account
    }));

    allAccounts.push(...mappedOtherAccounts);

    return allAccounts;
  } catch (error) {
    console.error("Error fetching all accounts:", error);
    return [];
  }
};

export const closeAccount = async (
  accountPubkey: PublicKey,
  walletPublicKey: PublicKey, // Wallet that owns the token account (authority)
  ownerProgramId: string, // The program ID that owns the account (token program or system program)
  signTransaction: (tx: Transaction) => Promise<Transaction>, // Function to sign the transaction
  sendTransaction: (tx: Transaction, connection: Connection) => Promise<string> // Function to send the transaction
) => {
  console.log(`Attempting to close account: ${accountPubkey.toBase58()}`);

  // Determine if it's an SPL token account or a system account
  if (ownerProgramId === TOKEN_PROGRAM_ID_STRING) {
    // It's an SPL token account
    console.log("Closing an SPL token account...");

    // Fetch the SPL token account data to check the balance
    const tokenAccount = await getAccount(connection, accountPubkey);
    const tokenAmount = tokenAccount.amount;

    // If the account has a non-zero balance, show an alert
    if (tokenAmount > 0) {
      alert(
        `The SPL token account ${accountPubkey.toBase58()} has a balance of ${tokenAmount} tokens. Please transfer the tokens manually before attempting to close the account.`
      );
      return; // Exit the function without closing the account
    }

    // If balance is zero, proceed to close the SPL token account
    const tx = new Transaction();
    tx.add(
      createCloseAccountInstruction(
        accountPubkey, // Token account to be closed
        walletPublicKey, // Wallet where the rent will be refunded
        walletPublicKey // Authority that can close the account (wallet)
      )
    );

    // Set the fee payer and blockhash
    tx.feePayer = walletPublicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    try {
      // Sign and send the transaction
      const signedTx = await signTransaction(tx);
      const txId = await sendTransaction(signedTx, connection);
      await connection.confirmTransaction(txId, "processed");

      console.log(
        `SPL token account closed successfully. Transaction ID: ${txId}`
      );
    } catch (error) {
      console.error("Failed to close the SPL token account:", error);
      throw error;
    }
  } else if (ownerProgramId === SYSTEM_PROGRAM_ID) {
    // It's a system account (possibly a native SOL account or a program account)
    console.log("Closing a system (SOL) account...");

    // Fetch the account balance (in lamports)
    const accountInfo = await connection.getAccountInfo(accountPubkey);
    const lamports = accountInfo?.lamports ?? 0;

    if (lamports > 0) {
      // Transfer any remaining SOL (lamports) back to the wallet before closing
      const tx = new Transaction();
      tx.add(
        SystemProgram.transfer({
          fromPubkey: accountPubkey, // The system account to be closed (source of lamports)
          toPubkey: walletPublicKey, // Destination wallet (where lamports will be transferred)
          lamports: lamports, // Amount to transfer (close the account by emptying it)
        })
      );

      // Set the fee payer and blockhash
      tx.feePayer = walletPublicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      try {
        // Sign and send the transaction
        const signedTx = await signTransaction(tx);
        const txId = await sendTransaction(signedTx, connection);
        await connection.confirmTransaction(txId, "processed");

        console.log(
          `System account closed successfully. SOL transferred. Transaction ID: ${txId}`
        );
      } catch (error) {
        console.error("Failed to close the system account:", error);
        throw error;
      }
    } else {
      console.log(
        "System account has no SOL. Account is effectively empty and can be closed."
      );
    }
  } else {
    console.log(
      `Unsupported account type for closing. Owner Program ID: ${ownerProgramId}`
    );
    alert(`Cannot close account with program ID: ${ownerProgramId}`);
  }
};
