const BOARDSIZE = 8;
const INFINITE = BOARDSIZE * BOARDSIZE
const friendlyFire = false;
const UNLOCK_MOVEMENT = false;
const INVERTED_LOGIC = false;
const LOOTBOX_CAPTURING_PIECE_WEIGHT = 5
const DEBUG_MODE = true;
const FORCE_PLAYER_TURNS = true;
const STARTING_PLAYER = 'white';
const LOOTBOX_RARITY_MODIFIER = 10;
let AMOUNT_OF_TWISTS = 3;
let AUTO_BUY_BOXES = null;
const EXPERIENCE_POINTS = {
    "merging": 100,
    "capturing": 45,
    "carrying": 15,
    "discovering": 400,
    "moving": 1,
    "converting": 125,
    "winning": 375,
    "lootbox_opening": 0,
    "orb_capture": 1000
}
const ON_CAPTURE_GAIN_MATERIALS = {
    "gold": {
        "chance": 0,
        "amount": 1
    }
}

const STARTING_INVENTORY = {
    "gold": 0,
}
let FREE_LOOTBOX_CHANCE = 0;

const RANDOM_SPAWNING_PIECES = ['lootbox', 'experience_orb'];

let EXPERIENCE_POINTS_MODIFIER = 1;

let CREDIT_PURCHASE_BONUS_MULTIPLIER = 1;

const WIN_CONDITIONS = {
    slainTroops: {
        'king': 1,
        // 'pawn': 8 // funy
    }
}

const defaultSettings = {
    boardOrientation: "5",
    aiOpponent: "1",
    allowLootboxSummoning: "1",
    checkmateDetection: "2",
    twistSelector: "1"
};

