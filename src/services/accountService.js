const API_URL = "https://genz-bank-backend.onrender.com/api/accounts";


// =========================================
// GET ALL ACCOUNTS FOR USER
// =========================================

export function getUserAccounts(userId) {

    if (!userId) {
        return Promise.reject(
            new Error("User ID is required")
        );
    }

    return fetch(
        API_URL +
        "?userId=" +
        encodeURIComponent(userId),
        {
            method: "GET"
        }
    )
        .then(function(response) {

            if (!response.ok) {

                return response.text().then(function(message) {

                    throw new Error(
                        message ||
                        "Failed to load accounts"
                    );

                });

            }

            return response.json();

        });

}


// =========================================
// GET SINGLE ACCOUNT
// =========================================

export function getAccount(accountId) {

    if (!accountId) {
        return Promise.reject(
            new Error("Account ID is required")
        );
    }

    return fetch(
        API_URL +
        "/" +
        encodeURIComponent(accountId),
        {
            method: "GET"
        }
    )
        .then(function(response) {

            if (!response.ok) {

                return response.text().then(function(message) {

                    throw new Error(
                        message ||
                        "Failed to load account"
                    );

                });

            }

            return response.json();

        });

}


// =========================================
// CREATE ACCOUNT
// =========================================

export function createAccount(userId, type) {

    if (!userId) {
        return Promise.reject(
            new Error("User ID is required")
        );
    }

    if (!type) {
        return Promise.reject(
            new Error("Account type is required")
        );
    }

    return fetch(
        API_URL +
        "?userId=" +
        encodeURIComponent(userId) +
        "&type=" +
        encodeURIComponent(type),
        {
            method: "POST"
        }
    )
        .then(function(response) {

            if (!response.ok) {

                return response.text().then(function(message) {

                    throw new Error(
                        message ||
                        "Failed to create account"
                    );

                });

            }

            return response.json();

        });

}