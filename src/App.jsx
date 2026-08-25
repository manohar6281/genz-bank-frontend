import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Account from "./pages/Account.jsx";
import OpenAccount from "./pages/OpenAccount.jsx";
import Deposit from "./pages/Deposit.jsx";
import Withdraw from "./pages/Withdraw.jsx";
import Transactions from "./pages/Transactions.jsx";
import Profile from "./pages/Profile.jsx";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/account"
                    element={<Account />}
                />

                <Route
                    path="/open-account"
                    element={<OpenAccount />}
                />

                <Route
                    path="/deposit"
                    element={<Deposit />}
                />

                <Route
                    path="/withdraw"
                    element={<Withdraw />}
                />

                <Route
                    path="/transactions"
                    element={<Transactions />}
                />
				<Route
				    path="/profile"
				    element={<Profile />}
				/>
            </Routes>

        </BrowserRouter>

    );
}

export default App;