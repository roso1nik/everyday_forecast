'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/shared/router'
import Link from 'next/link'

export const Header = () => {
    return (
        <div className="border-primary/50 bg-background/50 flex w-full flex-row items-center justify-between rounded-full border p-4 backdrop-blur">
            <div>
                <Link href={ROUTES.HOME_PAGE}>
                    <p className="italic hover:underline">everyday_forecast</p>
                </Link>
            </div>
            <div className="flex flex-row gap-1">
                <Link href={ROUTES.AUTH_PAGE}>
                    <Button variant="ghost">Логин</Button>
                </Link>
            </div>
        </div>
    )
}
