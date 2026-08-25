import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    function handleLogout() {

        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        navigate("/login");
    }

    return (

        <aside className="bank-sidebar">

            {/* =====================================
                SIDEBAR BRAND
            ===================================== */}

            <div className="sidebar-brand">

                <div className="sidebar-logo">
                    G
                </div>

                <div>
                    <h2>GENZ BANK</h2>
                    <span>Banking made simple</span>
                </div>

            </div>


            {/* =====================================
                MAIN NAVIGATION
            ===================================== */}

            <nav className="sidebar-nav">

                <p className="sidebar-section-title">
                    MAIN MENU
                </p>


                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <span className="sidebar-icon">
                        ⌂
                    </span>

                    <span>
                        Dashboard
                    </span>
                </NavLink>


                <NavLink
                    to="/account"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <span className="sidebar-icon">
                        ◉
                    </span>

                    <span>
                        Accounts
                    </span>
                </NavLink>


                <NavLink
                    to="/open-account"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <span className="sidebar-icon">
                        +
                    </span>

                    <span>
                        Open Account
                    </span>
                </NavLink>


                <p className="sidebar-section-title">
                    MONEY
                </p>


                <NavLink
                    to="/deposit"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <span className="sidebar-icon">
                        ↓
                    </span>

                    <span>
                        Deposit
                    </span>
                </NavLink>


                <NavLink
                    to="/withdraw"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <span className="sidebar-icon">
                        ↑
                    </span>

                    <span>
                        Withdraw
                    </span>
                </NavLink>


                <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <span className="sidebar-icon">
                        ≡
                    </span>

                    <span>
                        Transactions
                    </span>
                </NavLink>

            </nav>


            {/* =====================================
                SIDEBAR BOTTOM
            ===================================== */}

            <div className="sidebar-bottom">

                <div className="sidebar-security">

                    <div className="security-icon">
                        ✓
                    </div>

                    <div>
                        <strong>
                            Secure Banking
                        </strong>

                        <span>
                            Your data is protected
                        </span>
                    </div>

                </div>


                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >

                    <span>
                        ↪
                    </span>

                    Logout

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;