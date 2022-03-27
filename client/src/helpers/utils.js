
/**
 * Generate a random string of length 10
 * @returns string - random string
 */
export function genId() {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
};

/**
 * Create an API request to the server
 * @param method : string - HTTP method (GET, POST, PUT, DELETE)
 * @param {*} path : string - path to the API endpoint
 * @param {*} data : object - data to send to the server
 * @returns data : object - data returned from the server
 */
export async function api(method, path, data = {}) {

    // Get the server's URL
    var URL = "http://10.2.20.53:3000/api/";
    // For development, use the local server
    if (!isProduction) URL = "http://localhost:3000/api/";

    // Get the access token from local storage
    const KEY = localStorage.getItem('key');

    if (method === 'GET') {

        // Add the access token to the request
        // Fetches the data from the server
        const response = await fetch(URL + path, {
            method,
            headers: {'Authorization': KEY}
        });

        // Reset the key if it's expired
        if (response.status === 401) localStorage.removeItem('key');
        
        // Return an error if the server returned an error
        if (response.status !== 200 && response.status !== 201) {
            let msg = await response.text();
            throw new Error(msg);
        }
        
        // Return the data from the server
        try {
            return await response.clone().json();
        } catch {
            return await response.clone().text();
        }

    } else {

        // Add the access token to the request
        // Sends the data to the server
        const response = await fetch(URL + path, {
            method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': KEY
            }
        });

        // Reset the key if it's expired
        if (response.status === 401) localStorage.removeItem('key');

        // Return an error if the server returned an error
        if (response.status !== 200 && response.status !== 201) {
            let msg = await response.text();
            throw new Error(msg);
        }

        // Return the data from the server
        return await response.json();

    }
}

/**
 * This method will attempt to parse JSON data. If it fails, it will return the original string.
 * @param str : string - string to check 
 * @returns property - string : return specified property from JSON string
 * @returns object | string - parsed JSON object
 */
export function attemptJsonParse(str, property = null) {
    try {
        var parsed = JSON.parse(str);
        if (property != null) {
            return parsed[property];
        } else {
            return parsed;
        }
    } catch (e) {
        return str;
    }
}