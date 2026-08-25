import { useState } from "react";
import { registerUser } from "../services/registerService";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanPhone = phone.trim();

        if (!cleanName) {
            setError("Please enter your full name.");
            return;
        }

        if (!cleanEmail) {
            setError("Please enter your email.");
            return;
        }

        if (!cleanPhone) {
            setError("Please enter your phone number.");
            return;
        }

        if (!password) {
            setError("Please enter a password.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const user = await registerUser({
                name: cleanName,
                email: cleanEmail,
                phone: cleanPhone,
                password: password
            });

            console.log("Account created successfully:", user);

            setSuccess(
                "Account created successfully. You can now login."
            );

            setName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">

                <div className="brand-section">
                    <h1>GENZ BANK</h1>
                    <p>Banking made simple.</p>
                </div>

                <div className="login-card">

                    <h2>Create Account</h2>

                    <p className="login-subtitle">
                        Join GENZ Bank today
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
                            <label>Full Name</label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>

                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>

                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default Register;