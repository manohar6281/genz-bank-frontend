import { useEffect, useState } from "react";
import { withdrawMoney } from "../services/withdrawService";
import { getUserAccounts } from "../services/accountService";

function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function Withdraw() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [accounts, setAccounts] = useState([]);
    const [accountId, setAccountId] = useState("");
    const [amount, setAmount] = useState("");

    const [account, setAccount] = useState(null);

    const [loading, setLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /*
     * Initial account loading.
     *
     * IMPORTANT:
     * The async operation is created inside the effect instead of
     * calling a function that immediately performs setState().
     */
    useEffect(() => {
        let cancelled = false;

        async function fetchAccounts() {
            if (!user?.id) {
                if (!cancelled) {
                    setAccounts([]);
                    setAccountId("");
                    setAccountsLoading(false);
                }
                return;
            }

            try {
                const data = await getUserAccounts(user.id);

                if (cancelled) return;

                const list = Array.isArray(data) ? data : [];

                setAccounts(list);

                if (list.length > 0) {
                    setAccountId((current) => {
                        const exists = list.some(
                            (item) =>
                                String(item.id) === String(current)
                        );

                        return exists
                            ? current
                            : String(list[0].id);
                    });
                } else {
                    setAccountId("");
                }
            } catch (err) {
                if (!cancelled) {
                    setAccounts([]);
                    setAccountId("");
                    setError(
                        err.message ||
                        "Unable to load your accounts."
                    );
                }
            } finally {
                if (!cancelled) {
                    setAccountsLoading(false);
                }
            }
        }

        fetchAccounts();

        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    /*
     * Used AFTER a successful withdrawal.
     * This is outside useEffect, so it can safely update loading state.
     */
    async function refreshAccounts() {
        if (!user?.id) return;

        try {
            const data = await getUserAccounts(user.id);

            const list = Array.isArray(data) ? data : [];

            setAccounts(list);

            if (list.length > 0) {
                setAccountId((current) => {
                    const exists = list.some(
                        (item) =>
                            String(item.id) === String(current)
                    );

                    return exists
                        ? current
                        : String(list[0].id);
                });
            } else {
                setAccountId("");
            }
        } catch (err) {
            setError(
                err.message ||
                "Unable to refresh your accounts."
            );
        }
    }

    const selectedAccount = accounts.find(
        (item) =>
            String(item.id) === String(accountId)
    );

    function clearForm() {
        setAmount("");
        setAccount(null);
        setError("");
        setSuccess("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setAccount(null);

        if (!accountId) {
            setError("Please select an account.");
            return;
        }

        const numericAmount = Number(amount);

        if (
            amount === "" ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            setError(
                "Please enter a valid amount greater than zero."
            );
            return;
        }

        setLoading(true);

        try {
            /*
             * Let the backend perform the authoritative
             * balance check.
             */
            const data = await withdrawMoney(
                accountId,
                numericAmount
            );

            setAccount(data);

            setSuccess(
                `₹${formatMoney(
                    numericAmount
                )} was withdrawn successfully.`
            );

            setAmount("");

            /*
             * Get the latest balance from the backend.
             */
            await refreshAccounts();

        } catch (err) {
            setError(
                err.message ||
                "Failed to withdraw money."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="transaction-page withdraw-page">

            <div className="transaction-page-header">
                <div>
                    <span className="transaction-eyebrow">
                        MONEY MANAGEMENT
                    </span>

                    <h1>Withdraw Money</h1>

                    <p>
                        Withdraw money securely from one of your
                        GENZ BANK accounts.
                    </p>
                </div>

                <div className="transaction-header-icon withdraw-icon">
                    ↑
                </div>
            </div>

            <div className="transaction-grid">

                <div className="transaction-form-card">

                    <div className="transaction-card-heading">

                        <div className="card-icon withdraw-card-icon">
                            ↑
                        </div>

                        <div>
                            <h2>Make a Withdrawal</h2>

                            <p>
                                Choose an account and enter the amount.
                            </p>
                        </div>

                    </div>

                    {success && (
                        <div
                            className="bank-alert success"
                            role="status"
                        >
                            <span className="alert-icon">
                                ✓
                            </span>

                            <div>
                                <strong>
                                    Withdrawal Successful
                                </strong>

                                <p>{success}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div
                            className="bank-alert error"
                            role="alert"
                        >
                            <span className="alert-icon">
                                !
                            </span>

                            <div>
                                <strong>
                                    Withdrawal Failed
                                </strong>

                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="bank-transaction-form"
                    >

                        <div className="form-group">

                            <label htmlFor="withdrawAccount">
                                Select Account
                            </label>

                            <select
                                id="withdrawAccount"
                                value={accountId}
                                onChange={(event) => {
                                    setAccountId(
                                        event.target.value
                                    );
                                    setAccount(null);
                                    setError("");
                                    setSuccess("");
                                }}
                                disabled={
                                    accountsLoading ||
                                    loading
                                }
                            >

                                <option value="">
                                    {accountsLoading
                                        ? "Loading accounts..."
                                        : "Select an account"}
                                </option>

                                {accounts.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.type ||
                                            item.accountType ||
                                            "ACCOUNT"}
                                        {" • "}
                                        {item.accountNumber}
                                        {" • ₹"}
                                        {formatMoney(
                                            item.balance
                                        )}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {selectedAccount && (
                            <div className="selected-account-card withdraw-selected">

                                <div>
                                    <span>
                                        AVAILABLE BALANCE
                                    </span>

                                    <strong>
                                        ₹
                                        {formatMoney(
                                            selectedAccount.balance
                                        )}
                                    </strong>
                                </div>

                                <div className="mini-account-meta">

                                    <span>
                                        {selectedAccount.type ||
                                            selectedAccount.accountType ||
                                            "SAVINGS"}
                                    </span>

                                    <small>
                                        ••••{" "}
                                        {String(
                                            selectedAccount.accountNumber ||
                                            ""
                                        ).slice(-4)}
                                    </small>

                                </div>

                            </div>
                        )}

                        <div className="form-group">

                            <label htmlFor="withdrawAmount">
                                Withdrawal Amount
                            </label>

                            <div className="money-input">

                                <span>₹</span>

                                <input
                                    id="withdrawAmount"
                                    type="number"
                                    value={amount}
                                    onChange={(event) => {
                                        setAmount(
                                            event.target.value
                                        );
                                        setError("");
                                        setSuccess("");
                                    }}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    disabled={loading}
                                />

                            </div>

                        </div>

                        <div className="transaction-actions">

                            <button
                                className="primary-transaction-button withdraw-submit"
                                type="submit"
                                disabled={
                                    loading ||
                                    accountsLoading ||
                                    !accountId
                                }
                            >
                                {loading
                                    ? "Processing Withdrawal..."
                                    : "Withdraw Money"}
                            </button>

                            <button
                                className="secondary-transaction-button"
                                type="button"
                                onClick={clearForm}
                                disabled={loading}
                            >
                                Clear
                            </button>

                        </div>

                    </form>

                </div>

                <div className="transaction-info-card">

                    <div className="info-card-icon">
                        ₹
                    </div>

                    <h3>
                        Safe Withdrawal
                    </h3>

                    <p>
                        Withdrawals are validated by the banking
                        backend against your current account balance.
                    </p>

                    <div className="info-row">
                        <span>Processing</span>
                        <strong>Instant</strong>
                    </div>

                    <div className="info-row">
                        <span>Currency</span>
                        <strong>INR ₹</strong>
                    </div>

                    <div className="info-row">
                        <span>Balance check</span>
                        <strong>Backend</strong>
                    </div>

                </div>

            </div>

            {account && (
                <div className="updated-account-card">

                    <div className="updated-account-title">

                        <div>
                            <span>
                                ACCOUNT UPDATED
                            </span>

                            <h2>
                                Withdrawal completed
                            </h2>
                        </div>

                        <span className="active-badge">
                            ● {account.status || "ACTIVE"}
                        </span>

                    </div>

                    <div className="updated-account-grid">

                        <div>
                            <span>
                                Account Number
                            </span>

                            <strong>
                                {account.accountNumber ||
                                    "—"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Account Type
                            </span>

                            <strong>
                                {account.type ||
                                    account.accountType ||
                                    "SAVINGS"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                New Balance
                            </span>

                            <strong className="highlight-money">
                                ₹
                                {formatMoney(
                                    account.balance
                                )}
                            </strong>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Withdraw;