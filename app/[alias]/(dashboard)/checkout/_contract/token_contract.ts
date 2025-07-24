export const TOKEN_ABI = [
  {
    type: 'function',
    name: 'DEFAULT_ADMIN_ROLE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'MINTER_ROLE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'PAUSER_ROLE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'UPGRADE_INTERFACE_VERSION',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'spender',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'burn',
    inputs: [
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'burnFrom',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getRoleAdmin',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'grantRole',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        internalType: 'bytes32'
      },
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'hasRole',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        internalType: 'bytes32'
      },
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: '_owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'minters',
        type: 'address[]',
        internalType: 'address[]'
      },
      {
        name: 'name',
        type: 'string',
        internalType: 'string'
      },
      {
        name: 'symbol',
        type: 'string',
        internalType: 'string'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'mint',
    inputs: [
      {
        name: 'to',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'renounceRole',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        internalType: 'bytes32'
      },
      {
        name: 'callerConfirmation',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'revokeRole',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        internalType: 'bytes32'
      },
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [
      {
        name: 'interfaceId',
        type: 'bytes4',
        internalType: 'bytes4'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      {
        name: 'to',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'upgradeToAndCall',
    inputs: [
      {
        name: 'newImplementation',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'spender',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Paused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RoleAdminChanged',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32'
      },
      {
        name: 'previousAdminRole',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32'
      },
      {
        name: 'newAdminRole',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RoleGranted',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32'
      },
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RoleRevoked',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32'
      },
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Unpaused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'AccessControlBadConfirmation',
    inputs: []
  },
  {
    type: 'error',
    name: 'AccessControlUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'neededRole',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ]
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC1967NonPayable',
    inputs: []
  },
  {
    type: 'error',
    name: 'ERC20InsufficientAllowance',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'allowance',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InsufficientBalance',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'balance',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InvalidApprover',
    inputs: [
      {
        name: 'approver',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InvalidReceiver',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InvalidSender',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InvalidSpender',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'EnforcedPause',
    inputs: []
  },
  {
    type: 'error',
    name: 'ExpectedPause',
    inputs: []
  },
  {
    type: 'error',
    name: 'FailedInnerCall',
    inputs: []
  },
  {
    type: 'error',
    name: 'InvalidInitialization',
    inputs: []
  },
  {
    type: 'error',
    name: 'MustHaveMinterRole',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'NotInitializing',
    inputs: []
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'UUPSUnauthorizedCallContext',
    inputs: []
  },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [
      {
        name: 'slot',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ]
  }
];

export const TOKEN_BYTECODE =
  '0x60a06040523060805234801561001457600080fd5b50608051611db461003e60003960008181610e8d01528181610eb60152610ff70152611db46000f3fe6080604052600436106101d85760003560e01c806370a0823111610102578063a9059cbb11610095578063d547741f11610064578063d547741f14610583578063dd62ed3e146105a3578063e63ab1e9146105c3578063f2fde38b146105e557600080fd5b8063a9059cbb146104f0578063ad3cb1cc14610510578063c1abece914610541578063d53913931461056157600080fd5b80638da5cb5b116100d15780638da5cb5b1461045f57806391d14854146104a657806395d89b41146104c6578063a217fddf146104db57600080fd5b806370a08231146103d2578063715018a61461041557806379cc67901461042a5780638456cb591461044a57600080fd5b8063313ce5671161017a57806342966c681161014957806342966c68146103655780634f1ef2861461038557806352d1902d146103985780635c975abb146103ad57600080fd5b8063313ce567146102f457806336568abe146103105780633f4ba83a1461033057806340c10f191461034557600080fd5b806318160ddd116101b657806318160ddd1461025457806323b872dd14610292578063248a9ca3146102b25780632f2ff15d146102d257600080fd5b806301ffc9a7146101dd57806306fdde0314610212578063095ea7b314610234575b600080fd5b3480156101e957600080fd5b506101fd6101f8366004611735565b610605565b60405190151581526020015b60405180910390f35b34801561021e57600080fd5b5061022761063c565b6040516102099190611783565b34801561024057600080fd5b506101fd61024f3660046117d2565b6106ff565b34801561026057600080fd5b507f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace02545b604051908152602001610209565b34801561029e57600080fd5b506101fd6102ad3660046117fc565b610717565b3480156102be57600080fd5b506102846102cd366004611838565b61073d565b3480156102de57600080fd5b506102f26102ed366004611851565b61075f565b005b34801561030057600080fd5b5060405160068152602001610209565b34801561031c57600080fd5b506102f261032b366004611851565b610781565b34801561033c57600080fd5b506102f26107b9565b34801561035157600080fd5b506102f26103603660046117d2565b6107dc565b34801561037157600080fd5b506102f2610380366004611838565b610826565b6102f261039336600461191c565b610830565b3480156103a457600080fd5b5061028461084b565b3480156103b957600080fd5b50600080516020611d5f8339815191525460ff166101fd565b3480156103de57600080fd5b506102846103ed36600461197e565b6001600160a01b03166000908152600080516020611cbf833981519152602052604090205490565b34801561042157600080fd5b506102f2610868565b34801561043657600080fd5b506102f26104453660046117d2565b61087c565b34801561045657600080fd5b506102f26108bd565b34801561046b57600080fd5b507f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546040516001600160a01b039091168152602001610209565b3480156104b257600080fd5b506101fd6104c1366004611851565b6108dd565b3480156104d257600080fd5b50610227610915565b3480156104e757600080fd5b50610284600081565b3480156104fc57600080fd5b506101fd61050b3660046117d2565b610954565b34801561051c57600080fd5b50610227604051806040016040528060058152602001640352e302e360dc1b81525081565b34801561054d57600080fd5b506102f261055c3660046119b9565b610962565b34801561056d57600080fd5b50610284600080516020611d1f83398151915281565b34801561058f57600080fd5b506102f261059e366004611851565b610b1e565b3480156105af57600080fd5b506102846105be366004611abf565b610b3a565b3480156105cf57600080fd5b50610284600080516020611cff83398151915281565b3480156105f157600080fd5b506102f261060036600461197e565b610b84565b60006001600160e01b03198216637965db0b60e01b148061063657506301ffc9a760e01b6001600160e01b03198316145b92915050565b7f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace038054606091600080516020611cbf8339815191529161067b90611ae9565b80601f01602080910402602001604051908101604052809291908181526020018280546106a790611ae9565b80156106f45780601f106106c9576101008083540402835291602001916106f4565b820191906000526020600020905b8154815290600101906020018083116106d757829003601f168201915b505050505091505090565b60003361070d818585610bbf565b5060019392505050565b600033610725858285610bcc565b610730858585610c2c565b60019150505b9392505050565b6000908152600080516020611d3f833981519152602052604090206001015490565b6107688261073d565b61077181610c8b565b61077b8383610c95565b50505050565b6001600160a01b03811633146107aa5760405163334bd91960e11b815260040160405180910390fd5b6107b48282610d3a565b505050565b600080516020611cff8339815191526107d181610c8b565b6107d9610db6565b50565b6107f4600080516020611d1f833981519152336108dd565b61081857604051636690b7c160e01b81523360048201526024015b60405180910390fd5b6108228282610e16565b5050565b6107d93382610e4c565b610838610e82565b61084182610f27565b6108228282610f2f565b6000610855610fec565b50600080516020611cdf83398151915290565b610870611035565b61087a6000611090565b565b610894600080516020611d1f833981519152336108dd565b6108b357604051636690b7c160e01b815233600482015260240161080f565b6108228282610e4c565b600080516020611cff8339815191526108d581610c8b565b6107d9611101565b6000918252600080516020611d3f833981519152602090815260408084206001600160a01b0393909316845291905290205460ff1690565b7f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace048054606091600080516020611cbf8339815191529161067b90611ae9565b60003361070d818585610c2c565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff16159067ffffffffffffffff166000811580156109a85750825b905060008267ffffffffffffffff1660011480156109c55750303b155b9050811580156109d3575080155b156109f15760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610a1b57845460ff60401b1916600160401b1785555b610a25878761114a565b610a2e8961115c565b610a3661116d565b610a3e61116d565b610a4960008a610c95565b50610a63600080516020611d1f8339815191526000611175565b610a7c600080516020611cff8339815191526000611175565b60005b8851811015610acc57610ab9600080516020611d1f8339815191528a8381518110610aac57610aac611b23565b6020026020010151610c95565b5080610ac481611b4f565b915050610a7f565b508315610b1357845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050565b610b278261073d565b610b3081610c8b565b61077b8383610d3a565b6001600160a01b0391821660009081527f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace016020908152604080832093909416825291909152205490565b610b8c611035565b6001600160a01b038116610bb657604051631e4fbdf760e01b81526000600482015260240161080f565b6107d981611090565b6107b483838360016111d8565b6000610bd88484610b3a565b9050600019811461077b5781811015610c1d57604051637dc7a0d960e11b81526001600160a01b0384166004820152602481018290526044810183905260640161080f565b61077b848484840360006111d8565b6001600160a01b038316610c5657604051634b637e8f60e11b81526000600482015260240161080f565b6001600160a01b038216610c805760405163ec442f0560e01b81526000600482015260240161080f565b6107b48383836112c0565b6107d981336112d3565b6000600080516020611d3f833981519152610cb084846108dd565b610d30576000848152602082815260408083206001600160a01b03871684529091529020805460ff19166001179055610ce63390565b6001600160a01b0316836001600160a01b0316857f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a46001915050610636565b6000915050610636565b6000600080516020611d3f833981519152610d5584846108dd565b15610d30576000848152602082815260408083206001600160a01b0387168085529252808320805460ff1916905551339287917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a46001915050610636565b610dbe61130c565b600080516020611d5f833981519152805460ff191681557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a150565b6001600160a01b038216610e405760405163ec442f0560e01b81526000600482015260240161080f565b610822600083836112c0565b6001600160a01b038216610e7657604051634b637e8f60e11b81526000600482015260240161080f565b610822826000836112c0565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480610f0957507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610efd600080516020611cdf833981519152546001600160a01b031690565b6001600160a01b031614155b1561087a5760405163703e46dd60e11b815260040160405180910390fd5b6107d9611035565b816001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610f89575060408051601f3d908101601f19168201909252610f8691810190611b68565b60015b610fb157604051634c9c8ce360e01b81526001600160a01b038316600482015260240161080f565b600080516020611cdf8339815191528114610fe257604051632a87526960e21b81526004810182905260240161080f565b6107b4838361133c565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461087a5760405163703e46dd60e11b815260040160405180910390fd5b336110677f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b03161461087a5760405163118cdaa760e01b815233600482015260240161080f565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b611109611392565b600080516020611d5f833981519152805460ff191660011781557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25833610df8565b6111526113c3565b610822828261140c565b6111646113c3565b6107d98161145d565b61087a6113c3565b600080516020611d3f833981519152600061118f8461073d565b600085815260208490526040808220600101869055519192508491839187917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a450505050565b600080516020611cbf8339815191526001600160a01b0385166112115760405163e602df0560e01b81526000600482015260240161080f565b6001600160a01b03841661123b57604051634a1406b160e11b81526000600482015260240161080f565b6001600160a01b038086166000908152600183016020908152604080832093881683529290522083905581156112b957836001600160a01b0316856001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925856040516112b091815260200190565b60405180910390a35b5050505050565b6112c8611392565b6107b4838383611465565b6112dd82826108dd565b6108225760405163e2517d3f60e01b81526001600160a01b03821660048201526024810183905260440161080f565b600080516020611d5f8339815191525460ff1661087a57604051638dfc202b60e01b815260040160405180910390fd5b61134582611478565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a280511561138a576107b482826114dd565b610822611553565b600080516020611d5f8339815191525460ff161561087a5760405163d93c066560e01b815260040160405180910390fd5b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff1661087a57604051631afcd79f60e31b815260040160405180910390fd5b6114146113c3565b600080516020611cbf8339815191527f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace0361144e8482611bcf565b506004810161077b8382611bcf565b610b8c6113c3565b61146d611392565b6107b4838383611572565b806001600160a01b03163b6000036114ae57604051634c9c8ce360e01b81526001600160a01b038216600482015260240161080f565b600080516020611cdf83398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6060600080846001600160a01b0316846040516114fa9190611c8f565b600060405180830381855af49150503d8060008114611535576040519150601f19603f3d011682016040523d82523d6000602084013e61153a565b606091505b509150915061154a8583836116b0565b95945050505050565b341561087a5760405163b398979f60e01b815260040160405180910390fd5b600080516020611cbf8339815191526001600160a01b0384166115ae57818160020160008282546115a39190611cab565b909155506116209050565b6001600160a01b038416600090815260208290526040902054828110156116015760405163391434e360e21b81526001600160a01b0386166004820152602481018290526044810184905260640161080f565b6001600160a01b03851660009081526020839052604090209083900390555b6001600160a01b03831661163e57600281018054839003905561165d565b6001600160a01b03831660009081526020829052604090208054830190555b826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516116a291815260200190565b60405180910390a350505050565b6060826116c5576116c08261170c565b610736565b81511580156116dc57506001600160a01b0384163b155b1561170557604051639996b31560e01b81526001600160a01b038516600482015260240161080f565b5080610736565b80511561171c5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b60006020828403121561174757600080fd5b81356001600160e01b03198116811461073657600080fd5b60005b8381101561177a578181015183820152602001611762565b50506000910152565b60208152600082518060208401526117a281604085016020870161175f565b601f01601f19169190910160400192915050565b80356001600160a01b03811681146117cd57600080fd5b919050565b600080604083850312156117e557600080fd5b6117ee836117b6565b946020939093013593505050565b60008060006060848603121561181157600080fd5b61181a846117b6565b9250611828602085016117b6565b9150604084013590509250925092565b60006020828403121561184a57600080fd5b5035919050565b6000806040838503121561186457600080fd5b82359150611874602084016117b6565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156118bc576118bc61187d565b604052919050565b600067ffffffffffffffff8311156118de576118de61187d565b6118f1601f8401601f1916602001611893565b905082815283838301111561190557600080fd5b828260208301376000602084830101529392505050565b6000806040838503121561192f57600080fd5b611938836117b6565b9150602083013567ffffffffffffffff81111561195457600080fd5b8301601f8101851361196557600080fd5b611974858235602084016118c4565b9150509250929050565b60006020828403121561199057600080fd5b610736826117b6565b600082601f8301126119aa57600080fd5b610736838335602085016118c4565b600080600080608085870312156119cf57600080fd5b6119d8856117b6565b935060208086013567ffffffffffffffff808211156119f657600080fd5b818801915088601f830112611a0a57600080fd5b813581811115611a1c57611a1c61187d565b8060051b611a2b858201611893565b918252838101850191858101908c841115611a4557600080fd5b948601945b83861015611a6a57611a5b866117b6565b82529486019490860190611a4a565b98505050506040880135925080831115611a8357600080fd5b611a8f89848a01611999565b94506060880135925080831115611aa557600080fd5b5050611ab387828801611999565b91505092959194509250565b60008060408385031215611ad257600080fd5b611adb836117b6565b9150611874602084016117b6565b600181811c90821680611afd57607f821691505b602082108103611b1d57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060018201611b6157611b61611b39565b5060010190565b600060208284031215611b7a57600080fd5b5051919050565b601f8211156107b457600081815260208120601f850160051c81016020861015611ba85750805b601f850160051c820191505b81811015611bc757828155600101611bb4565b505050505050565b815167ffffffffffffffff811115611be957611be961187d565b611bfd81611bf78454611ae9565b84611b81565b602080601f831160018114611c325760008415611c1a5750858301515b600019600386901b1c1916600185901b178555611bc7565b600085815260208120601f198616915b82811015611c6157888601518255948401946001909101908401611c42565b5085821015611c7f5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60008251611ca181846020870161175f565b9190910192915050565b8082018082111561063657610636611b3956fe52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a602dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b626800cd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300a26469706673582212208eafdded02d0ded1b81e9117ce8d3c308edf5880a224d8acd82bd3fe0174eb3b64736f6c63430008140033';
