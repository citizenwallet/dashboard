export const PAYMASTER_ABI = [
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
      name: 'getHash',
      inputs: [
            {
          name: 'userOp',
          type: 'tuple',
          internalType: 'struct UserOperation',
          components: [
                    {
              name: 'sender',
              type: 'address',
              internalType: 'address'
                    },
                    {
              name: 'nonce',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'initCode',
              type: 'bytes',
              internalType: 'bytes'
                    },
                    {
              name: 'callData',
              type: 'bytes',
              internalType: 'bytes'
                    },
                    {
              name: 'callGasLimit',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'verificationGasLimit',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'preVerificationGas',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'maxFeePerGas',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'maxPriorityFeePerGas',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'paymasterAndData',
              type: 'bytes',
              internalType: 'bytes'
                    },
                    {
              name: 'signature',
              type: 'bytes',
              internalType: 'bytes'
                    }
                ]
            },
            {
          name: 'validUntil',
          type: 'uint48',
          internalType: 'uint48'
            },
            {
          name: 'validAfter',
          type: 'uint48',
          internalType: 'uint48'
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
      name: 'initialize',
      inputs: [
            {
          name: 'aSponsor',
          type: 'address',
          internalType: 'address'
            },
            {
          name: 'addresses',
          type: 'address[]',
          internalType: 'address[]'
            }
        ],
      outputs: [],
      stateMutability: 'nonpayable'
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
      name: 'postOp',
      inputs: [
            {
          name: 'mode',
          type: 'uint8',
          internalType: 'enum IPaymaster.PostOpMode'
            },
            {
          name: 'context',
          type: 'bytes',
          internalType: 'bytes'
            },
            {
          name: 'actualGasCost',
          type: 'uint256',
          internalType: 'uint256'
            }
        ],
      outputs: [],
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
      name: 'sponsor',
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
      name: 'updateSponsor',
      inputs: [
            {
          name: 'newSponsor',
          type: 'address',
          internalType: 'address'
            }
        ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'updateWhitelist',
      inputs: [
            {
          name: 'addresses',
          type: 'address[]',
          internalType: 'address[]'
            }
        ],
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
      type: 'function',
      name: 'validatePaymasterUserOp',
      inputs: [
            {
          name: 'userOp',
          type: 'tuple',
          internalType: 'struct UserOperation',
          components: [
                    {
              name: 'sender',
              type: 'address',
              internalType: 'address'
                    },
                    {
              name: 'nonce',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'initCode',
              type: 'bytes',
              internalType: 'bytes'
                    },
                    {
              name: 'callData',
              type: 'bytes',
              internalType: 'bytes'
                    },
                    {
              name: 'callGasLimit',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'verificationGasLimit',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'preVerificationGas',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'maxFeePerGas',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'maxPriorityFeePerGas',
              type: 'uint256',
              internalType: 'uint256'
                    },
                    {
              name: 'paymasterAndData',
              type: 'bytes',
              internalType: 'bytes'
                    },
                    {
              name: 'signature',
              type: 'bytes',
              internalType: 'bytes'
                    }
                ]
            },
            {
          name: 'userOpHash',
          type: 'bytes32',
          internalType: 'bytes32'
            },
            {
          name: 'maxCost',
          type: 'uint256',
          internalType: 'uint256'
            }
        ],
      outputs: [
            {
          name: 'context',
          type: 'bytes',
          internalType: 'bytes'
            },
            {
          name: 'validationData',
          type: 'uint256',
          internalType: 'uint256'
            }
        ],
      stateMutability: 'view'
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
      name: 'ECDSAInvalidSignature',
      inputs: []
    },
    {
      type: 'error',
      name: 'ECDSAInvalidSignatureLength',
      inputs: [
            {
          name: 'length',
          type: 'uint256',
          internalType: 'uint256'
            }
        ]
    },
    {
      type: 'error',
      name: 'ECDSAInvalidSignatureS',
      inputs: [
            {
          name: 's',
          type: 'bytes32',
          internalType: 'bytes32'
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