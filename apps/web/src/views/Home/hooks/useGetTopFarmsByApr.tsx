import { useState, useEffect } from 'react'
import { useFarms, usePriceCakeBusd } from 'state/farms/hooks'
import { featureFarmApiAtom, useFeatureFlag } from 'hooks/useFeatureFlag'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync } from 'state/farms'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { DeserializedFarm, FarmWithStakedValue } from '@pancakeswap/farms'
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'

const useGetTopFarmsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()
  const { data: farms, regularCakePerBlock } = useFarms()
  const [fetchStatus, setFetchStatus] = useState<TFetchStatus>(FetchStatus.Idle)
  const [fetched, setFetched] = useState(false)
  const [topFarms, setTopFarms] = useState<(FarmWithStakedValue | null)[]>([null, null, null, null, null])
  const cakePriceBusd = usePriceCakeBusd()
  const { chainId } = useActiveChainId()
  const farmFlag = useFeatureFlag(featureFarmApiAtom)

  useEffect(() => {
    const fetchFarmData = async () => {
      const farmsConfig = await getFarmConfig(chainId)
      setFetchStatus(FetchStatus.Fetching)
      const activeFarms = farmsConfig.filter((farm) => farm.pid !== 0)
      try {
        await dispatch(
          fetchFarmsPublicDataAsync({ pids: activeFarms.map((farm) => farm.pid), chainId, flag: farmFlag }),
        )
        setFetchStatus(FetchStatus.Fetched)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.Failed)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.Idle) {
      fetchFarmData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topFarms, isIntersecting, chainId, farmFlag])

  useEffect(() => {
    const getTopFarmsByApr = (farmsState: DeserializedFarm[]) => {
      const farmsWithPrices = farmsState.filter(
        (farm) =>
          farm.lpTotalInQuoteToken &&
          farm.quoteTokenPriceBusd &&
          farm.pid !== 0 &&
          farm.multiplier &&
          farm.multiplier !== '0X',
      )
      const farmsWithApr = farmsWithPrices.map((farm) => {
        const totalLiquidity = farm?.quoteTokenPriceBusd
          ? farm?.lpTotalInQuoteToken?.times(farm.quoteTokenPriceBusd)
          : undefined
        const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
          chainId,
          farm.poolWeight ?? BIG_ZERO,
          cakePriceBusd,
          totalLiquidity ?? BIG_ZERO,
          farm.lpAddress,
          regularCakePerBlock ?? 0,
        )
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr }
      })

      const sortedByApr = orderBy(farmsWithApr, (farm) => Number(farm.apr) + Number(farm.lpRewardsApr), 'desc')
      setTopFarms(sortedByApr.slice(0, 5))
      setFetched(true)
    }

    if (fetchStatus === FetchStatus.Fetched && !topFarms[0] && farms?.length > 0) {
      getTopFarmsByApr(farms)
    }
  }, [setTopFarms, farms, fetchStatus, cakePriceBusd, topFarms, regularCakePerBlock, chainId])

  return { topFarms, fetched }
}

export default useGetTopFarmsByApr
