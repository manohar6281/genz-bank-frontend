const API_URL = "http://localhost:8080/api/auth";

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