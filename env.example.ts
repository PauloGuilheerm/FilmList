export const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
export const appName = import.meta.env.VITE_APP_NAME || 'FilmList'
export const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'

export function getApiEndpoint(endpoint: string): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

