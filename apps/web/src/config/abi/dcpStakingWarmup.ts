export const dcpStakingWarmupABI = [
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_staking",
		  type: "address",
		},
		{
		  internalType: "address",
		  name: "_SDCP",
		  type: "address",
		},
	  ],
	  stateMutability: "nonpayable",
	  type: "constructor",
	},
	{
	  inputs: [],
	  name: "SDCP",
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
		  name: "_staker",
		  type: "address",
		},
		{
		  internalType: "uint256",
		  name: "_amount",
		  type: "uint256",
		},
	  ],
	  name: "retrieve",
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
  ] as const