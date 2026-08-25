const API_URL = "http://localhost:8080/api/users";

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