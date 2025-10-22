/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable react-perf/jsx-no-new-object-as-prop */
'use client'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { useResultsTickers } from '@/entities/ticker-results/api/use-get-processed-tickers'
import { TickerDirection, TickerTimeFrame } from '@/entities/ticker-results/model/ticker'
import { PLACEHOLDER_QUERY } from '@/shared/types'
import { cn } from '@/shared/utils'
import { useState } from 'react'

const PAGINATION_COUNT = 8

export const ResultsTickersList = () => {
    const [page, setPage] = useState(1)

    const {
        data: resultsTicker,
        isLoading,
        isPending
    } = useResultsTickers({
        ...PLACEHOLDER_QUERY,
        pagination: { count: PAGINATION_COUNT, page: page },
        filters: {}
    })

    const countTickers = Math.round((resultsTicker?.data.count || 0) / PAGINATION_COUNT) + 1

    if (isLoading) return <Loader />

    const getDirectionGradient = (direction: TickerDirection) => {
        switch (direction) {
            case TickerDirection.LONG:
                return {
                    primary: 'rgba(34, 197, 94, 0.15)',
                    secondary: 'rgba(16, 185, 129, 0.1)',
                    accent: 'rgba(5, 150, 105, 0.2)'
                }
            case TickerDirection.SHORT:
                return {
                    primary: 'rgba(239, 68, 68, 0.15)',
                    secondary: 'rgba(220, 38, 38, 0.1)',
                    accent: 'rgba(185, 28, 28, 0.2)'
                }
            default:
                return {
                    primary: 'rgba(156, 163, 175, 0.15)',
                    secondary: 'rgba(107, 114, 128, 0.1)',
                    accent: 'rgba(75, 85, 99, 0.2)'
                }
        }
    }

    const getDirectionIcon = (direction: TickerDirection) => {
        switch (direction) {
            case TickerDirection.LONG:
                return '↗'
            case TickerDirection.SHORT:
                return '↘'
            default:
                return '→'
        }
    }

    const formatPrice = (price: number | null) => {
        if (!price) return '-'
        return `$${price.toFixed(2)}`
    }

    const formatPercentage = (percent: number | null) => {
        if (!percent) return '-'
        return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`
    }

    const getTimeframeLabel = (timeframe: TickerTimeFrame) => {
        switch (timeframe) {
            case TickerTimeFrame.OneDay:
                return '1D'
            case TickerTimeFrame.OneWeek:
                return '1W'
            default:
                return timeframe
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {resultsTicker?.data.count === 0 && <p>Ничего не найдено</p>}
                {resultsTicker?.data.data.map((el) => {
                    const gradient = getDirectionGradient(el.direction)

                    return (
                        <div
                            key={el.id}
                            className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-gray-800/50 p-5 transition-all duration-300 hover:border-gray-700/70"
                        >
                            <div
                                className="absolute inset-0 -z-10 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    background: `linear-gradient(135deg, 
                                    ${gradient.primary} 0%, 
                                    ${gradient.secondary} 50%, 
                                    ${gradient.accent} 100%),
                                    radial-gradient(
                                        circle at 20% 80%,
                                        rgba(32, 196, 232, 0.15) 0%,
                                        transparent 50%
                                    )`,
                                    backgroundBlendMode: 'overlay, normal'
                                }}
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-white">{el.ticker.name}</span>
                                    <span
                                        className={cn(
                                            'rounded-full border px-2 py-1 text-xs font-medium',
                                            el.direction === TickerDirection.LONG
                                                ? 'border-green-400/30 bg-green-400/10 text-green-400'
                                                : el.direction === TickerDirection.SHORT
                                                  ? 'border-red-400/30 bg-red-400/10 text-red-400'
                                                  : 'border-gray-400/30 bg-gray-400/10 text-gray-400'
                                        )}
                                    >
                                        {getTimeframeLabel(el.timeframe)}
                                    </span>
                                </div>
                                <div
                                    className={cn(
                                        'text-lg font-bold',
                                        el.direction === TickerDirection.LONG
                                            ? 'text-green-400'
                                            : el.direction === TickerDirection.SHORT
                                              ? 'text-red-400'
                                              : 'text-gray-400'
                                    )}
                                >
                                    {getDirectionIcon(el.direction)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Текущая</p>
                                    <p className="font-medium text-white">{formatPrice(el.currentPrice)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Прогноз</p>
                                    <p className="font-medium text-blue-300">{formatPrice(el.predictedPrice)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Реальная</p>
                                    <p className="font-medium text-purple-300">{formatPrice(el.realPrice)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Разница</p>
                                    <p
                                        className={cn(
                                            'font-medium',
                                            el.percentDifference && el.percentDifference > 0
                                                ? 'text-green-400'
                                                : el.percentDifference && el.percentDifference < 0
                                                  ? 'text-red-400'
                                                  : 'text-gray-400'
                                        )}
                                    >
                                        {formatPercentage(el.percentDifference)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-700/50 pt-2">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Кредитное плечо</p>
                                    <p className="text-sm text-white">{el.leverage ? `${el.leverage}x` : '-'}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-muted-foreground text-xs">Статус</p>
                                    <p
                                        className={cn(
                                            'text-sm font-medium',
                                            el.isClosed ? 'text-yellow-400' : 'text-green-400'
                                        )}
                                    >
                                        {el.isClosed ? 'Завершён' : 'Активен'}
                                    </p>
                                </div>
                            </div>

                            {(el.stopLoss || el.takeProfit) && (
                                <div className="flex items-center justify-between text-xs">
                                    {el.stopLoss && (
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">SL</p>
                                            <p className="font-medium text-red-400">{formatPrice(el.stopLoss)}</p>
                                        </div>
                                    )}
                                    {el.takeProfit && (
                                        <div className="space-y-1 text-right">
                                            <p className="text-muted-foreground">TP</p>
                                            <p className="font-medium text-green-400">{formatPrice(el.takeProfit)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="flex flex-row gap-1">
                {...Array.from({ length: countTickers }).map((_, index) => (
                    <Button
                        key={index}
                        variant={page === index + 1 ? 'default' : 'outline'}
                        onClick={() => setPage(index + 1)}
                        className="h-10! w-10! cursor-target"
                    >
                        {index + 1}
                    </Button>
                ))}
                {isPending && <p>Загрузка...</p>}
            </div>
        </div>
    )
}
