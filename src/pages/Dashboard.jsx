import { useEffect, useState } from "react";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import BalanceCard from "../components/BalanceCard.jsx";
import TransactionList from "../components/TransactionList.jsx";

import { getUserAccounts } from "../services/accountService.js";

import {
    getTransactionsByAccount
} from "../services/transactionService.js";


function Dashboard() {

    // =========================================
    // STATE
    // =========================================

    const [accounts, setAccounts] = useState([]);

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================
    // GET LOGGED-IN USER
    // =========================================

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // =========================================
    // LOAD ACCOUNT + TRANSACTION DATA
    // =========================================

    useEffect(function() {

        /*
         * If user is not logged in,
         * don't call the backend.
         */
        if (!user) {
            return;
        }


        // =====================================
        // GET USER ACCOUNTS
        // =====================================

        getUserAccounts(user.id)

            .then(function(accountData) {

                console.log(
                    "ACCOUNT DATA:",
                    accountData
                );


                const userAccounts =
                    accountData || [];


                setAccounts(
                    userAccounts
                );


                // =================================
                // NO ACCOUNTS
                // =================================

                if (userAccounts.length === 0) {

                    setTransactions([]);

                    setLoading(false);

                    return;
                }


                // =================================
                // GET TRANSACTIONS
                // FOR EACH ACCOUNT
                // =================================

                const transactionRequests =
                    userAccounts.map(
                        function(account) {

                            return getTransactionsByAccount(
                                account.id
                            );

                        }
                    );


                return Promise.all(
                    transactionRequests
                )

                    .then(function(transactionResults) {

                        console.log(
                            "TRANSACTION DATA:",
                            transactionResults
                        );


                        /*
                         * Combine transactions from
                         * all accounts into one array.
                         */
                        const allTransactions =
                            transactionResults.flat();


                        setTransactions(
                            allTransactions
                        );


                        setLoading(false);

                    });

            })

            .catch(function(error) {

                console.error(
                    "DASHBOARD ERROR:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to load dashboard details."
                );


                setLoading(false);

            });

    }, []);


    // =========================================
    // USER NOT LOGGED IN
    // =========================================

    if (!user) {

        return (

            <div className="dashboard-message-page">

                <div className="dashboard-message-card">

                    <div className="message-icon">
                        !
                    </div>


                    <h2>
                        Please Login
                    </h2>


                    <p>
                        You need to login to access
                        your banking dashboard.
                    </p>


                    <button
                        onClick={function() {

                            window.location.href =
                                "/login";

                        }}
                    >
                        Go to Login
                    </button>

                </div>

            </div>

        );
    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="loading-spinner">
                </div>


                <p>
                    Loading your banking dashboard...
                </p>

            </div>

        );
    }


    // =========================================
    // MAIN DASHBOARD
    // =========================================

    return (

        <div className="bank-layout">


            {/* =================================
                SIDEBAR
            ================================= */}

            <Sidebar />


            {/* =================================
                MAIN AREA
            ================================= */}

            <div className="bank-main">


                {/* =================================
                    NAVBAR
                ================================= */}

                <Navbar />


                {/* =================================
                    DASHBOARD CONTENT
                ================================= */}

                <main className="dashboard-content">


                    {/* =================================
                        WELCOME HEADER
                    ================================= */}

                    <div className="dashboard-welcome">

                        <div>

                            <span className="dashboard-eyebrow">
                                OVERVIEW
                            </span>


                            <h1>
                                Good morning, {user.name}
                            </h1>


                            <p>
                                Here's what's happening
                                with your accounts today.
                            </p>

                        </div>

                    </div>


                    {/* =================================
                        ERROR MESSAGE
                    ================================= */}

                    {error && (

                        <div className="dashboard-error">

                            <span>
                                !
                            </span>


                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =================================
                        BALANCE SUMMARY
                    ================================= */}

                    <BalanceCard
                        accounts={accounts}
                    />


                    {/* =================================
                        MY ACCOUNTS
                    ================================= */}

                    <section className="dashboard-section">


                        <div className="section-heading">

                            <div>

                                <span className="section-label">
                                    YOUR ACCOUNTS
                                </span>


                                <h2>
                                    My Accounts
                                </h2>

                            </div>


                            <a
                                href="/open-account"
                                className="section-action"
                            >
                                + Open Account
                            </a>

                        </div>


                        {/* =================================
                            NO ACCOUNTS
                        ================================= */}

                        {accounts.length === 0 ? (

                            <div className="no-accounts-card">

                                <div className="no-account-icon">
                                    +
                                </div>


                                <h3>
                                    No accounts found
                                </h3>


                                <p>
                                    Open your first GENZ BANK
                                    account to get started.
                                </p>


                                <a
                                    href="/open-account"
                                    className="open-account-button"
                                >
                                    Open Account
                                </a>

                            </div>

                        ) : (


                            /* =================================
                               ACCOUNT CARDS
                            ================================= */

                            <div className="dashboard-accounts-grid">

                                {accounts.map(
                                    function(account) {

                                        const balance =
                                            Number(
                                                account.balance || 0
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }
                                            );


                                        const accountType =
                                            account.accountType ||
                                            account.type ||
                                            "ACCOUNT";


                                        return (

                                            <div
                                                className="dashboard-account-card"
                                                key={account.id}
                                            >


                                                {/* ACCOUNT HEADER */}

                                                <div className="account-card-top">

                                                    <div>

                                                        <span>
                                                            {accountType}
                                                        </span>


                                                        <h3>

                                                            {
                                                                accountType === "SAVINGS"
                                                                    ? "Savings Account"
                                                                    : accountType === "CURRENT"
                                                                        ? "Current Account"
                                                                        : "Bank Account"
                                                            }

                                                        </h3>

                                                    </div>


                                                    <div className="account-card-icon">
                                                        ₹
                                                    </div>

                                                </div>


                                                {/* ACCOUNT NUMBER */}

                                                <div className="dashboard-account-number">

                                                    <span>
                                                        ACCOUNT NUMBER
                                                    </span>


                                                    <strong>
                                                        {
                                                            account.accountNumber
                                                        }
                                                    </strong>

                                                </div>


                                                {/* ACCOUNT BALANCE + STATUS */}

                                                <div className="dashboard-account-bottom">

                                                    <div>

                                                        <span>
                                                            AVAILABLE BALANCE
                                                        </span>


                                                        <strong>
                                                            ₹{balance}
                                                        </strong>

                                                    </div>


                                                    <span
                                                        className={
                                                            account.status === "ACTIVE"
                                                                ? "status-badge active"
                                                                : "status-badge"
                                                        }
                                                    >
                                                        {
                                                            account.status
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </section>


                    {/* =================================
                        RECENT TRANSACTIONS
                    ================================= */}

                    <section className="dashboard-section">

                        <TransactionList
                            transactions={transactions}
                        />

                    </section>


                </main>

            </div>

        </div>

    );
}


export default Dashboard;