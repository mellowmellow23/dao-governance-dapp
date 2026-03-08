export const FACTORY_ADDRESS =
  "0xa490fC0485813Ed87d18d37cC280d5a49Be5D7Ae" as `0x${string}`;

export const FACTORY_ABI = [
  {
    type: "event",
    name: "ElectionCreated",
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "election", type: "address" },
      { indexed: true, name: "electionId", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "createElection",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [{ name: "election", type: "address" }],
  },
  {
    type: "function",
    name: "createElectionWithConfig",
    stateMutability: "nonpayable",
    inputs: [
      { name: "proposalNames", type: "string[]" },
      { name: "voters", type: "address[]" },
      { name: "startTime", type: "uint64" },
      { name: "endTime", type: "uint64" },
    ],
    outputs: [{ name: "election", type: "address" }],
  },
  {
    type: "function",
    name: "electionCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "electionById",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "electionsOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "address[]" }],
  },
] as const;

export const VOTING_ABI = [
  {
    type: "function",
    name: "proposalCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getProposal",
    stateMutability: "view",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "voteCount", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "winner",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "winningId", type: "uint256" },
      { name: "winningVotes", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "vote",
    stateMutability: "nonpayable",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "status",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "startTime",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint64" }],
  },
  {
    type: "function",
    name: "endTime",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint64" }],
  },
  {
    type: "function",
    name: "allowedVoter",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "hasVoted",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "votedFor",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;