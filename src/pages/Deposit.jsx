import { useEffect, useState } from "react";

import { depositMoney } from "../services/depositService";
import { getUserAccounts } from "../services/accountService";


function formatMoney(value) {

    return Number(value || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


function Deposit() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const [accounts, setAccounts] = useState([]);

    const [accountId, setAccountId] = useState("");

    const [amount, setAmount] = useState("");

    const [account, setAccount] = useState(null);

    const [loading, setLoading] = useState(false);

    const [accountsLoading, setAccountsLoading] =
        useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =========================================
    // LOAD USER ACCOUNTS
    // =========================================

    useEffect(function() {

        let cancelled = false;


        async function loadAccounts() {

            if (!user || !user.id) {

                if (!cancelled) {

                    setAccounts([]);

                    setAccountId("");

                    setAccountsLoading(false);

                    setError(
                        "User is not logged in."
                    );

                }

                return;

            }


            try {

                const data =
                    await getUserAccounts(user.id);


                if (cancelled) {
                    return;
                }


                const list =
                    Array.isArray(data)
                        ? data
                        : [];


                setAccounts(list);


                if (list.length > 0) {

                    setAccountId(
                        String(list[0].id)
                    );

                } else {

                    setAccountId("");

                    setError(
                        "You do not have any bank accounts. Please open an account first."
                    );

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


        loadAccounts();


        return function() {

            cancelled = true;

        };

    }, [user?.id]);


    // =========================================
    // SELECTED ACCOUNT
    // =========================================

    const selectedAccount =
        accounts.find(function(item) {

            return String(item.id) ===
                String(accountId);

        });


    // =========================================
    // ACCOUNT CHANGE
    // =========================================

    function handleAccountChange(event) {

        setAccountId(
            event.target.value
        );

        setAccount(null);

        setError("");

        setSuccess("");

    }


    // =========================================
    // AMOUNT CHANGE
    // =========================================

    function handleAmountChange(event) {

        setAmount(
            event.target.value
        );

        setAccount(null);

        setError("");

        setSuccess("");

    }


    // =========================================
    // CLEAR
    // =========================================

    function clearForm() {

        setAmount("");

        setAccount(null);

        setError("");

        setSuccess("");

    }


    // =========================================
    // DEPOSIT
    // =========================================

    async function handleSubmit(event) {

        event.preventDefault();


        setError("");

        setSuccess("");

        setAccount(null);


        if (!accountId) {

            setError(
                "Please select an account."
            );

            return;

        }


        const numericAmount =
            Number(amount);


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

            const data =
                await depositMoney(
                    accountId,
                    numericAmount
                );


            console.log(
                "DEPOSIT RESPONSE:",
                data
            );


            setAccount(data);


            setSuccess(
                "₹" +
                formatMoney(numericAmount) +
                " deposited successfully into your " +
                (
                    data.type ||
                    selectedAccount?.type ||
                    "account"
                ).toLowerCase() +
                " account."
            );


            setAmount("");


            // Update local account list immediately

            setAccounts(function(currentAccounts) {

                return currentAccounts.map(
                    function(item) {

                        if (
                            String(item.id) ===
                            String(data.id)
                        ) {

                            return data;

                        }

                        return item;

                    }
                );

            });


        } catch (err) {

            console.error(
                "DEPOSIT ERROR:",
                err
            );


            setError(
                err.message ||
                "Failed to deposit money."
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="deposit-page">

            <div className="page-header">

                <div>

                    <h1>
                        Deposit Money
                    </h1>

                    <p>
                        Deposit money into one of your bank accounts.
                    </p>

                </div>

            </div>


            {/* SUCCESS */}

            {success && (

                <div className="deposit-success">

                    <span className="deposit-success-icon">
                        ✓
                    </span>

                    <div>

                        <strong>
                            Deposit Successful
                        </strong>

                        <p>
                            {success}
                        </p>

                    </div>

                </div>

            )}


            {/* ERROR */}

            {error && (

                <div className="deposit-error">

                    <span className="deposit-error-icon">
                        !
                    </span>

                    <div>

                        <strong>
                            Deposit Failed
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            <div className="deposit-form-card">

                <h2>
                    Make a Deposit
                </h2>

                <p className="form-description">
                    Choose the account that should receive the money.
                </p>


                <form onSubmit={handleSubmit}>

                    {/* ACCOUNT */}

                    <div className="form-group">

                        <label htmlFor="depositAccount">

                            Select Account

                        </label>


                        <select
                            id="depositAccount"
                            value={accountId}
                            onChange={
                                handleAccountChange
                            }
                            disabled={
                                loading ||
                                accountsLoading
                            }
                        >

                            <option value="">

                                {accountsLoading
                                    ? "Loading accounts..."
                                    : "Select an account"}

                            </option>


                            {accounts.map(
                                function(item) {

                                    return (

                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >

                                            {
                                                item.type ||
                                                "ACCOUNT"
                                            }

                                            {" • "}

                                            {
                                                item.accountNumber
                                            }

                                            {" • ₹"}

                                            {
                                                formatMoney(
                                                    item.balance
                                                )
                                            }

                                        </option>

                                    );

                                }
                            )}

                        </select>

                    </div>


                    {/* SELECTED ACCOUNT */}

                    {selectedAccount && (

                        <div className="selected-account-card">

                            <div>

                                <span>
                                    SELECTED ACCOUNT
                                </span>

                                <strong>
                                    {
                                        selectedAccount.type ||
                                        "ACCOUNT"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    CURRENT BALANCE
                                </span>

                                <strong>
                                    ₹
                                    {
                                        formatMoney(
                                            selectedAccount.balance
                                        )
                                    }
                                </strong>

                            </div>

                        </div>

                    )}


                    {/* AMOUNT */}

                    <div className="form-group">

                        <label htmlFor="depositAmount">
                            Amount
                        </label>


                        <div className="amount-input">

                            <span className="currency-symbol">
                                ₹
                            </span>


                            <input
                                id="depositAmount"
                                type="number"
                                value={amount}
                                onChange={
                                    handleAmountChange
                                }
                                placeholder="Enter amount"
                                min="1"
                                step="0.01"
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* BUTTONS */}

                    <div className="form-buttons">

                        <button
                            type="submit"
                            className="deposit-button"
                            disabled={
                                loading ||
                                accountsLoading ||
                                !accountId
                            }
                        >

                            {loading
                                ? "Processing..."
                                : "Deposit Money"}

                        </button>


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={clearForm}
                            disabled={loading}
                        >

                            Clear

                        </button>

                    </div>

                </form>

            </div>


            {/* UPDATED ACCOUNT */}

            {account && (

                <div className="account-result-card">

                    <div className="account-result-header">

                        <div>

                            <span className="section-label">
                                TRANSACTION COMPLETED
                            </span>

                            <h2>
                                Account Updated
                            </h2>

                        </div>


                        <div className="account-status">

                            <span className="status-dot">
                            </span>

                            {
                                account.status ||
                                "ACTIVE"
                            }

                        </div>

                    </div>


                    <div className="account-details-grid">

                        <div className="account-detail-item">

                            <span>
                                Account ID
                            </span>

                            <strong>
                                {account.id}
                            </strong>

                        </div>


                        <div className="account-detail-item">

                            <span>
                                Account Number
                            </span>

                            <strong>
                                {account.accountNumber}
                            </strong>

                        </div>


                        <div className="account-detail-item">

                            <span>
                                Account Type
                            </span>

                            <strong>
                                {
                                    account.type ||
                                    account.accountType ||
                                    "N/A"
                                }
                            </strong>

                        </div>


                        <div className="account-detail-item balance-detail">

                            <span>
                                New Available Balance
                            </span>

                            <strong>
                                ₹
                                {
                                    formatMoney(
                                        account.balance
                                    )
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Deposit;