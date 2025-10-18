// Función para obtener el token de localStorage
function getAuthToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
}

// Función genérica para hacer peticiones fetch a nuestro backend
async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers = new Headers(options.headers || {});
    
    headers.set('Content-Type', 'application/json');

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`http://localhost:3000${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || `Error ${response.status}`);
    }

    // Si la respuesta no tiene contenido (ej: en un DELETE), devolvemos un objeto vacío
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json() as Promise<T>;
    } else {
        return {} as Promise<T>;
    }
}

// Exportamos métodos específicos para facilidad de uso
export const api = {
    get: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: any) => apiClient<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: any) => apiClient<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'DELETE' }),
};