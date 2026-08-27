const API_URL = "https://genz-bank-backend.onrender.com/api/users";

export function registerUser(user) {

    return fetch(

        API_URL,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(user)

        }

    )

        .then(function(response) {

            if (!response.ok) {

                return response.text().then(function(message) {

                    throw new Error(

                        message || "Registration failed"

                    );

                });

            }

            return response.json();

        });

}