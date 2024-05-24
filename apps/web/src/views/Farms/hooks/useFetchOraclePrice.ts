import { ChainId } from '@pancakeswap/sdk'
import { useReadContract } from '@pancakeswap/wagmi'
import { getChainlinkOracleContract } from 'utils/contractHelpers'
// import { Address, useContractRead } from 'wagmi'

const getOracleAddress = (chainId: number): `0x${string}` | null => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return '0x63D407F32Aa72E63C7209ce1c2F5dA40b3AaE726' // ETH/BNB pair
    default:
      return null
  }
}

export const useOraclePrice = (chainId: number) => {
  const tokenAddress = getOracleAddress(chainId)
  const chainlinkOracleContract = tokenAddress ? getChainlinkOracleContract(tokenAddress, undefined, ChainId.BSC) : null
  const { data: price } = useReadContract({
    abi: chainlinkOracleContract?.abi,
    chainId: ChainId.BSC,
    address: tokenAddress ?? undefined,
    functionName: 'latestAnswer',
    watch: true,
  })

  return price?.toString() ?? '0'
}
