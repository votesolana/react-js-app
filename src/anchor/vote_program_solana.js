/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vote_program_solana.json`.
 */
export type VoteProgramSolana = {
    "address": "BG9ALv3GkR7Uu6EWDh3KZVJnw1kj6223dmpC7i41CWeA",
    "metadata": {
      "name": "voteProgramSolana",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "collectVote",
        "discriminator": [
          39,
          82,
          104,
          36,
          163,
          254,
          209,
          7
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "globalVoteAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    111,
                    116,
                    101,
                    119,
                    105,
                    102,
                    116,
                    114,
                    101,
                    109,
                    112,
                    103,
                    108,
                    111,
                    98,
                    97,
                    108
                  ]
                }
              ]
            }
          },
          {
            "name": "voteAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    111,
                    116,
                    101,
                    119,
                    105,
                    102,
                    116,
                    114,
                    101,
                    109,
                    112,
                    116,
                    111,
                    107,
                    101,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "voteInfoAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    111,
                    116,
                    101,
                    119,
                    105,
                    102,
                    116,
                    114,
                    101,
                    109,
                    112,
                    95,
                    105,
                    110,
                    102,
                    111
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "userVotewiftrempAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "mint"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "initialize",
        "discriminator": [
          175,
          175,
          109,
          31,
          13,
          152,
          155,
          237
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "treasuryAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    111,
                    116,
                    101,
                    95,
                    118,
                    97,
                    117,
                    108,
                    116,
                    116,
                    114,
                    101,
                    109,
                    112
                  ]
                }
              ]
            }
          },
          {
            "name": "globalVoteAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    111,
                    116,
                    101,
                    119,
                    105,
                    102,
                    116,
                    114,
                    101,
                    109,
                    112,
                    103,
                    108,
                    111,
                    98,
                    97,
                    108
                  ]
                }
              ]
            }
          },
          {
            "name": "mint"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "vote",
        "discriminator": [
          227,
          110,
          155,
          23,
          136,
          126,
          172,
          25
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "globalVoteAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    111,
                    116,
                    101,
                    119,
                    105,
                    102,
                    116,
                    114,
                    101,
                    109,
                    112,
                    103,
                    108,
                    111,
                    98,
                    97,
                    108
                  ]
                }
              ]
            }
          },
          {
            "name": "voteInfoAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    111,
                    116,
                    101,
                    119,
                    105,
                    102,
                    116,
                    114,
                    101,
                    109,
                    112,
                    95,
                    105,
                    110,
                    102,
                    111
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "voteAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    111,
                    116,
                    101,
                    119,
                    105,
                    102,
                    116,
                    114,
                    101,
                    109,
                    112,
                    116,
                    111,
                    107,
                    101,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "userVotewiftrempAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "const",
                  "value": [
                    6,
                    221,
                    246,
                    225,
                    215,
                    101,
                    161,
                    147,
                    217,
                    203,
                    225,
                    70,
                    206,
                    235,
                    121,
                    172,
                    28,
                    180,
                    133,
                    237,
                    95,
                    91,
                    55,
                    145,
                    58,
                    140,
                    245,
                    133,
                    126,
                    255,
                    0,
                    169
                  ]
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "treasuryAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    111,
                    116,
                    101,
                    95,
                    118,
                    97,
                    117,
                    108,
                    116,
                    116,
                    114,
                    101,
                    109,
                    112
                  ]
                }
              ]
            }
          },
          {
            "name": "mint"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "voteForTremp",
            "type": "bool"
          },
          {
            "name": "timelength",
            "type": {
              "defined": {
                "name": "timeLength"
              }
            }
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "globalVotes",
        "discriminator": [
          244,
          247,
          154,
          239,
          10,
          63,
          85,
          216
        ]
      },
      {
        "name": "voteInfo",
        "discriminator": [
          53,
          111,
          174,
          160,
          168,
          16,
          248,
          186
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "isVoted",
        "msg": "You have already voted"
      },
      {
        "code": 6001,
        "name": "notVoted",
        "msg": "You don't have a vote to claim"
      },
      {
        "code": 6002,
        "name": "timeLocked",
        "msg": "Your votes are still locked. You must wait longer"
      },
      {
        "code": 6003,
        "name": "tooLow",
        "msg": "Not enough vote token"
      },
      {
        "code": 6004,
        "name": "rewardPoolLow",
        "msg": "Not enough tokens in reward pool to place this vote"
      },
      {
        "code": 6005,
        "name": "programAlreadyInitialized",
        "msg": "This program has already been deployed"
      },
      {
        "code": 6006,
        "name": "invalidTimeLength",
        "msg": "Invalid Time Length"
      }
    ],
    "types": [
      {
        "name": "globalVotes",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "tremp",
              "type": "u32"
            },
            {
              "name": "boden",
              "type": "u32"
            }
          ]
        }
      },
      {
        "name": "timeLength",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "oneMinute"
            },
            {
              "name": "oneDay"
            },
            {
              "name": "oneMonth"
            },
            {
              "name": "electionDay"
            }
          ]
        }
      },
      {
        "name": "voteInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "voteLockedUntil",
              "type": "i64"
            },
            {
              "name": "isVoted",
              "type": "bool"
            },
            {
              "name": "wifTremp",
              "type": "bool"
            },
            {
              "name": "voteAmount",
              "type": "u32"
            }
          ]
        }
      }
    ]
  };
  