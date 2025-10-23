/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable react-perf/jsx-no-new-object-as-prop */
'use client'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useResultsTickers } from '@/entities/ticker-results/api/use-get-processed-tickers'
import { useAvailableTickers } from '@/entities/ticker-results/api/use-get-tickers'
import { TickerDirection, TickerTimeFrame } from '@/entities/ticker-results/model/ticker'
import { PLACEHOLDER_QUERY, SortOptions } from '@/shared/types'
import { cn } from '@/shared/utils'
import { Check, ChevronDownIcon, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import dayjs from 'dayjs'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'

const PAGINATION_COUNT = 8

export const ResultsTickersList = () => {
    const [page, setPage] = useState(1)

    const [isClosed, setIsClosed] = useState<SortOptions>(undefined)
    const [open, setOpen] = useState(false)
    const [valueTicker, setValueTicker] = useState('')

    const [openDate, setOpenDate] = useState(false)
    const [dateMin, setDateMin] = useState<Date | undefined>(undefined)
    const [openDateMax, setOpenDateMax] = useState(false)
    const [dateMax, setDateMax] = useState<Date | undefined>(undefined)

    const {
        data: resultsTicker,
        isLoading,
        isPending
    } = useResultsTickers({
        ...PLACEHOLDER_QUERY,
        pagination: { count: PAGINATION_COUNT, page: page },
        filters: {
            closedAt: {
                min: dateMin?.toISOString() || undefined,
                max: dateMax?.toISOString() || undefined
            },
            tickersIds: valueTicker ? [Number(valueTicker)] : undefined
        },
        sorts: {
            isClosed: isClosed
        }
    })

    const { data: tickers } = useAvailableTickers()

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
            <div className="border-primary/50 bg-background/50 flex w-full flex-row flex-wrap items-center justify-between gap-1 rounded-lg border p-4 backdrop-blur">
                <div className="flex flex-row flex-wrap gap-3">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="ticker-picker" className="px-1">
                            Тикер
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[200px] justify-between"
                                    id="ticker-picker"
                                >
                                    {valueTicker
                                        ? tickers?.data.find((framework) => framework.id.toString() === valueTicker)
                                              ?.name
                                        : 'Выберите тикер...'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandList>
                                        <CommandEmpty>Тикеры не найдены</CommandEmpty>
                                        <CommandGroup>
                                            {tickers?.data.map((framework) => (
                                                <CommandItem
                                                    key={framework.id.toString()}
                                                    value={framework.id.toString()}
                                                    onSelect={(currentValue) => {
                                                        setValueTicker(currentValue === valueTicker ? '' : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {framework.name}
                                                    <Check
                                                        className={cn(
                                                            'ml-auto',
                                                            valueTicker === framework.id.toString()
                                                                ? 'opacity-100'
                                                                : 'opacity-0'
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="date-picker" className="px-1">
                            Начало
                        </Label>
                        <div className="flex flex-row gap-1">
                            <Popover open={openDate} onOpenChange={setOpenDate}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date-picker"
                                        className="w-32 justify-between font-normal"
                                    >
                                        {dateMin ? dateMin.toLocaleDateString() : 'Дата'}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateMin}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDateMin(date)
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="date-picker" className="px-1">
                            Конец
                        </Label>
                        <div className="flex flex-row gap-1">
                            <Popover open={openDateMax} onOpenChange={setOpenDateMax}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date-picker"
                                        className="w-32 justify-between font-normal"
                                    >
                                        {dateMax ? dateMax.toLocaleDateString() : 'Дата'}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateMax}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDateMax(date)
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Label className="px-1">Сорт. закрытия</Label>
                    <Select value={isClosed as any} onValueChange={(e) => setIsClosed(e as SortOptions)}>
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Сортировка завершения" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={'ASC'}>По возрастанию</SelectItem>
                            <SelectItem value="DESC">По убыванию</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                <table className="w-full min-w-full divide-y divide-gray-800/50">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Тикер
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Направление
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Таймфрейм
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Текущая цена
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Прогноз
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Реальная цена
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Разница
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Плечо
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Статус
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                SL/TP
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/30 bg-transparent">
                        {resultsTicker?.data.count === 0 && (
                            <tr>
                                <td colSpan={10} className="px-6 py-8 text-center text-gray-400">
                                    Ничего не найдено
                                </td>
                            </tr>
                        )}
                        {resultsTicker?.data.data.map((el) => {
                            const gradient = getDirectionGradient(el.direction)

                            return (
                                <tr
                                    key={el.id}
                                    className="group transition-all duration-300 hover:bg-gray-800/20"
                                    style={{
                                        background: `linear-gradient(135deg, 
                                ${gradient.primary}15 0%, 
                                ${gradient.secondary}15 50%, 
                                ${gradient.accent}15 100%)`
                                    }}
                                >
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">{el.ticker.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-sm">
                                                {dayjs(el.createdAt).format(DATE_TIME_DEFAULT_FORMAT)}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span
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
                                            </span>
                                            <span className="text-sm text-gray-300">
                                                {el.direction === TickerDirection.LONG
                                                    ? 'LONG'
                                                    : el.direction === TickerDirection.SHORT
                                                      ? 'SHORT'
                                                      : 'NEUTRAL'}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
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
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-xs">Текущая</p>
                                            <p className="font-medium text-white">{formatPrice(el.currentPrice)}</p>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-xs">Прогноз</p>
                                            <p className="font-medium text-blue-300">
                                                {formatPrice(el.predictedPrice)}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-xs">Реальная</p>
                                            <p className="font-medium text-purple-300">{formatPrice(el.realPrice)}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
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
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-xs">Плечо</p>
                                            <p className="text-sm text-white">
                                                {el.leverage ? `${el.leverage}x` : '-'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
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
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            {el.stopLoss && (
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-muted-foreground">SL:</span>
                                                    <span className="font-medium text-red-400">
                                                        {formatPrice(el.stopLoss)}
                                                    </span>
                                                </div>
                                            )}
                                            {el.takeProfit && (
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-muted-foreground">TP:</span>
                                                    <span className="font-medium text-green-400">
                                                        {formatPrice(el.takeProfit)}
                                                    </span>
                                                </div>
                                            )}
                                            {!el.stopLoss && !el.takeProfit && <span className="text-gray-500">-</span>}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
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
