function BalanceCard({ accounts }) {

    // Calculate total balance
    const totalBalance = accounts.reduce(
        function(total, account) {
            return total + Number(account.balance || 0);
        },
        0
    );

    // Format Indian currency
    const formattedBalance = totalBalance.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

    return (

        <div className="balance-section">

            {/* =====================================
                TOTAL BALANCE CARD
            ===================================== */}

            <div className="balance-card">

                <div className="balance-card-top">

                    <div>

                        <span className="balance-label">
                            TOTAL BALANCE
                        </span>

                        <h2>
                            ₹{formattedBalance}
                        </h2>

                    </div>

                    <div className="balance-icon">
                        ₹
                    </div>

                </div>


                <div className="balance-card-bottom">

                    <span>
                        Available across all accounts
                    </span>

                    <span className="balance-secure">
                        ✓ Secure
                    </span>

                </div>

            </div>


            {/* =====================================
                ACCOUNT COUNT CARD
            ===================================== */}

            <div className="summary-card">

                <div className="summary-icon">
                    ◉
                </div>

                <div>

                    <span>
                        ACTIVE ACCOUNTS
                    </span>

                    <strong>
                        {accounts.length}
                    </strong>

                    <small>
                        Bank account{accounts.length !== 1 ? "s" : ""}
                    </small>

                </div>

            </div>


            {/* =====================================
                ACCOUNT TYPES CARD
            ===================================== */}

            <div className="summary-card">

                <div className="summary-icon">
                    #
                </div>

                <div>

                    <span>
                        ACCOUNT TYPES
                    </span>

                    <strong>
                        {accounts.length}
                    </strong>

                    <small>
                        Savings & Current
                    </small>

                </div>

            </div>

        </div>
    );
}

export default BalanceCard;