const pieces = {
    'rook': {
        lootbox: {
            weight: 10,
        },
        patterns: {
            movement: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
            ],
            capture: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/dzq4vtf.png">',
            black: '<img src="https://i.imgur.com/iQBNl18.png">',
            // white: '♖',
            // black: '♜',
        },
        mergability: {
            'rook': 'reversed-rook',
        }

    },
    'knight': {
        lootbox: {
            weight: 20,
        },
        patterns: {
            movement: [{
                area: [
                    [null, 1, null, 1, null],
                    [1, null, null, null, 1],
                    [null, null, 0, null, null],
                    [1, null, null, null, 1],
                    [null, 1, null, 1, null],
                ]
            }],
            capture: [{
                area: [
                    [null, 1, null, 1, null],
                    [1, null, null, null, 1],
                    [null, null, 0, null, null],
                    [1, null, null, null, 1],
                    [null, 1, null, 1, null],
                ],

            },
                // { everywhere: true, exclude: true }, // funny
                // { everywhere: true, type: ['pawn'] },
            ],
        },
        display: {
            // white: '♘',
            // black: '♞',
            white: '<img src="https://i.imgur.com/SXaYjIk.png">',
            black: '<img src="https://i.imgur.com/iXtJNpw.png">',
        },
        description: "<p>Jumps over pieces.</p>",
        mergability: {
            'knight': 'winged-knight',
        }

    },
    'bishop': {
        lootbox: {
            weight: 20,
        },
        patterns: {
            movement: [
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
            capture: [
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
        },
        display: {
            // white: '♗',
            // black: '♝',
            white: '<img src="https://i.imgur.com/vIA5kSR.png">',
            black: '<img src="https://i.imgur.com/yhW9ulD.png">'
        },
        mergability: {
            'bishop': 'double-bishop',
        }
    },
    'queen': {
        lootbox: {
            weight: 5,
        },
        patterns: {
            movement: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
            capture: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
        },
        display: {
            // white: '♕',
            // black: '♛',
            white: '<img src="https://i.imgur.com/PAPV0hG.png">',
            black: '<img src="https://i.imgur.com/j6QeiaI.png">'
        },
        mergability: {
            'queen': 'royal-queen',
        }
    },
    'king': {
        lootbox: {
            weight: 0,
        },
        patterns: {
            movement: [
                { direction: 'vertical', distance: 1, jump: false },
                { direction: 'horizontal', distance: 1, jump: false },
                { direction: 'diagonal/', distance: 1, jump: false },
                { direction: 'diagonal\\', distance: 1, jump: false },
            ],
            capture: [
                { direction: 'vertical', distance: 1, jump: false },
                { direction: 'horizontal', distance: 1, jump: false },
                { direction: 'diagonal/', distance: 1, jump: false },
                { direction: 'diagonal\\', distance: 1, jump: false }
            ],
        },
        display: {
            // white: '♔',
            // black: '♚',
            white: '<img src="https://i.imgur.com/wfis9bD.png">',
            black: '<img src="https://i.imgur.com/YAdx7Sr.png">'
        },
        description: "<p>Once captured, you lose.</p><p><a href=\"https://en.wikipedia.org/wiki/Castling\" target=\"_blank\">Castling</a> is not a thing.</p>"
    },
    'pawn': {
        lootbox: {
            weight: 2.5,
        },
        patterns: {
            movement: [
                { direction: 'vertical', distance: 2, jump: false },
                {
                    area: [
                        [null, 1, null],
                        [null, null, null],
                        [null, 0, null],
                        [null, 1, null],
                        [null, 1, null],
                    ],
                    unmoved: [
                        [null, 0, null],
                        [null, 1, null],
                        [null, 1, null],
                    ],
                    exclude: true,
                    flipForBlack: true,
                }
            ],
            capture: [
                {
                    area: [
                        [1, null, 1],
                        [null, 0, null],
                        [null, null, null],
                    ],
                    flipForBlack: true,
                }
            ],
        },
        killSpree: {

        },
        display: {
            // white: '♙',
            // black: '♟',
            white: '<img src="https://i.imgur.com/wJM6aPc.png">',
            black: '<img src="https://i.imgur.com/1TN3hWU.png">',
        },
        itemGain: {
            onKill: {
                'gold': {
                    chance: 0,
                    amount: 0
                }
            },
            onDeath: {

            }
        },
        description: "<p>First move can move 2 spaces forward instead of 1<br>Attacks diagonally forward.<br>Transforms into a queen once you reach the opposite side of the board.<br>Black moves in the opposite direction.</p><p><a href=\"https://en.wikipedia.org/wiki/En_passant\" target=\"_blank\">En passant</a> is not a thing.</p>",
        convertion: {
            rows: [0],
            collumns: [0, 1, 2, 3, 4, 5, 6, 7],
            convertsTo: 'queen',
        },
        mergability: {
            'pawn': 'pawned',
        },
        captureFlee: {
            percentageChance: 0
        }
    },
    'lootbox': {
        lootbox: {
            weight: 1,
        },
        neutralObject: true,
        needsDiscovery: true,
        description: "<p>Once captured, you will get a random piece.<br>Spawns randomly and can be bought.</p>",
        display: {
            neutral: `<div class="container">
  <div class="box">
  <div class="upper"></div>
  <div class="lower"></div>
  <div class="latch"></div>
  </div>
</div>`,
        },
        spawnChance: 5,
    },
    'reversed-rook': {
        lootbox: {
            weight: 1,
        },
        patterns: {
            movement: [
                { direction: 'vertical', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'horizontal', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'vertical', distance: INFINITE, jump: false, exclude: true },
                { direction: 'horizontal', distance: INFINITE, jump: false, exclude: true },

            ],
            capture: [
                { direction: 'vertical', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'horizontal', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'vertical', distance: INFINITE, jump: false, exclude: true },
                { direction: 'horizontal', distance: INFINITE, jump: false, exclude: true },
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/KiRlbQJ.png">',
            black: '<img src="https://i.imgur.com/9sCgUI8.png">',
        },
        needsDiscovery: true,
        description: "<p>Unlocked by merging 2 rooks.<br>It can carry other pieces.</p>",
        carrying: true,

    },
    'winged-knight': {
        lootbox: {
            weight: 2,
        },
        patterns: {
            movement: [{
                area: [
                    [null, null, 1, null, null, null, 1, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [1, null, null, 1, null, 1, null, null, 1],
                    [null, null, 1, null, null, null, 1, null, null,],
                    [null, null, null, null, 0, null, null, null, null,],
                    [null, null, 1, null, null, null, 1, null, null,],
                    [1, null, null, 1, null, 1, null, null, 1],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, 1, null, null, null, 1, null, null,],
                ]
            }],
            capture: [{
                area: [
                    [null, null, 1, null, null, null, 1, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [1, null, null, 1, null, 1, null, null, 1],
                    [null, null, 1, null, null, null, 1, null, null,],
                    [null, null, null, null, 0, null, null, null, null,],
                    [null, null, 1, null, null, null, 1, null, null,],
                    [1, null, null, 1, null, 1, null, null, 1],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, 1, null, null, null, 1, null, null,],
                ]

            },
                // { everywhere: true, exclude: true }, // funny
                // { everywhere: true, type: ['pawn'] },
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/O2bofNX.png">',
            black: '<img src="https://i.imgur.com/srBBfh4.png">',
        },
        description: "<p>Unlocked by merging 2 Knights and can do 2 jumps in a row.</p>",
        needsDiscovery: true,

    },
    'double-bishop': {
        lootbox: {
            weight: 2,
        },
        patterns: {
            movement: [
                { direction: 'diagonal/', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'diagonal\\', distance: INFINITE, jump: false, extraThickLine: 1 },
            ],
            capture: [
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/Nr8OCKj.png">',
            black: '<img src="https://i.imgur.com/9miqt0h.png">'
        },
        description: "<p>Unlocked by merging 2 Bishops. Moves like 3 Bishops next to each other, Attacks like a normal bishop.</p>",
        needsDiscovery: true,
    },
    'royal-queen': {
        lootbox: {
            weight: 0.5,
        },
        patterns: {
            movement: [
                { direction: 'vertical', distance: INFINITE, jump: true },
                { direction: 'horizontal', distance: INFINITE, jump: true },
                { direction: 'diagonal/', distance: INFINITE, jump: true },
                { direction: 'diagonal\\', distance: INFINITE, jump: true },
            ],
            capture: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/NR7aMX1.png">',
            black: '<img src="https://i.imgur.com/tli76ZK.png">'
        },
        needsDiscovery: true,
        description: "<p>Unlocked by merging 2 Queens. Attacks like a normal queen, but whilst moving to an empty piece it can jump over pieces.</p>",
    },
    'pawned': {
        lootbox: {
            weight: 0.25,
        },
        carrying: true,
        patterns: {
            movement: [
                { direction: 'vertical', distance: 2, jump: false },
                {
                    area: [
                        [null, 1, null],
                        [null, null, null],
                        [null, 0, null],
                        [null, null, null],
                        [null, 1, null],
                    ],
                    unmoved: [
                        [null, 0, null],
                    ],
                    exclude: true,
                }
            ],
            capture: [
                {
                    area: [
                        [1, null, 1],
                        [null, 0, null],
                        [1, null, 1],
                    ],
                }
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/kCamJU1.png">',
            black: '<img src="https://i.imgur.com/YBxZXmv.png">',
        },
        needsDiscovery: true,
        description: "<p>First move can move 2 spaces instead of 1<br>Attacks diagonally.<br>It can carry other pieces.<br>Transforms into something once you reach the opposite side of the board.</p>",
        convertion: {
            rows: [0],
            collumns: [0, 1, 2, 3, 4, 5, 6, 7],
            convertsTo: 'queened',
        },
        captureFlee: {
            percentageChance: 0
        },
        summonOnBeingMerged: {
            'type': 'brick',
            'chance': 0,
        }
    },
    'queened': {
        lootbox: {
            weight: 0.05,
        },
        carrying: true,
        patterns: {
            movement: [
                { everywhere: true, exclude: false },
                { direction: 'vertical', distance: INFINITE, jump: false, exclude: true },
                { direction: 'horizontal', distance: INFINITE, jump: false, exclude: true },
                { direction: 'diagonal/', distance: INFINITE, jump: false, exclude: true },
                { direction: 'diagonal\\', distance: INFINITE, jump: false, exclude: true },
            ],
            capture: [{
                area: [
                    [null, 1, null, 1, null],
                    [1, null, null, null, 1],
                    [null, null, 0, null, null],
                    [1, null, null, null, 1],
                    [null, 1, null, 1, null],
                ],
            }
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/3xivipk.png">',
            black: '<img src="https://i.imgur.com/rJ7Pd34.png">'
        },
        needsDiscovery: true,
        description: "<p>Moves as an inversed Queen, attacks as a Knight. Unlocked by promoting a Pawned.<br>It can carry other pieces.</p>",
    },
    'brick': {
        lootbox: {
            weight: 0,
        },
        patterns: {
            movement: [

            ],
            capture: [

            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/g3qXsth.png">',
            black: '<img src="https://i.imgur.com/bYTLYrb.png">'
        },
        // needsDiscovery: true,
        description: "<p>Brick can not be moved or killed. But it can be carried.</p>",
        ignoresThings: {
            "ignoreCarry": false,
            "ignoreKill": true,
        }
    },
    'experience_orb': {
        lootbox: {
            weight: 0.05,
        },
        neutralObject: true,
        needsDiscovery: true,
        description: "<p>Once captured, you will get 1K XP.</p>",
        display: {
            neutral: `<img src="https://i.imgur.com/v3ahgYA.png">`,
        },
        experiencePointsGainType: "orb_capture",
        spawnChance: 0,
    },
    'procket': {
        lootbox: {
            weight: 0.25,
        },
        patterns: {
            movement: [
                { direction: 'vertical', distance: 2, jump: false },
                {
                    area: [
                        [null, 1, null],
                        [null, null, null],
                        [null, 0, null],
                        [null, 1, null],
                        [null, 1, null],
                    ],
                    unmoved: [
                        [null, 0, null],
                        [null, 1, null],
                        [null, 1, null],
                    ],
                    exclude: true,
                    flipForBlack: true,
                }
            ],
            capture: [
                {
                    area: [
                        [null, null, null],
                        [1, 0, 1],
                        [null, null, null],
                    ],
                    unmoved: [
                        [1, null, 1],
                        [1, 0, 1],
                        [null, null, null],
                    ],
                    flipForBlack: true,
                }
            ],
        },
        autoMove: {
            direction: -1,
            chance: 15,
            explodeOnImpact: {
                chance: 0,
                distance: 1,
            }
        },
        display: {
            white: '<img src="https://i.imgur.com/omB1u1i.png">',
            black: '<img src="https://i.imgur.com/el6koO7.png">',
        },
        needsDiscovery: true,
        description: "<p>First move can move 2 spaces instead of 1<br>Automatically Moves forwards sometimes.<br>Attacks diagonally.<br>It can carry other pieces.<br>Transforms into something once you reach the opposite side of the board.</p>",
        convertion: {
            rows: [0],
            collumns: [0, 1, 2, 3, 4, 5, 6, 7],
            convertsTo: 'queen',
        },
        summonOnBeingMerged: {
            'type': 'brick',
            'chance': 0,
        }
    },
}

const LOCALSTORAGE_NAMES = {
    DEBUG: {
        TECH_TREE: 'DEBUG_TECH_TREE',
        CHESS_PLAYER: 'DEBUG_CHESS_PLAYER_DATA',
    },
    DEFAULT: {
        TECH_TREE: 'techTreeProgression',
        CHESS_PLAYER: 'chessPlayerData',
    }
}

function getCorrectLocalStorageName(type) {
    if (DEBUG_MODE) {
        return LOCALSTORAGE_NAMES.DEBUG[type];
    }
    return LOCALSTORAGE_NAMES.DEFAULT[type];
}