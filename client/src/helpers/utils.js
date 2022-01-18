export function genId() {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < 10; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
};

export async function api(method, path, data = {}) {

    const URL = "http://10.2.20.53:3000/api/";
    const KEY = localStorage.getItem('key');

    if (method === 'GET') {

        const response = await fetch(URL + path, {
            method,
            headers: {
                'Authorization': KEY
            }
        });

        // Reset the key if it's expired
        if (response.status === 401) localStorage.removeItem('key');
        
        if (response.status !== 200 && response.status !== 201) {
            let msg = await response.text();
            throw new Error(msg);
        }
	
	try {

        	return await response.clone().json();

	} catch {
		return await response.clone().text();
	}

    } else {

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

        if (response.status !== 200 && response.status !== 201) {
            let msg = await response.text();
            throw new Error(msg);
        }

        return await response.json();

    }
}