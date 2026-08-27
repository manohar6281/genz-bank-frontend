const API_URL = "https://genz-bank-backend.onrender.com/api/auth";

export function loginUser(email, password) {

    return fetch(
        API_URL + "/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );
}