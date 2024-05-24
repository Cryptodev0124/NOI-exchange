import { ChainId } from '@pancakeswap/sdk'
import {
  arbitrum,
  polygon,
} from 'wagmi/chains'
import { getNodeRealUrl } from 'utils/nodeReal'
import { notEmpty } from 'utils/notEmpty'

const ARBITRUM_NODES = [
  ...arbitrum.rpcUrls.default.http,
  'https://arbitrum-one.publicnode.com',
  'https://arbitrum.llamarpc.com',
].filter(notEmpty)

const POLYGON_NODES = [
  'https://f2562de09abc5efbd21eefa083ff5326.zkevm-rpc.com/',
  ...polygon.rpcUrls.default.http,
]

export const SERVER_NODES = {
  [ChainId.BSC]: [
    process.env.NEXT_PUBLIC_NODE_PRODUCTION || '',
    'https://bsc.publicnode.com',
    'https://binance.llamarpc.com',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.binance.org',
  ].filter(Boolean),
  [ChainId.ETHEREUM]: [
    getNodeRealUrl(ChainId.ETHEREUM, process.env.SERVER_NODE_REAL_API_ETH) || '',
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com',
    'https://cloudflare-eth.com',
  ],
  [ChainId.ARBITRUM]: ARBITRUM_NODES,
  [ChainId.POLYGON]: POLYGON_NODES,
  [ChainId.SHIMMER2]: ['https://json-rpc.evm.shimmer.network'],
} satisfies Record<ChainId, readonly string[]>

export const PUBLIC_NODES: Record<ChainId, string[] | readonly string[]> = {
  [ChainId.BSC]: [
    process.env.NEXT_PUBLIC_NODE_PRODUCTION || '',
    getNodeRealUrl(ChainId.BSC, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.binance.org',
  ].filter(notEmpty),
  [ChainId.ETHEREUM]: [
    getNodeRealUrl(ChainId.ETHEREUM, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
    'https://eth.llamarpc.com',
    'https://cloudflare-eth.com',
  ].filter(Boolean),
  [ChainId.ARBITRUM]: ARBITRUM_NODES,
  [ChainId.POLYGON]: POLYGON_NODES,
  [ChainId.SHIMMER2]: ['https://json-rpc.evm.shimmer.network'],
} satisfies Record<ChainId, readonly string[]>
