'use client'

import { ROUTES } from '@/shared/router'
import { useRouter } from 'next/navigation'

export default function Home() {
    const { push } = useRouter()

    const isAuth = true

    if (!isAuth) return push(ROUTES.AUTH_PAGE)

    return <div className="flex w-full flex-row items-center justify-center">HOME PAGE</div>
}
