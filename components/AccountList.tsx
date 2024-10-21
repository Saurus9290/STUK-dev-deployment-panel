interface AccountListProps {
  accounts: { pubkey: string; accountData: any }[];
  selectedAccounts: Set<string>;
  onSelect: (account: string) => void;
}

const AccountList: React.FC<AccountListProps> = ({
  accounts,
  selectedAccounts,
  onSelect,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Your Accounts:
      </h2>
      {accounts.length === 0 ? (
        <p className="text-gray-500 italic">No accounts found.</p>
      ) : (
        <ul className="list-disc ml-5">
          {accounts.map((account) => (
            <li key={account.pubkey} className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedAccounts.has(account.pubkey)}
                  onChange={() => onSelect(account.pubkey)}
                  className="mr-2"
                />
                <span className="text-gray-800">
                  {account.pubkey} (Balance:{" "}
                  {account.accountData.tokenAmount?.uiAmount || 0})
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccountList;
