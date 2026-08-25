import { useState } from "react";

import { getTransactionsByAccount } from "../services/transactionService";

function Transactions() {

    // =========================================
    // STATE
    // =========================================

    const [accountId, setAccountId] = useState("");

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searched, setSearched] = useState(false);

    const [error, setError] = useState("");


    // =========================================
    // HANDLE ACCOUNT ID
    // =========================================

    const handleAccountIdChange = function (event) {

        setAccountId(event.target.value);

        setError("");

        setSearched(false);

    };


    // =========================================
    // CLEAR FORM
    // =========================================

    const clearForm = function () {

        setAccountId("");

        setTransactions([]);

        setSearched(false);

        setError("");

    };


    // =========================================
    // LOAD TRANSACTIONS
    // =========================================

    const loadTransactions = function () {

        // =====================================
        // VALIDATION
        // =====================================

        if (!accountId) {

            setError(
                "Please enter your account ID."
            );

            setTransactions([]);

            setSearched(false);

            return;
        }


        setLoading(true);

        setError("");

        setSearched(false);

        setTransactions([]);


        // =====================================
        // CALL BACKEND
        // =====================================

        getTransactionsByAccount(accountId)

            .then(function (data) {

                console.log(
                    "Transactions:",
                    data
                );

                setTransactions(
                    Array.isArray(data)
                        ? data
                        : []
                );

                setSearched(true);

            })

            .catch(function (error) {

                console.error(
                    "Failed to fetch transactions:",
                    error
                );

                setTransactions([]);

                setSearched(false);

                setError(
                    error.message ||
                    "Failed to fetch transactions."
                );

            })

            .finally(function () {

                setLoading(false);

            });

    };


    // =========================================
    // HANDLE SUBMIT
    // =========================================

    const handleSubmit = function (event) {

        event.preventDefault();

        loadTransactions();

    };


    // =========================================
    // FORMAT MONEY
    // =========================================

    const formatAmount = function (amount) {

        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = function (date) {

        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =========================================
    // RETURN UI
    // =========================================

    return (

        <div className="transactions-page">


            {/* ================================= */}
            {/* PAGE HEADER */}
            {/* ================================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Transaction History
                    </h1>

                    <p>
                        View all transactions for your bank account
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* ERROR MESSAGE */}
            {/* ================================= */}

            {error && (

                <div className="transactions-error">

                    <span className="transactions-error-icon">
                        !
                    </span>

                    <div>

                        <strong>
                            Unable to load transactions
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* ================================= */}
            {/* SEARCH FORM */}
            {/* ================================= */}

            <div className="transactions-form-card">

                <h2>
                    Find Transactions
                </h2>

                <p className="form-description">
                    Enter your account ID to view
                    your transaction history.
                </p>


                <form onSubmit={handleSubmit}>


                    {/* ACCOUNT ID */}

                    <div className="form-group">

                        <label htmlFor="transactionAccountId">
                            Account ID
                        </label>

                        <input
                            id="transactionAccountId"
                            type="number"
                            value={accountId}
                            onChange={
                                handleAccountIdChange
                            }
                            placeholder="Enter account ID"
                            min="1"
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="form-buttons">

                        <button
                            type="submit"
                            className="transaction-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Loading..."
                                : "View Transactions"}

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


            {/* ================================= */}
            {/* TRANSACTION RESULTS */}
            {/* ================================= */}

            {searched && (

                <div className="transactions-table-container">


                    {/* TABLE HEADER */}

                    <div className="transactions-table-header">

                        <div>

                            <span className="section-label">
                                TRANSACTIONS
                            </span>

                            <h2>
                                Transaction History
                            </h2>

                            <p>
                                Account ID:{" "}
                                <strong>
                                    {accountId}
                                </strong>
                            </p>

                        </div>


                        {/* TRANSACTION COUNT */}

                        <div className="transaction-count">

                            {transactions.length}{" "}

                            {transactions.length === 1
                                ? "Transaction"
                                : "Transactions"}

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* NO TRANSACTIONS */}
                    {/* ================================= */}

                    {transactions.length === 0 ? (

                        <div className="no-transactions">

                            <div className="empty-icon">
                                📋
                            </div>

                            <h3>
                                No Transactions Found
                            </h3>

                            <p>
                                There are no transactions
                                available for account{" "}
                                <strong>
                                    {accountId}
                                </strong>.
                            </p>

                        </div>

                    ) : (


                        /* ================================= */
                        /* TRANSACTION TABLE */
                        /* ================================= */

                        <div className="table-wrapper">

                            <table className="transactions-table">


                                {/* TABLE HEADER */}

                                <thead>

                                    <tr>

                                        <th>
                                            S.No
                                        </th>

                                        <th>
                                            Transaction ID
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Balance After
                                        </th>

                                        <th>
                                            Date & Time
                                        </th>

                                    </tr>

                                </thead>


                                {/* TABLE BODY */}

                                <tbody>

                                    {transactions.map(
                                        function (
                                            transaction,
                                            index
                                        ) {

                                            const isDeposit =
                                                transaction.type ===
                                                "DEPOSIT";

                                            return (

                                                <tr
                                                    key={
                                                        transaction.id ||
                                                        index
                                                    }
                                                >


                                                    {/* S.NO */}

                                                    <td className="serial-number">

                                                        {index + 1}

                                                    </td>


                                                    {/* TRANSACTION ID */}

                                                    <td className="transaction-id">

                                                        #
                                                        {
                                                            transaction.id
                                                        }

                                                    </td>


                                                    {/* TYPE */}

                                                    <td>

                                                        <span
                                                            className={
                                                                isDeposit
                                                                    ? "transaction-deposit"
                                                                    : "transaction-withdraw"
                                                            }
                                                        >

                                                            <span className="transaction-type-icon">

                                                                {isDeposit
                                                                    ? "↓"
                                                                    : "↑"}

                                                            </span>

                                                            {
                                                                transaction.type ||
                                                                "UNKNOWN"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* AMOUNT */}

                                                    <td>

                                                        <strong
                                                            className={
                                                                isDeposit
                                                                    ? "amount-positive"
                                                                    : "amount-negative"
                                                            }
                                                        >

                                                            {isDeposit
                                                                ? "+"
                                                                : "-"}
                                                            ₹
                                                            {
                                                                formatAmount(
                                                                    transaction.amount
                                                                )
                                                            }

                                                        </strong>

                                                    </td>


                                                    {/* BALANCE AFTER */}

                                                    <td>

                                                        ₹
                                                        {
                                                            formatAmount(
                                                                transaction.balanceAfter
                                                            )
                                                        }

                                                    </td>


                                                    {/* DATE */}

                                                    <td className="transaction-date">

                                                        {
                                                            formatDate(
                                                                transaction.transactionDate
                                                            )
                                                        }

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}

export default Transactions;