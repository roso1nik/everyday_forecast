import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useMutation } from '@tanstack/react-query'
import { AxiosPromise } from 'axios'

interface RefreshRequest {
    refreshToken: string
}

interface RefreshResponse {
    accessToken: string
}

export const refreshTokens = async (data: RefreshRequest): AxiosPromise<RefreshResponse> => {
    const res = await apiClient.post('/auth/refresh', data, { withCredentials: true })

    return res
}

export const useRefresh = () => {
    return useMutation({
        mutationKey: [ApiQueryKeys.REFRESH],
        mutationFn: refreshTokens
    })
}
