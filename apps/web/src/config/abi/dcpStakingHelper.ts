export const dcpStakingHelperABI = [
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_staking",
		  type: "address",
		},
		{
		  internalType: "address",
		  name: "_DCP",
		  type: "address",
		},
	  ],
	  stateMutability: "nonpayable",
	  type: "constructor",
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
	  inputs: [
		{
		  internalType: "uint256",
		  name: "_amount",
		  type: "uint256",
		},
		{
		  internalType: "address",
		  name: "recipient",
		  type: "address",
		},
	  ],
	  name: "stake",
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