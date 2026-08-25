import { useState } from "react";

import { createAccount } from "../services/accountService";


function OpenAccount() {

    const [type, setType] = useState("");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    const handleSubmit = function(event) {

        event.preventDefault();

        setError("");

        setSuccess("");


        if (type === "") {

            setError("Please select an account type");

            return;

        }


        const userId = localStorage.getItem("userId");


        if (!userId) {

            setError("User is not logged in");

            return;

        }


        setLoading(true);


        createAccount(userId, type)

            .then(function(account) {

                console.log(account);

                setSuccess(

                    "Account created successfully. Account Number: "

                    + account.accountNumber

                );

                setType("");

                setLoading(false);

            })

            .catch(function(error) {

                console.log(error);

                setError(error.message);

                setLoading(false);

            });

    };


    return (

        <div className="login-page">

            <div className="login-container">

                <div className="brand-section">

                    <h1>

                        GENZ BANK

                    </h1>

                    <p>

                        Banking made simple.

                    </p>

                </div>


                <div className="login-card">

                    <h2>

                        Open Bank Account

                    </h2>

                    <p className="login-subtitle">

                        Choose the type of account you want

                    </p>


                    {error && (

                        <p className="login-error">

                            {error}

                        </p>

                    )}


                    {success && (

                        <p className="login-success">

                            {success}

                        </p>

                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label htmlFor="accountType">

                                Account Type

                            </label>

                            <select

                                id="accountType"

                                value={type}

                                onChange={

                                    function(event) {

                                        setType(

                                            event.target.value

                                        );

                                    }

                                }

                                required

                            >

                                <option value="">

                                    Select Account Type

                                </option>

                                <option value="SAVINGS">

                                    Savings Account

                                </option>

                                <option value="CURRENT">

                                    Current Account

                                </option>

                            </select>

                        </div>


                        <button

                            type="submit"

                            className="login-button"

                            disabled={loading}

                        >

                            {loading

                                ? "OPENING ACCOUNT..."

                                : "OPEN ACCOUNT"

                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}


export default OpenAccount;