import { useNavigate } from "react-router-dom";


function Navbar() {

    const navigate = useNavigate();


    const storedUser =
        localStorage.getItem("user");


    const user = storedUser
        ? JSON.parse(storedUser)
        : null;


    function handleLogout() {

        localStorage.removeItem("user");

        localStorage.removeItem("userId");

        navigate("/login");

    }


    function handleProfileClick() {

        navigate("/profile");

    }


    const profilePicture =
        user?.profilePicture;


    const initial =
        user?.name
            ? user.name
                .charAt(0)
                .toUpperCase()
            : "U";


    return (

        <header className="bank-navbar">


            <div className="navbar-brand">

                <div className="navbar-logo">
                    G
                </div>


                <div>

                    <h2>
                        GENZ BANK
                    </h2>

                    <span>
                        Digital Banking
                    </span>

                </div>

            </div>


            <div className="navbar-right">


                <button
                    type="button"
                    className="navbar-user profile-navbar-button"
                    onClick={handleProfileClick}
                >


                    <div className="user-avatar">

                        {profilePicture ? (

                            <img
                                src={profilePicture}
                                alt="Profile"
                                className="user-avatar-image"
                            />

                        ) : (

                            initial

                        )}

                    </div>


                    <div className="user-info">

                        <strong>
                            {user?.name || "User"}
                        </strong>

                        <span>
                            Personal Account
                        </span>

                    </div>


                </button>


                <button
                    className="logout-button"
                    onClick={handleLogout}
                >

                    Logout

                </button>


            </div>

        </header>

    );

}


export default Navbar;