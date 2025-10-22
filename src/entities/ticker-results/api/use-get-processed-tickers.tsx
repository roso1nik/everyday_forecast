import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { RequestData, ResponseData } from '@/shared/types'
import { ResultTicker } from '../model/ticker'
import { useQuery } from '@tanstack/react-query'

const resultsTickers = async (data: RequestData<ResultTicker>): ResponseData<ResultTicker[]> => {
    const res = await apiClient.post('/ticker-results/search', data)

    return res
}

export const useResultsTickers = (data: RequestData<ResultTicker>) =>
    useQuery({
        queryKey: [ApiQueryKeys.RESULTS_TICKERS, data],
        queryFn: () => resultsTickers(data)
    })
