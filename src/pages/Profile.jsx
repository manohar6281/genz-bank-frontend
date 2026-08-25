import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
    updateProfilePicture
} from "../services/profileService";


function Profile() {

    const navigate = useNavigate();


    const storedUser =
        localStorage.getItem("user");


    const user = storedUser
        ? JSON.parse(storedUser)
        : null;


    const [profilePicture, setProfilePicture] =
        useState(
            user?.profilePicture || ""
        );


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    /*
     * COMPRESS IMAGE
     *
     * This keeps the image small enough
     * to store safely in PostgreSQL.
     */
    function compressImage(file) {

        return new Promise(
            function(resolve, reject) {

                const reader =
                    new FileReader();


                reader.onload =
                    function(event) {

                        const image =
                            new Image();


                        image.onload =
                            function() {

                                const maxSize =
                                    512;


                                let width =
                                    image.width;


                                let height =
                                    image.height;


                                /*
                                 * Resize while keeping
                                 * original proportions.
                                 */
                                if (
                                    width >
                                    maxSize ||
                                    height >
                                    maxSize
                                ) {

                                    if (
                                        width >
                                        height
                                    ) {

                                        height =
                                            Math.round(
                                                height *
                                                maxSize /
                                                width
                                            );

                                        width =
                                            maxSize;

                                    }

                                    else {

                                        width =
                                            Math.round(
                                                width *
                                                maxSize /
                                                height
                                            );

                                        height =
                                            maxSize;

                                    }

                                }


                                const canvas =
                                    document.createElement(
                                        "canvas"
                                    );


                                canvas.width =
                                    width;

                                canvas.height =
                                    height;


                                const context =
                                    canvas.getContext(
                                        "2d"
                                    );


                                context.drawImage(
                                    image,
                                    0,
                                    0,
                                    width,
                                    height
                                );


                                /*
                                 * JPEG quality 0.8
                                 */
                                const compressed =
                                    canvas.toDataURL(
                                        "image/jpeg",
                                        0.8
                                    );


                                resolve(
                                    compressed
                                );

                            };


                        image.onerror =
                            function() {

                                reject(
                                    new Error(
                                        "Unable to read the image."
                                    )
                                );

                            };


                        image.src =
                            event.target.result;

                    };


                reader.onerror =
                    function() {

                        reject(
                            new Error(
                                "Unable to read the selected file."
                            )
                        );

                    };


                reader.readAsDataURL(file);

            }
        );

    }


    /*
     * SELECT IMAGE
     */
    function handleFileChange(event) {

        setError("");

        setSuccess("");


        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        /*
         * Only images.
         */
        if (!file.type.startsWith("image/")) {

            setError(
                "Please select an image file."
            );

            return;

        }


        /*
         * Original file limit.
         */
        if (
            file.size >
            5 * 1024 * 1024
        ) {

            setError(
                "Please choose an image smaller than 5 MB."
            );

            return;

        }


        setLoading(true);


        compressImage(file)

            .then(function(compressedImage) {

                setProfilePicture(
                    compressedImage
                );

                setLoading(false);

            })

            .catch(function(error) {

                console.error(error);

                setError(
                    error.message ||
                    "Unable to process image."
                );

                setLoading(false);

            });

    }


    /*
     * SAVE PROFILE PICTURE
     */
    function handleSave() {

        setError("");

        setSuccess("");


        if (!user?.id) {

            setError(
                "User information was not found. Please login again."
            );

            return;

        }


        if (!profilePicture) {

            setError(
                "Please select a profile picture."
            );

            return;

        }


        setLoading(true);


        updateProfilePicture(
            user.id,
            profilePicture
        )

            .then(function(updatedUser) {

                /*
                 * IMPORTANT:
                 *
                 * Update localStorage too.
                 */
                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUser
                    )
                );


                setProfilePicture(
                    updatedUser.profilePicture ||
                    ""
                );


                setSuccess(
                    "Profile picture updated successfully."
                );


                setLoading(false);

            })

            .catch(function(error) {

                console.error(
                    "PROFILE PICTURE ERROR:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to update profile picture."
                );


                setLoading(false);

            });

    }


    /*
     * REMOVE PROFILE PICTURE
     */
    function handleRemove() {

        setError("");

        setSuccess("");


        if (!user?.id) {

            return;

        }


        setLoading(true);


        updateProfilePicture(
            user.id,
            null
        )

            .then(function(updatedUser) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUser
                    )
                );


                setProfilePicture("");

                setSuccess(
                    "Profile picture removed."
                );


                setLoading(false);

            })

            .catch(function(error) {

                console.error(error);

                setError(
                    error.message ||
                    "Failed to remove profile picture."
                );

                setLoading(false);

            });

    }


    /*
     * NOT LOGGED IN
     */
    if (!user) {

        return (

            <div className="login-page">

                <div className="login-card">

                    <h2>
                        Please Login
                    </h2>

                    <button
                        className="login-button"
                        onClick={function() {

                            navigate("/login");

                        }}
                    >
                        Go to Login
                    </button>

                </div>

            </div>

        );

    }


    /*
     * AVATAR FALLBACK
     */
    const initial =
        user.name
            ? user.name
                .charAt(0)
                .toUpperCase()
            : "U";


    return (

        <div className="bank-layout">

            <Sidebar />


            <div className="bank-main">

                <Navbar />


                <main className="profile-page">


                    <div className="profile-header">

                        <span className="section-label">
                            PROFILE
                        </span>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your profile picture and
                            personal information.
                        </p>

                    </div>


                    {error && (

                        <div className="profile-alert error">

                            {error}

                        </div>

                    )}


                    {success && (

                        <div className="profile-alert success">

                            {success}

                        </div>

                    )}


                    <div className="profile-card">


                        {/* PROFILE IMAGE */}

                        <div className="profile-picture-section">

                            <div className="profile-picture-large">

                                {profilePicture ? (

                                    <img
                                        src={
                                            profilePicture
                                        }
                                        alt="Profile"
                                    />

                                ) : (

                                    <span>
                                        {initial}
                                    </span>

                                )}

                            </div>


                            <h2>
                                {user.name || "User"}
                            </h2>


                            <p>
                                {user.email}
                            </p>

                        </div>


                        {/* UPLOAD */}

                        <div className="profile-form">


                            <div className="profile-upload-box">

                                <label
                                    htmlFor="profilePicture"
                                    className="profile-upload-label"
                                >

                                    Choose Profile Picture

                                </label>


                                <input
                                    id="profilePicture"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={
                                        handleFileChange
                                    }
                                    disabled={loading}
                                />


                                <p>
                                    JPG, PNG or WEBP.
                                    Maximum 5 MB.
                                </p>

                            </div>


                            <div className="profile-actions">

                                <button
                                    type="button"
                                    className="primary-transaction-button"
                                    onClick={
                                        handleSave
                                    }
                                    disabled={
                                        loading ||
                                        !profilePicture
                                    }
                                >

                                    {loading
                                        ? "Processing..."
                                        : "Save Profile Picture"
                                    }

                                </button>


                                {profilePicture && (

                                    <button
                                        type="button"
                                        className="secondary-transaction-button"
                                        onClick={
                                            handleRemove
                                        }
                                        disabled={
                                            loading
                                        }
                                    >

                                        Remove Photo

                                    </button>

                                )}

                            </div>


                            <div className="profile-information">

                                <div>

                                    <span>
                                        FULL NAME
                                    </span>

                                    <strong>
                                        {user.name}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        EMAIL
                                    </span>

                                    <strong>
                                        {user.email}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        PHONE
                                    </span>

                                    <strong>
                                        {user.phone || "Not provided"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );

}


export default Profile;