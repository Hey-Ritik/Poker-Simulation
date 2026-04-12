/**
 * Card Class: Represents a single playing card
 */
class Card {
    constructor(suit, rank, value) {
        this.suit = suit;   
        this.rank = rank;   
        this.value = value; 
    }

    getSuitColor() {
        return (this.suit === '♥' || this.suit === '♦') ? 'red' : 'black';
    }
}

/**
 * Deck Class: Manages a set of 52 cards
 */
class Deck {
    constructor() {
        this.cards = [];
        this.initialize();
    }

    initialize() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        for (let suit of suits) {
            for (let i = 0; i < ranks.length; i++) {
                this.cards.push(new Card(suit, ranks[i], i + 2));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }
}

/**
 * HandRank Enum-like object
 */
const HandRank = {
    HIGH_CARD: { name: "High Card", score: 1 },
    PAIR: { name: "One Pair", score: 2 },
    TWO_PAIR: { name: "Two Pair", score: 3 },
    THREE_OF_A_KIND: { name: "Three of a Kind", score: 4 },
    STRAIGHT: { name: "Straight", score: 5 },
    FLUSH: { name: "Flush", score: 6 },
    FULL_HOUSE: { name: "Full House", score: 7 },
    FOUR_OF_A_KIND: { name: "Four of a Kind", score: 8 }
};

/* Simplified Hand Evaluator with basic kicker support */
class HandEvaluator {
    static evaluate(cards) {
        // Sort descending by value
        const sorted = [...cards].sort((a, b) => b.value - a.value);
        const topVal = sorted[0].value; // Used for tie-breaking

        // Check Flush
        const suitCounts = {};
        for (let card of sorted) { suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1; }
        for (let suit in suitCounts) { 
            if (suitCounts[suit] >= 5) return { ...HandRank.FLUSH, totalScore: 600 + topVal }; 
        }

        // Check Straight
        const uniqueValues = [...new Set(sorted.map(c => c.value))].sort((a, b) => b - a);
        for (let i = 0; i <= uniqueValues.length - 5; i++) {
            if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
                return { ...HandRank.STRAIGHT, totalScore: 500 + uniqueValues[i] };
            }
        }

        const rankCounts = {};
        for (let card of sorted) { rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1; }
        const counts = Object.values(rankCounts);
        
        if (counts.includes(4)) return { ...HandRank.FOUR_OF_A_KIND, totalScore: 800 + topVal };
        if (counts.includes(3) && counts.includes(2)) return { ...HandRank.FULL_HOUSE, totalScore: 700 + topVal };
        if (counts.includes(3)) return { ...HandRank.THREE_OF_A_KIND, totalScore: 400 + topVal };
        
        const pairs = counts.filter(c => c === 2).length;
        if (pairs >= 2) return { ...HandRank.TWO_PAIR, totalScore: 300 + topVal };
        if (pairs === 1) return { ...HandRank.PAIR, totalScore: 200 + topVal };

        return { ...HandRank.HIGH_CARD, totalScore: 100 + topVal };
    }
}

/**
 * Player Class (Base Class)
 * Represents a generic player in the game.
 */
class Player {
    constructor(name, id, chips = 1000) {
        this.name = name;
        this.id = id;
        this.chips = chips;
        this.hand = [];
        this.isFolded = false;
        this.currentRoundBet = 0;
        this.lastAction = "";
        this.isWinner = false;
    }

    addCard(card) {
        this.hand.push(card);
    }

    resetForRound() {
        this.hand = [];
        this.isFolded = false;
        this.currentRoundBet = 0;
        this.lastAction = "";
        this.isWinner = false;
    }

    /**
     * Polymorphism Example:
     * This method is overridden in the Bot class.
     * For human players, it simply enables the UI controls.
     */
    makeMove(table) {
        // Human player version: enable buttons for user input
        table.enableActions(true);
    }
}

/**
 * Bot Class (Inheritance Example)
 * Extends the Player class to specialize behavior for automated bots.
 */
class Bot extends Player {
    constructor(name, id, chips = 1000) {
        // Call the parent class (Player) constructor
        super(name, id, chips);
    }

