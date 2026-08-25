const API_URL = "http://localhost:8080/api/users";


export function updateProfilePicture(
    userId,
    profilePicture
) {

    return fetch(
        API_URL +
        "/" +
        userId +
        "/profile-picture",
        {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                profilePicture:
                    profilePicture

            })

        }
    )

        .then(function(response) {

            if (!response.ok) {

                return response
                    .text()
                    .then(function(message) {

                        throw new Error(
                            message ||
                            "Failed to update profile picture."
                        );

                    });

            }


            return response.json();

        });

}