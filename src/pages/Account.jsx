import { useState } from "react";
import { getAccount } from "../services/accountService";

function Account() {

    // =========================================
    // STATE
    // =========================================

    const [accountId, setAccountId] = useState("");

    const [account, setAccount] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // =========================================
    // HANDLE ACCOUNT ID
    // =========================================

    const handleAccountIdChange = function (event) {

        setAccountId(event.target.value);

        setError("");

    };


    // =========================================
    // CLEAR FORM
    // =========================================

    const clearForm = function () {

        setAccountId("");

        setAccount(null);

        setError("");

    };


    // =========================================
    // GET ACCOUNT
    // =========================================

    const handleSubmit = function (event) {

        event.preventDefault();


        // Validate account ID

        if (!accountId) {

            setError(
                "Please enter your account ID."
            );

            return;
        }


        setLoading(true);

        setError("");

        setAccount(null);


        // =====================================
        // CALL BACKEND
        // =====================================

        getAccount(accountId)

            .then(function (data) {

                console.log(
                    "Account details:",
                    data
                );

                setAccount(data);

            })

            .catch(function (error) {

                console.error(
                    "Failed to fetch account:",
                    error
                );

                setAccount(null);

                setError(
                    error.message ||
                    "Failed to fetch account details."
                );

            })

            .finally(function () {

                setLoading(false);

            });

    };


    // =========================================
    // RETURN UI
    // =========================================

    return (

        <div className="account-page">


            {/* ================================= */}
            {/* PAGE HEADER */}
            {/* ================================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Account Details
                    </h1>

                    <p>
                        View your bank account information
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* ERROR MESSAGE */}
            {/* ================================= */}

            {error && (

                <div className="account-error">

                    <span className="account-error-icon">
                        !
                    </span>

                    <div>

                        <strong>
                            Unable to fetch account
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* ================================= */}
            {/* ACCOUNT FORM */}
            {/* ================================= */}

            <div className="account-form-card">

                <h2>
                    Find Account
                </h2>

                <p className="form-description">
                    Enter your account ID to view
                    your account information.
                </p>


                <form onSubmit={handleSubmit}>


                    {/* ACCOUNT ID */}

                    <div className="form-group">

                        <label htmlFor="accountId">
                            Account ID
                        </label>

                        <input
                            id="accountId"
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
                            className="account-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Loading..."
                                : "View Account"}

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
            {/* ACCOUNT RESULT */}
            {/* ================================= */}

            {account && (

                <div className="account-details-card">


                    {/* CARD HEADER */}

                    <div className="account-details-header">

                        <div>

                            <span className="section-label">
                                ACCOUNT
                            </span>

                            <h2>
                                Account Information
                            </h2>

                        </div>


                        <div className="account-status">

                            <span className="status-dot">
                            </span>

                            {account.status}

                        </div>

                    </div>


                    {/* ACCOUNT DETAILS */}

                    <div className="account-details-grid">


                        {/* ACCOUNT ID */}

                        <div className="account-detail-item">

                            <span>
                                Account ID
                            </span>

                            <strong>
                                {account.id}
                            </strong>

                        </div>


                        {/* ACCOUNT NUMBER */}

                        <div className="account-detail-item">

                            <span>
                                Account Number
                            </span>

                            <strong className="account-number">
                                {account.accountNumber}
                            </strong>

                        </div>


                        {/* ACCOUNT TYPE */}

                        <div className="account-detail-item">

                            <span>
                                Account Type
                            </span>

                            <strong>
                                {
                                    account.accountType ||
                                    account.type ||
                                    "N/A"
                                }
                            </strong>

                        </div>


                        {/* BALANCE */}

                        <div className="account-detail-item balance-detail">

                            <span>
                                Available Balance
                            </span>

                            <strong>
                                ₹
                                {
                                    Number(
                                        account.balance || 0
                                    ).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    )
                                }
                            </strong>

                        </div>


                        {/* STATUS */}

                        <div className="account-detail-item">

                            <span>
                                Status
                            </span>

                            <strong className="status-badge">
                                {account.status}
                            </strong>

                        </div>

                    </div>

                </div>

            )}


        </div>

    );

}

export default Account;