    /**
     * Polymorphism Example:
     * The Bot overrides makeMove to perform automated decision-making.
     */
    makeMove(table) {
        // Ensure actions are disabled to prevent human input during bot turn
        table.enableActions(false);

        // Bots don't act during showdown or waiting
        if (table.stage === "SHOWDOWN" || table.stage === "WAITING") return;

        // Add a slight delay to mimic thinking time
        setTimeout(() => {
            const rand = Math.random();
            if (rand < 0.1) table.handleAction('FOLD');
            else if (rand < 0.8) table.handleAction('CALL');
            else table.handleAction('RAISE');
        }, 1000);
    }
}

/**
 * Table Class: Controls the Game Flow and Turn Management
 * Refactored to delegate moves to Player/Bot classes.
 */
class Table {
    constructor() {
        this.players = [];
        this.deck = null;
        this.communityCards = [];
        this.pot = 0;
        this.currentBet = 0;
        this.currentPlayerIndex = 0;
        this.stage = "WAITING";
        
        this.init();
    }

    init() {
        // Instantiate one human Player and five AI Bots (Inheritance usage)
        this.players.push(new Player("You", 0)); // Player 0 is human
        const botNames = ["Bot 1", "Bot 2", "Bot 3", "Bot 4", "Bot 5"];
        botNames.forEach((name, i) => {
            this.players.push(new Bot(name, i + 1)); // Bots 1-5
        });

        // Bind DOM Elements
        this.statusEl = document.getElementById('game-status');
        this.potEl = document.getElementById('pot-amount');
        this.communityEl = document.getElementById('community-cards');
        this.playersEl = document.getElementById('players-container');
        
        this.foldBtn = document.getElementById('fold-btn');
        this.callBtn = document.getElementById('call-btn');
        this.raiseBtn = document.getElementById('raise-btn');
        this.nextBtn = document.getElementById('next-stage-btn');

        // Event listeners
        this.foldBtn.onclick = () => this.handleAction('FOLD');
        this.callBtn.onclick = () => this.handleAction('CALL');
        this.raiseBtn.onclick = () => this.handleAction('RAISE');
        this.nextBtn.onclick = () => this.nextStage();
        
        this.updateUI();
    }

    nextStage() {
        if (this.stage === "WAITING" || this.stage === "SHOWDOWN") {
            this.startNewRound();
        } else if (this.stage === "PRE_FLOP") {
            this.startFlop();
        } else if (this.stage === "FLOP") {
            this.startTurn();
        } else if (this.stage === "TURN") {
            this.startRiver();
        } else if (this.stage === "RIVER") {
            this.showdown();
        }
    }

    startNewRound() {
        this.deck = new Deck();
        this.deck.shuffle();
        this.communityCards = [];
        this.pot = 0;
        this.currentBet = 0;
        this.players.forEach(p => p.resetForRound());
        
        this.stage = "PRE_FLOP";
        this.statusEl.innerText = "Pre-Flop: Betting Begins";
        
        this.postBlinds();

        for (let i = 0; i < 2; i++) {
            this.players.forEach(p => p.addCard(this.deck.draw()));
        }

        this.currentPlayerIndex = 0; 
        this.updateUI();
        
        // Use Polymorphism to trigger the first move
        this.players[this.currentPlayerIndex].makeMove(this);
    }

    postBlinds() {
        const sb = 10, bb = 20;
        this.players[1].chips -= sb;
        this.players[1].currentRoundBet = sb;
        this.players[2].chips -= bb;
        this.players[2].currentRoundBet = bb;
        this.pot = sb + bb;
        this.currentBet = bb;
    }

    startFlop() {
        this.stage = "FLOP";
        this.statusEl.innerText = "The Flop";
        for (let i = 0; i < 3; i++) this.communityCards.push(this.deck.draw());
        this.resetTurnSystem();
    }

    startTurn() {
        this.stage = "TURN";
        this.statusEl.innerText = "The Turn";
        this.communityCards.push(this.deck.draw());
        this.resetTurnSystem();
    }

    startRiver() {
        this.stage = "RIVER";
        this.statusEl.innerText = "The River";
        this.communityCards.push(this.deck.draw());
        this.resetTurnSystem();
    }

    resetTurnSystem() {
        this.currentPlayerIndex = 0;
        this.players.forEach(p => p.currentRoundBet = 0);
        this.currentBet = 0;
        this.updateUI();
        
        // Use Polymorphism to trigger the move
        this.players[this.currentPlayerIndex].makeMove(this);
    }

