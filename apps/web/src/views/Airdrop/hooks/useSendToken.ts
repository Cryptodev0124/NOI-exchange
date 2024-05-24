import { useCallback } from 'react'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { multiSendToken } from 'utils/calls'
import { useMultisender } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'
// import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'

const useSendToken = () => {
  const gasPrice = useGasPrice()
  const senderContract = useMultisender()

  const handleSendToken = useCallback(
    async (token: string, addresses: string[], amounts: string[]) => {
      return multiSendToken(senderContract, token, addresses, amounts, gasPrice)
    },
    [senderContract, gasPrice],
  )

  return { onSendToken: handleSendToken }
}

export default useSendToken
