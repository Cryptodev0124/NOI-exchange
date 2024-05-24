import { ChainId } from '@pancakeswap/sdk'
import memoize from 'lodash/memoize'
import {
  bsc as bsc_,
  mainnet,
  polygon,
  arbitrum,
  Chain,
} from 'wagmi/chains'

export const CHAIN_QUERY_NAME = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.BSC]: 'bsc',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.SHIMMER2]: 'shimmerevm',
} satisfies Record<ChainId, string>

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

const bsc = {
  ...bsc_,
  rpcUrls: {
    ...bsc_.rpcUrls,
    public: {
      ...bsc_.rpcUrls,
      http: ['https://bsc-dataseed.binance.org/'],
    },
    default: {
      ...bsc_.rpcUrls.default,
      http: ['https://bsc-dataseed.binance.org/'],
    },
  },
} satisfies Chain

const shimmer2 : Chain = {
  id: 148,
  name: "Shimmer EVM",
  nativeCurrency: {
    decimals: 18,
    name: "SMR",
    symbol: "SMR"
  },
  rpcUrls: {
    default: { http: ["https://json-rpc.evm.shimmer.network"] },
    public: { http: ["https://json-rpc.evm.shimmer.network"] },
  },
  blockExplorers: {
    etherscan: { name: "Shimmer EVM Explorer", url: "https://explorer.evm.shimmer.network" },
    default: { name: "Shimmer EVM Explorer", url: "https://explorer.evm.shimmer.network" }
  },
  contracts: {
    multicall3: {
      address: "0x51fa237AA807f8AB568314a4D8EeD49BaA985A1c",
      blockCreated: 785264
    }
  }
};

const ethereum : Chain = {
  id: 1,
  name: "Ethereum",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: {
    default: { http: ["https://endpoints.omniatech.io/v1/eth/mainnet/public"] },
    public: { http: ["https://endpoints.omniatech.io/v1/eth/mainnet/public"] },
  },
  blockExplorers: {
    etherscan: { name: "Ethereum Mainnet Explorer", url: "https://etherscan.io/" },
    default: { name: "Ethereum Mainnet Explorer", url: "https://etherscan.io/" }
  },
};

export const CHAINS: [Chain, ...Chain[]] = [
  ethereum
]