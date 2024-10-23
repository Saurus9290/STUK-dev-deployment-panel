Solana Token Account Manager 
This project is a Solana-based decentralized application (DApp) designed to allow users to efficiently manage their token accounts, close unused accounts, and collect rent (SOL) from them. The primary purpose of the DApp is to help users reclaim rent stored in unused Solana token accounts. Token accounts on the Solana blockchain store rent deposits, which can be recovered by closing the accounts, especially when their token balance reaches zero.

What I Built
In this project, I have developed a Token Account Management DApp with the following core features:

Wallet Connection: Users can connect their Solana wallet (e.g., Phantom) to the DApp.
Token Account Fetching: The DApp fetches all token accounts owned by the connected wallet from the Solana blockchain, including their balances.
Account Selection: Users can select token accounts they wish to close to reclaim rent.
Close Token Accounts: The DApp allows users to close selected token accounts. If the account has zero token balance, the rent stored in it is returned to the user's wallet.
Error Handling: The DApp provides alerts for cases where accounts cannot be closed, such as when the token balance is non-zero.
What I Learned
While building this project, I deepened my knowledge of the following key concepts:

Solana Wallet Integration:

Learned how to integrate Solana wallets into a DApp using the @solana/wallet-adapter-react package.
Understood how to manage wallet connection states, sign transactions, and interact with the Solana blockchain using the wallet adapter.
Solana Token Accounts:

Gained hands-on experience in interacting with Solana token accounts using the @solana/spl-token package.
Learned how to fetch token accounts for a user, check token balances, and manage closing accounts for rent collection.
Transaction and Account Management:

Understood how to create and sign transactions on the Solana blockchain, including closing token accounts and recovering rent.
Managed multi-step processes, including transferring balances and closing accounts, while handling blockchain confirmations.
UI Development with Next.js:

Built a user-friendly dashboard with Next.js and Tailwind CSS for easy token account management.
Improved understanding of server-side rendering and hydration issues in Next.js.
Error Handling and Feedback:

Learned how to handle transaction failures and notify users with appropriate alerts.
Implemented feedback loops to inform users of successful account closures or transaction issues.
How to Test the Project
Prerequisites
Before testing the project, ensure you have the following installed:

Node.js and npm: The project is built using Node.js and npm. You can download Node.js
here
.
Phantom Wallet (or any compatible Solana wallet): Install and set up Phantom Wallet or any other wallet that supports Solana to interact with the DApp.
Solana Devnet: Make sure you’re connected to the Solana Devnet to test without spending real SOL tokens. You can switch networks in your wallet.
Steps to Test Locally
Clone the repository:

bash
Copy code
git 
clone
 https://github.com/your-repo-name/solana-token-account-manager.git
Install dependencies:

Navigate to the project directory and install all necessary dependencies:

bash
Copy code
cd
 solana-token-account-manager
npm install
Set up Solana environment:

Ensure you are connected to the Solana Devnet:

bash
Copy code
solana config 
set
 --url https://api.devnet.solana.com
Start the project:

You can now run the project locally:

bash
Copy code
npm run dev
This will start the Next.js development server. You can access the DApp by opening
http
://localhost
:3000
in your browser.
