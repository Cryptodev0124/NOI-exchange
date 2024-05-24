export const dcpBondABI = [
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_DCP",
		  type: "address",
		},
		{
		  internalType: "address",
		  name: "_principle",
		  type: "address",
		},
		{
		  internalType: "address",
		  name: "_treasury",
		  type: "address",
		},
		{
		  internalType: "address",
		  name: "_DAO",
		  type: "address",
		},
		{
		  internalType: "address",
		  name: "_bondCalculator",
		  type: "address",
		},
	  ],
	  stateMutability: "nonpayable",
	  type: "constructor",
	},
	{
	  anonymous: false,
	  inputs: [
		{
		  indexed: false,
		  internalType: "uint256",
		  name: "deposit",
		  type: "uint256",
		},
		{
		  indexed: true,
		  internalType: "uint256",
		  name: "payout",
		  type: "uint256",
		},
		{
		  indexed: true,
		  internalType: "uint256",
		  name: "expires",
		  type: "uint256",
		},
		{
		  indexed: true,
		  internalType: "uint256",
		  name: "priceInUSD",
		  type: "uint256",
		},
	  ],
	  name: "BondCreated",
	  type: "event",
	},
	{
	  anonymous: false,
	  inputs: [
		{
		  indexed: true,
		  internalType: "uint256",
		  name: "priceInUSD",
		  type: "uint256",
		},
		{
		  indexed: true,
		  internalType: "uint256",
		  name: "internalPrice",
		  type: "uint256",
		},
		{
		  indexed: true,
		  internalType: "uint256",
		  name: "debtRatio",
		  type: "uint256",
		},
	  ],
	  name: "BondPriceChanged",
	  type: "event",
	},
	{
	  anonymous: false,
	  inputs: [
		{
		  indexed: true,
		  internalType: "address",
		  name: "recipient",
		  type: "address",
		},
		{
		  indexed: false,
		  internalType: "uint256",
		  name: "payout",
		  type: "uint256",
		},
		{
		  indexed: false,
		  internalType: "uint256",
		  name: "remaining",
		  type: "uint256",
		},
	  ],
	  name: "BondRedeemed",
	  type: "event",
	},
	{
	  anonymous: false,
	  inputs: [
		{
		  indexed: false,
		  internalType: "uint256",
		  name: "initialBCV",
		  type: "uint256",
		},
		{
		  indexed: false,
		  internalType: "uint256",
		  name: "newBCV",
		  type: "uint256",
		},
		{
		  indexed: false,
		  internalType: "uint256",
		  name: "adjustment",
		  type: "uint256",
		},
		{
		  indexed: false,
		  internalType: "bool",
		  name: "addition",
		  type: "bool",
		},
	  ],
	  name: "ControlVariableAdjustment",
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
	  name: "OwnershipPulled",
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
	  name: "OwnershipPushed",
	  type: "event",
	},
	{
	  inputs: [],
	  name: "DAO",
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
	  name: "DCP",
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
	  name: "adjustment",
	  outputs: [
		{
		  internalType: "bool",
		  name: "add",
		  type: "bool",
		},
		{
		  internalType: "uint256",
		  name: "rate",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "target",
		  type: "uint256",
		},
		{
		  internalType: "uint32",
		  name: "buffer",
		  type: "uint32",
		},
		{
		  internalType: "uint32",
		  name: "lastTime",
		  type: "uint32",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "bondCalculator",
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
		  internalType: "address",
		  name: "",
		  type: "address",
		},
	  ],
	  name: "bondInfo",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "payout",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "pricePaid",
		  type: "uint256",
		},
		{
		  internalType: "uint32",
		  name: "lastTime",
		  type: "uint32",
		},
		{
		  internalType: "uint32",
		  name: "vesting",
		  type: "uint32",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "bondPrice",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "price_",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "bondPriceInUSD",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "price_",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "currentDebt",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "debtDecay",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "decay_",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "debtRatio",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "debtRatio_",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "_amount",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "_maxPrice",
		  type: "uint256",
		},
		{
		  internalType: "address",
		  name: "_depositor",
		  type: "address",
		},
	  ],
	  name: "deposit",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "_controlVariable",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "_minimumPrice",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "_maxPayout",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "_fee",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "_maxDebt",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "_initialDebt",
		  type: "uint256",
		},
		{
		  internalType: "uint32",
		  name: "_vestingTerm",
		  type: "uint32",
		},
	  ],
	  name: "initializeBondTerms",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "isLiquidityBond",
	  outputs: [
		{
		  internalType: "bool",
		  name: "",
		  type: "bool",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "lastDecay",
	  outputs: [
		{
		  internalType: "uint32",
		  name: "",
		  type: "uint32",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "maxPayout",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "_value",
		  type: "uint256",
		},
	  ],
	  name: "payoutFor",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_depositor",
		  type: "address",
		},
	  ],
	  name: "pendingPayoutFor",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "pendingPayout_",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_depositor",
		  type: "address",
		},
	  ],
	  name: "percentVestedFor",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "percentVested_",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "policy",
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
	  name: "principle",
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
	  name: "pullManagement",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "newOwner_",
		  type: "address",
		},
	  ],
	  name: "pushManagement",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_token",
		  type: "address",
		},
	  ],
	  name: "recoverLostToken",
	  outputs: [
		{
		  internalType: "bool",
		  name: "",
		  type: "bool",
		},
	  ],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_recipient",
		  type: "address",
		},
		{
		  internalType: "bool",
		  name: "_stake",
		  type: "bool",
		},
	  ],
	  name: "redeem",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "renounceManagement",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "bool",
		  name: "_addition",
		  type: "bool",
		},
		{
		  internalType: "uint256",
		  name: "_increment",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "_target",
		  type: "uint256",
		},
		{
		  internalType: "uint32",
		  name: "_buffer",
		  type: "uint32",
		},
	  ],
	  name: "setAdjustment",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "enum DCPBondDepository.PARAMETER",
		  name: "_parameter",
		  type: "uint8",
		},
		{
		  internalType: "uint256",
		  name: "_input",
		  type: "uint256",
		},
	  ],
	  name: "setBondTerms",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_staking",
		  type: "address",
		},
		{
		  internalType: "bool",
		  name: "_helper",
		  type: "bool",
		},
	  ],
	  name: "setStaking",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "staking",
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
	  name: "stakingHelper",
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
	  name: "standardizedDebtRatio",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "terms",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "controlVariable",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "minimumPrice",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "maxPayout",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "fee",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "maxDebt",
		  type: "uint256",
		},
		{
		  internalType: "uint32",
		  name: "vestingTerm",
		  type: "uint32",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "totalDebt",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "treasury",
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
	  name: "useHelper",
	  outputs: [
		{
		  internalType: "bool",
		  name: "",
		  type: "bool",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
  ] as const