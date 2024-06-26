import { ChainId } from '@pancakeswap/sdk'

export default {
  masterChef: {
    [ChainId.BSC]: '0x0Ac09AbdC688fd67863bf0f62DD0e243dbdf6894',
    [ChainId.ARBITRUM]: '0x0Ac09AbdC688fd67863bf0f62DD0e243dbdf6894',
    [ChainId.POLYGON]: '0x0Ac09AbdC688fd67863bf0f62DD0e243dbdf6894',
    [ChainId.SHIMMER2]: '0x43bF3ff3f6374aDaA914e9657959FAcb4D6d110c',
  },
  multiCall: {
    [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BSC]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.ARBITRUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.POLYGON]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.SHIMMER2]: '0x272219571f9E6104960BE987f2462804fBD12551',
  },
  // TODO: multi
  zap: {
    56: '0xD4c4a7C55c9f7B3c48bafb6E8643Ba79F42418dF',
    97: '0xD85835207054F25620109bdc745EC1D1f84F04e1',
  },
  bridge: {
    137: '0x7a6c09B4852a7FbD96CA7282B793184f2BCbB1D7',
    13600: '0x69760b95C16d690b07234C2e3493e4b8167724E1',
  },
  dcpBondCalculator: {
    42161: '0x9e9533131b1387b4Ae5fAB3e0849368ef6230896'
  },
  dcpTreasury: {
    42161: '0xa3d14CC225E19b6ee2929B721CF161990F2F5870'
  },
  dcpStaking: {
    42161: '0xA6C43695ac26783E118249FE07AAAc7bF83aa93E'
  },
  dcpWarmup: {
    42161: '0x80EBDc636447a15b670b2c2244a327Ab4C0F764B'
  },
  dcpDistributor: {
    42161: '0x137eD2d05B70Ddccf57de257216c4d5E86EcbE32'
  },
  dcpStakingHelper: {
    42161: '0xeD48D415A46364657f3F3EC8e7a9f4c3D93E7AAC'
  },
  multisender: {
    42161: '0xec8F5c9f9Fb85622B8b83af4178979F11b16170e',
    137: '0xec8F5c9f9Fb85622B8b83af4178979F11b16170e',
    56: '0xec8F5c9f9Fb85622B8b83af4178979F11b16170e',
    148: '0xdA3e843092C3E2b99e2a70b13C686C2F70d6edFe',
  },
  locker: {
    42161: '0x83696B8968a9D0F075Ac23ca37aF76442B66A30e',
    56: '0xBAE87a72370f36b35BfEE0c96BfDa8FE446B5C5d',
    137: '0xB4c6BE5E917dd7B6486Dd817da2b4637c026D916',
    148: '0x1813829b8BbCE845AB5D6E654Db713454e9d1E8A',
  },
  launchpadFactory: {
    42161: '0xBAE87a72370f36b35BfEE0c96BfDa8FE446B5C5d',
    56: '0x47b4047608E7B2d43f84384c1e0Bdbc2e2D88D4b',
    137: '0xBE449911444907b3a2E7348111E2EC42103A8137',
    148: '0xb98d3Fc56F8A18C62b414216F7553daa2fEdA848'
  }
} as const satisfies Record<string, Record<number, `0x${string}`>>
