export const pancakeSwapSmartRouterABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_WETHAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pancakeswapV2",
        type: "address",
      },
      {
        internalType: "address",
        name: "_stableswapFactory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ApproveCalledOnETH",
    type: "error",
  },
  {
    inputs: [],
    name: "ETHTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ForceApproveFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "FromIsNotSender",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughValue",
    type: "error",
  },
  {
    inputs: [],
    name: "SafeTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "SafeTransferFromFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ToIsNotThis",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    name: "NewStableSwapFactory",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "srcTokenAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "dstTokenAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "srcAmount",
        type: "uint256",
      },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "srcTokenAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "dstTokenAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "srcAmount",
        type: "uint256",
      },
    ],
    name: "SwapMulti",
    type: "event",
  },
  {
    stateMutability: "nonpayable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pancakeswapV2",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_factory",
        type: "address",
      },
    ],
    name: "setStableSwapFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stableswapFactory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "srcToken",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "dstToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minReturn",
        type: "uint256",
      },
      {
        internalType: "enum PancakeSwapSmartRouter.FLAG",
        name: "flag",
        type: "uint8",
      },
    ],
    name: "swap",
    outputs: [
      {
        internalType: "uint256",
        name: "returnAmount",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minReturn",
        type: "uint256",
      },
      {
        internalType: "enum PancakeSwapSmartRouter.FLAG[]",
        name: "flags",
        type: "uint8[]",
      },
    ],
    name: "swapMulti",
    outputs: [
      {
        internalType: "uint256",
        name: "returnAmount",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
    outputs: [
      {
        internalType: "contract IWETH02",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const