'use client'

import { ROUTES } from '@/shared/router'
import { useRouter } from 'next/navigation'
import SplitText from '@/components/SplitText'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { Loader } from '@/components/loader'

export default function Home() {
    const { push } = useRouter()

    const { isAuth, isLoading } = useIsAuth()

    if (isLoading) return <Loader />

    if (!isAuth) return push(ROUTES.AUTH_PAGE)

    return (
        <div className="flex w-full flex-row items-center justify-center">
            <SplitText
                text="Стал ли ты сегодня миллионером или снова нет?"
                className="text-center text-2xl font-semibold"
                delay={50}
                duration={0.3}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
            />
        </div>
    )
}
