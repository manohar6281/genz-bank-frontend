import { useState } from "react";
import { loginUser } from "../services/loginService.js";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleLogin(event) {

        event.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        loginUser(email, password)

            .then(function(response) {

                console.log("STATUS:", response.status);

                if (!response.ok) {

                    return response.text().then(function(message) {

                        throw new Error(
                            message || "Invalid email or password"
                        );

                    });

                }

                return response.json();

            })

            .then(function(user) {

                console.log("LOGIN USER:", user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                // Also store user ID separately
                localStorage.setItem(
                    "userId",
                    String(user.id)
                );

                window.location.href = "/dashboard";

            })

            .catch(function(error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to login. Please try again."
                );

            })

            .finally(function() {

                setLoading(false);

            });
    }

    return (

        <div className="login-page">

            <div className="login-container">

                {/* =================================
                    LEFT BRAND SECTION
                ================================= */}

                <div className="brand-section">

                    <div className="brand-content">

                        <div className="brand-logo">
                            G
                        </div>

                        <h1>
                            GENZ BANK
                        </h1>

                        <p>
                            Banking made simple,
                            secure and designed
                            for the next generation.
                        </p>

                        <div className="brand-features">

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>
                                    Secure digital banking
                                </p>
                            </div>

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>
                                    Manage your accounts easily
                                </p>
                            </div>

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>
                                    Fast and simple transactions
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================
                    LOGIN SECTION
                ================================= */}

                <div className="login-card">

                    <div className="login-heading">

                        <span className="login-label">
                            WELCOME BACK
                        </span>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p className="login-subtitle">
                            Enter your details to continue
                            to GENZ BANK.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="login-error">

                            <span>
                                !
                            </span>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* FORM */}

                    <form onSubmit={handleLogin}>

                        <div className="login-form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={function(event) {
                                    setEmail(
                                        event.target.value
                                    );
                                }}
                                placeholder="Enter your email"
                                autoComplete="email"
                            />

                        </div>


                        <div className="login-form-group">

                            <div className="password-label-row">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <span>
                                    Forgot password?
                                </span>

                            </div>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={function(event) {
                                    setPassword(
                                        event.target.value
                                    );
                                }}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />

                        </div>


                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "SIGNING IN..."
                                : "SIGN IN"
                            }

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="register-link">

                        <span>
                            Don't have an account?
                        </span>

                        <a href="/register">
                            Create an account
                        </a>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Login;