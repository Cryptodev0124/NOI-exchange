import BigNumber from 'bignumber.js'

import { IfoStatus, PoolIds } from 'config/constants/types'
import { useIfoV2Contract } from 'hooks/useContract'

// PoolCharacteristics retrieved from the contract
export interface PoolCharacteristics {
  raisingAmountPool: BigNumber
  offeringAmountPool: BigNumber
  limitPerUserInLP: BigNumber
  taxRate: number
  totalAmountPool: BigNumber
  sumTaxesOverflow: BigNumber

  // extends
  pointThreshold?: number
  distributionRatio?: number
  admissionProfile?: string
  needQualifiedNFT?: boolean
  needQualifiedPoints?: boolean
  vestingInformation?: VestingInformation
}

// IFO data unrelated to the user returned by useGetPublicIfoData
export interface PublicIfoData {
  isInitialized: boolean
  status: IfoStatus
  blocksRemaining: number
  secondsUntilStart: number
  progress: number
  secondsUntilEnd: number
  startBlockNum: number
  endBlockNum: number
  currencyPriceInUSD: BigNumber
  numberPoints: number
  thresholdPoints: bigint
  plannedStartTime?: number
  vestingStartTime?: number

  fetchIfoData: (currentBlock: number) => Promise<void>
  [PoolIds.poolBasic]?: PoolCharacteristics
  [PoolIds.poolUnlimited]: PoolCharacteristics
}

export interface VestingInformation {
  percentage: number
  cliff: number
  duration: number
  slicePeriodSeconds: number
}

// User specific pool characteristics
export interface UserPoolCharacteristics {
  amountTokenCommittedInLP: BigNumber // @contract: amountPool
  offeringAmountInToken: BigNumber // @contract: userOfferingAmountPool
  refundingAmountInLP: BigNumber // @contract: userRefundingAmountPool
  taxAmountInLP: BigNumber // @contract: userTaxAmountPool
  hasClaimed: boolean // @contract: claimedPool
  isPendingTx: boolean
  vestingReleased?: BigNumber
  vestingAmountTotal?: BigNumber
  isVestingInitialized?: boolean
  vestingId?: string
  vestingComputeReleasableAmount?: BigNumber
}

// Use only inside the useGetWalletIfoData hook
export interface WalletIfoState {
  isInitialized: boolean
  [PoolIds.poolBasic]: UserPoolCharacteristics
  [PoolIds.poolUnlimited]: UserPoolCharacteristics
  ifoCredit?: {
    credit: BigNumber
    /**
     * credit left is the ifo credit minus the amount of `amountTokenCommittedInLP` in unlimited pool
     * minimum is 0
     */
    creditLeft: BigNumber
  }
}

// Returned by useGetWalletIfoData
export type WalletIfoData = {
  allowance: BigNumber
  setPendingTx: (status: boolean, poolId: PoolIds) => void
  setIsClaimed: (poolId: PoolIds) => void
  fetchIfoData: () => Promise<void>
  resetIfoData: () => void
} & WalletIfoState & WalletIfoDataV2

type WalletIfoDataV2 = {
  version: 2
  contract: ReturnType<typeof useIfoV2Contract>
}