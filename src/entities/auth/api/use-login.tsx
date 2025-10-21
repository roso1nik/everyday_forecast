import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface LoginRequest {
    login: string
    password: string
}

const login = async (data: LoginRequest) => {
    const res = await apiClient.post('/login', data, { withCredentials: true })

    return res
}

export const useLogin = () => {
    const { push } = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.LOGIN],
        mutationFn: login,
        onSuccess: () => {
            toast.success('Успешный вход')
            push(ROUTES.HOME_PAGE)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
}
