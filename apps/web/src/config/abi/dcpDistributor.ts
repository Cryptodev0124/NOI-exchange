export const dcpDistributorABI = [
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "_treasury",
		  type: "address",
		},
		{
		  internalType: "address",
		  name: "_DCP",
		  type: "address",
		},
		{
		  internalType: "uint32",
		  name: "_epochLength",
		  type: "uint32",
		},
		{
		  internalType: "uint32",
		  name: "_nextEpochTime",
		  type: "uint32",
		},
	  ],
	  stateMutability: "nonpayable",
	  type: "constructor",
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
		  internalType: "address",
		  name: "_recipient",
		  type: "address",
		},
		{
		  internalType: "uint256",
		  name: "_rewardRate",
		  type: "uint256",
		},
	  ],
	  name: "addRecipient",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  name: "adjustments",
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
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "distribute",
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
	  inputs: [],
	  name: "epochLength",
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
	  inputs: [
		{
		  internalType: "uint256",
		  name: "",
		  type: "uint256",
		},
	  ],
	  name: "info",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "rate",
		  type: "uint256",
		},
		{
		  internalType: "address",
		  name: "recipient",
		  type: "address",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "nextEpochTime",
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
	  inputs: [
		{
		  internalType: "uint256",
		  name: "_rate",
		  type: "uint256",
		},
	  ],
	  name: "nextRewardAt",
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
		  name: "_recipient",
		  type: "address",
		},
	  ],
	  name: "nextRewardFor",
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
	  name: "pullPolicy",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "address",
		  name: "newPolicy_",
		  type: "address",
		},
	  ],
	  name: "pushPolicy",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "_index",
		  type: "uint256",
		},
		{
		  internalType: "address",
		  name: "_recipient",
		  type: "address",
		},
	  ],
	  name: "removeRecipient",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [],
	  name: "renouncePolicy",
	  outputs: [],
	  stateMutability: "nonpayable",
	  type: "function",
	},
	{
	  inputs: [
		{
		  internalType: "uint256",
		  name: "_index",
		  type: "uint256",
		},
		{
		  internalType: "bool",
		  name: "_add",
		  type: "bool",
		},
		{
		  internalType: "uint256",
		  name: "_rate",
		  type: "uint256",
		},
		{
		  internalType: "uint256",
		  name: "_target",
		  type: "uint256",
		},
	  ],
	  name: "setAdjustment",
	  outputs: [],
	  stateMutability: "nonpayable",
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
  ] as const