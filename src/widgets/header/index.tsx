/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/entities/auth/api/use-logout'
import { ROUTES } from '@/shared/router'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { GLOBAL_DICTIONARY } from '@/shared/config'

export const Header = () => {
    const { push } = useRouter()

    const refreshToken = Cookies.get(GLOBAL_DICTIONARY.REFRESH_TOKEN)
    const { mutate: logout, isPending: isLoadingLogout } = useLogout()

    return (
        <div className="border-primary/50 bg-background/50 flex w-full flex-row items-center justify-between rounded-full border p-4 backdrop-blur">
            <div>
                <Link href={ROUTES.HOME_PAGE}>
                    <p className="cursor-target italic hover:underline">everyday_forecast</p>
                </Link>
            </div>
            <div className="flex flex-row gap-1">
                <Button
                    variant="ghost"
                    className="cursor-target"
                    onClick={() => {
                        if (refreshToken) {
                            logout({ refreshToken: refreshToken })
                        } else {
                            push(ROUTES.AUTH_PAGE)
                        }
                    }}
                    loading={isLoadingLogout}
                >
                    {refreshToken ? 'Выйти' : 'Логин'}
                </Button>
            </div>
        </div>
    )
}
