function TransactionList({ transactions }) {

    if (!transactions || transactions.length === 0) {

        return (

            <div className="transactions-card">

                <div className="transactions-header">

                    <div>
                        <span className="section-label">
                            ACTIVITY
                        </span>

                        <h2>
                            Recent Transactions
                        </h2>
                    </div>

                </div>

                <div className="empty-transactions">

                    <div className="empty-icon">
                        ≡
                    </div>

                    <h3>
                        No transactions yet
                    </h3>

                    <p>
                        Your recent deposits and withdrawals
                        will appear here.
                    </p>

                </div>

            </div>

        );
    }


    // Show only the latest 5 transactions
    const recentTransactions = transactions.slice(0, 5);


    function formatAmount(transaction) {

        const amount = Number(
            transaction.amount || 0
        );

        return amount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    }


    function isDeposit(transaction) {

        return (
            transaction.type === "DEPOSIT" ||
            transaction.transactionType === "DEPOSIT"
        );
    }


    function formatDate(transaction) {

        const dateValue =
            transaction.createdAt ||
            transaction.date;

        if (!dateValue) {
            return "Recent";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Recent";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    return (

        <div className="transactions-card">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="transactions-header">

                <div>

                    <span className="section-label">
                        ACTIVITY
                    </span>

                    <h2>
                        Recent Transactions
                    </h2>

                </div>

                <span className="transaction-count">
                    {transactions.length} total
                </span>

            </div>


            {/* =====================================
                TRANSACTION LIST
            ===================================== */}

            <div className="transaction-list">

                {recentTransactions.map(
                    function(transaction, index) {

                        const deposit =
                            isDeposit(transaction);

                        return (

                            <div
                                className="transaction-row"
                                key={
                                    transaction.id ||
                                    index
                                }
                            >

                                {/* ICON */}

                                <div
                                    className={
                                        deposit
                                            ? "transaction-icon deposit"
                                            : "transaction-icon withdraw"
                                    }
                                >
                                    {deposit
                                        ? "+"
                                        : "-"
                                    }
                                </div>


                                {/* DETAILS */}

                                <div className="transaction-info">

                                    <strong>
                                        {deposit
                                            ? "Deposit"
                                            : "Withdrawal"
                                        }
                                    </strong>

                                    <span>
                                        {formatDate(
                                            transaction
                                        )}
                                    </span>

                                </div>


                                {/* AMOUNT */}

                                <div
                                    className={
                                        deposit
                                            ? "transaction-amount deposit-amount"
                                            : "transaction-amount withdraw-amount"
                                    }
                                >

                                    {deposit
                                        ? "+"
                                        : "-"
                                    }

                                    ₹
                                    {formatAmount(
                                        transaction
                                    )}

                                </div>

                            </div>

                        );

                    }
                )}

            </div>

        </div>

    );
}

export default TransactionList;