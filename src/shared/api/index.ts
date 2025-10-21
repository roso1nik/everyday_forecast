import axios from 'axios'
import Cookies from 'js-cookie'
import { GLOBAL_DICTIONARY } from '../config'

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

// Добавление токена в запрос
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const accessToken = Cookies.get(GLOBAL_DICTIONARY.ACCESS_TOKEN)
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`
            }
            return config
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Обработка ответов
let refreshTokenAttempts = 0

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (typeof window !== 'undefined') {
            if (error.response.status === 401 && !originalRequest._retry) {
                if (refreshTokenAttempts >= 3) {
                    return Promise.reject(error)
                }

                originalRequest._retry = true
                refreshTokenAttempts += 1

                // try {
                //     const refreshToken = Cookies.get(GLOBAL_DICTIONARY.REFRESH_TOKEN)
                //     if (!refreshToken) {
                //         return Promise.reject(error)
                //     }

                //     const response = await authApi.refreshTokens(refreshToken)

                //     refreshTokenAttempts = 0

                //     const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response

                //     Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, newAccessToken, {
                //         expires: AUTH_CONGIG.ACCESS_TOKEN_LIFETIME
                //     })
                //     Cookies.set(GLOBAL_DICTIONARY.REFRESH_TOKEN, newRefreshToken, {
                //         expires: AUTH_CONGIG.REFRESH_TOKEN_LIFETIME
                //     })

                //     apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
                //     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

                //     return apiClient(originalRequest)
                // } catch (refreshError) {
                //     return Promise.reject(refreshError)
                // }
            }
        }

        return Promise.reject(error)
    }
)

export const apiServerClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: false
})
apiServerClient.interceptors.request.use((config) => {
    if (config.headers?.cookie) {
        delete config.headers.cookie
    }
    return config
})

export default apiClient
