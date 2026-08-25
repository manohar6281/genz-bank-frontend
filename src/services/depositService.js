const API_URL = "http://localhost:8080/api/accounts";


// =========================================
// DEPOSIT MONEY
// =========================================

export function depositMoney(accountId, amount) {

    if (!accountId) {

        return Promise.reject(
            new Error("Account ID is required")
        );

    }

    if (
        amount === null ||
        amount === undefined ||
        Number(amount) <= 0
    ) {

        return Promise.reject(
            new Error(
                "Amount must be greater than zero"
            )
        );

    }

    return fetch(
        API_URL +
        "/" +
        encodeURIComponent(accountId) +
        "/deposit?amount=" +
        encodeURIComponent(amount),
        {
            method: "POST"
        }
    )
        .then(function(response) {

            if (!response.ok) {

                return response.text().then(function(message) {

                    throw new Error(
                        message ||
                        "Failed to deposit money"
                    );

                });

            }

            return response.json();

        });

}