const BACKEND_API = process.env.BACKEND_API;

const getApi = async (endpoint, token) => {
    try {
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Cookie = `token=${token}`;
        }

        const response = await fetch(`${BACKEND_API}${endpoint}`, {
            method: "GET",
            headers,
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

module.exports = getApi;