    handleAction(actionType) {
        const p = this.players[this.currentPlayerIndex];
        
        if (actionType === 'FOLD') {
            p.isFolded = true;
            p.lastAction = "Folded";
        } else if (actionType === 'CALL') {
            const amountNeeded = this.currentBet - p.currentRoundBet;
            const actualBet = Math.min(p.chips, amountNeeded);
            p.chips -= actualBet;
            p.currentRoundBet += actualBet;
            this.pot += actualBet;
            p.lastAction = "Called";
        } else if (actionType === 'RAISE') {
            const raiseAmt = 50;
            const totalBet = this.currentBet + raiseAmt;
            const diff = totalBet - p.currentRoundBet;
            p.chips -= diff;
            p.currentRoundBet += diff;
            p.pot += diff;
            this.currentBet = totalBet;
            p.lastAction = "Raised";
        }

        this.nextTurn();
    }

    nextTurn() {
        this.currentPlayerIndex++;
        
        if (this.currentPlayerIndex >= this.players.length) {
            this.enableActions(false);
            
            if (this.stage !== "SHOWDOWN") {
                this.statusEl.innerText = "Round over. Preparing next cards...";
                this.updateUI();
                
                setTimeout(() => {
                    this.nextStage();
                }, 1500);
            } else {
                this.updateUI();
            }
            return;
        }

        const nextPlayer = this.players[this.currentPlayerIndex];
        if (nextPlayer.isFolded) {
            this.nextTurn();
            return;
        }

        this.updateUI();

        /**
         * Polymorphism Usage:
         * We don't check 'if bot'. We just call makeMove(). 
         * If it's a Bot, it acts automatically.
         * If it's a Player, it enables buttons.
         */
        nextPlayer.makeMove(this);
    }

    showdown() {
        this.stage = "SHOWDOWN";
        let winner = null;
        let bestRankScore = -1;

        const activePlayers = this.players.filter(p => !p.isFolded);
        
        activePlayers.forEach(p => {
            const allCards = [...p.hand, ...this.communityCards];
            const result = HandEvaluator.evaluate(allCards);
            p.lastAction = result.name;
            if (result.totalScore > bestRankScore) {
                bestRankScore = result.totalScore;
                winner = p;
            }
        });

        if (winner) {
            this.statusEl.innerText = `${winner.name} Wins $${this.pot}!`;
            winner.chips += this.pot;
            this.pot = 0;
            winner.isWinner = true;
        }
        
        this.updateUI();
    }

    enableActions(enabled) {
        this.foldBtn.disabled = !enabled;
        this.callBtn.disabled = !enabled;
        this.raiseBtn.disabled = !enabled;
    }

    createCardHTML(card, hidden = false) {
        if (hidden) return `<div class="card hidden"></div>`;
        const color = card.getSuitColor();
        return `<div class="card ${color}">
                    <span>${card.rank}</span>
                    <span>${card.suit}</span>
                </div>`;
    }

    updateUI() {
        this.potEl.innerText = this.pot;
        this.communityEl.innerHTML = this.communityCards.map(c => this.createCardHTML(c)).join('');

        this.playersEl.innerHTML = "";
        this.players.forEach((p, index) => {
            const isTurn = (index === this.currentPlayerIndex && this.stage !== "SHOWDOWN" && this.stage !== "WAITING");
            const hideHand = (index > 0 && this.stage !== "SHOWDOWN");

            const html = `
                <div class="player-box player-${p.id} ${p.isFolded ? 'folded' : ''} ${isTurn ? 'active-turn' : ''} ${p.isWinner ? 'winner' : ''}">
                    <div class="player-name">${p.name}</div>
                    <div class="player-chips">$${p.chips}</div>
                    <div class="player-hand">
                        ${p.hand.map(c => this.createCardHTML(c, hideHand)).join('')}
                    </div>
                    <div class="hand-rank">${p.lastAction}</div>
                </div>
            `;
            this.playersEl.innerHTML += html;
        });

        if (this.stage === "SHOWDOWN" || this.stage === "WAITING") {
            this.nextBtn.classList.add('visible');
            this.nextBtn.innerText = "New Round";
        } else {
            this.nextBtn.classList.remove('visible');
        }
    }
}

// Start Game
const game = new Table();
