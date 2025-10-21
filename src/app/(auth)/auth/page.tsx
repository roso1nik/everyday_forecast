import LightRays from '@/components/LightRays'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AuthPage() {
    return (
        <>
            <div className="-z-100 absolute left-0 top-0 h-screen w-full">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#00ffff"
                    raysSpeed={1.5}
                    lightSpread={0.8}
                    rayLength={1.2}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                />
            </div>
            <div className="border-primary/50 bg-background/30 m-auto mt-20 flex w-1/4 flex-col items-center rounded-lg border p-4 backdrop-blur">
                <p className="text-xl font-black">Авторизация</p>
                <div className="mt-4 flex w-full flex-col gap-1">
                    <Input placeholder="Логин" />
                    <Input placeholder="Пароль" type="password" />
                    <Button>Войти</Button>
                </div>
            </div>
        </>
    )
}
