const BACKEND_API = process.env.BACKEND_API;

const postApi = async (endpoint, data, token) => {
    try {
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Cookie = `token=${token}`;
        }

        const response = await fetch(`${BACKEND_API}${endpoint}`, {
            method: "POST",
            headers,
            credentials: "include",
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching POST from API:", error);
        throw error;
    }
}

module.exports = postApi;