import ApiResponse from "./ApiResponse";

export async function post<B, R>(path: string, body: B, needsAuth?: boolean): Promise<ApiResponse<R>> {
    try {
        const url = import.meta.env.VITE_API_URL + '/';
        const headersTemp: HeadersInit = needsAuth ? {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        } : {
            'Content-Type': 'application/json'
        }

        const request = await fetch(url + path, {
            method: 'POST',
            headers: headersTemp,
            body: JSON.stringify(body),
        });
        const response = await request.json();
        console.log(response)

        if (request.ok) {
            return {
                data: response as R,
                errorMessage: undefined,
                responseCode: request.status,
            };
        } else {
            const errorText = await request.json().then((data) => {
                console.log(data)
                if (data.detail) return data.detail;
                else if (data.error) return data.error;
                else return data;
            }).catch(() => {
                console.log(response.error)
                if (response.error) return response.error;
                return request.text()
            });
            return {
                data: response as R,
                errorMessage: errorText,
                responseCode: request.status,
            };
        }
    } catch (e) {
        console.error(e)
        return {}
    }
}

export async function get<R>(path: string, needsAuth?: boolean): Promise<ApiResponse<R>> {
    try {
        const url = import.meta.env.VITE_API_URL + '/';
        const headersTemp: HeadersInit = needsAuth ? {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        } : {}

        const request = await fetch(url + path, {
            method: 'GET',
            headers: headersTemp,
        });

        if (request.ok) {
            const response = await request.json();

            return {
                data: response as R,
                errorMessage: undefined,
                responseCode: request.status,
            };
        } else {
            const errorText = await request.text();
            return {
                data: undefined,
                errorMessage: errorText,
                responseCode: request.status,
            };
        }
    } catch (e) {
        console.error(e)
        return {}
    }
}

export async function put<B, R>(path: string, body: B, needsAuth?: boolean): Promise<ApiResponse<R>> {
    try {
        const url = import.meta.env.VITE_API_URL + '/';
        const headersTemp: HeadersInit = needsAuth ? {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        } : {
            'Content-Type': 'application/json'
        }

        const request = await fetch(url + path, {
            method: 'PUT',
            headers: headersTemp,
            body: JSON.stringify(body),
        });

        if (request.ok) {
            const response = await request.json();
            return {
                data: response as R,
                errorMessage: undefined,
                responseCode: request.status,
            };
        } else {
            const errorText = await request.text();
            return {
                data: undefined,
                errorMessage: errorText,
                responseCode: request.status,
            };
        }
    } catch (e) {
        console.error(e)
        return {}
    }
}

export async function del<R>(path: string, needsAuth?: boolean): Promise<ApiResponse<R>> {
    try {
        const url = import.meta.env.VITE_API_URL + '/';
        const headersTemp: HeadersInit = needsAuth ? {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        } : {}

        const request = await fetch(url + path, {
            method: 'DELETE',
            headers: headersTemp,
        });


        return {
            data: undefined,
            errorMessage: undefined,
            responseCode: request.status
        };
    } catch (e) {
        console.error(e)
        return {}
    }
}
