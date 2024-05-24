export const dcpBondCalculatorABI = [
	{
	  inputs: [
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
		  internalType: "address",
		  name: "_pair",
		  type: "address",
		},
	  ],
	  name: "getKValue",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "k_",
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
		  name: "_pair",
		  type: "address",
		},
	  ],
	  name: "getTotalValue",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "_value",
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
		  name: "_pair",
		  type: "address",
		},
	  ],
	  name: "markdown",
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
		  name: "_pair",
		  type: "address",
		},
		{
		  internalType: "uint256",
		  name: "amount_",
		  type: "uint256",
		},
	  ],
	  name: "valuation",
	  outputs: [
		{
		  internalType: "uint256",
		  name: "_value",
		  type: "uint256",
		},
	  ],
	  stateMutability: "view",
	  type: "function",
	},
  ] as const