const API_URL = "http://localhost:8080/api/accounts";

export function getTransactionsByAccount(accountId) {

    return fetch(

        API_URL +

        "/" +

        accountId +

        "/transactions"

    )

        .then(function(response) {

            if (!response.ok) {

                return response.text().then(function(message) {

                    throw new Error(

                        message ||

                        "Failed to fetch transactions"

                    );

                });

            }

            return response.json();

        });

}