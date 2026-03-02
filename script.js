// ==========================================
// Java-Based Poker Simulation (Texas Hold'em)
// Rewritten in JavaScript using ES6 Classes
// ==========================================

// --- 1. Card Class ---
class Card {
    constructor(suit, rank, value) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
    }

    getColor() {
        return (this.suit === 'Hearts' || this.suit === 'Diamonds') ? 'red' : 'black';
    }
}

// --- 2. Deck Class ---
class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                this.cards.push(new Card(suits[i], ranks[j], values[j]));
            }
        }
    }

    shuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // Swap
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard() {
        return this.cards.pop();
    }
}

// --- 3. Player Class ---
class Player {
    constructor(name, isHuman) {
        this.name = name;
        this.isHuman = isHuman;
        this.chips = 1000; // Starting Chips

        // Round specific variables
        this.holeCards = [];
        this.currentBet = 0;
        this.hasFolded = false;

        // Final evaluation data
        this.bestHandScore = 0;
        this.bestHandName = "";
    }

    resetForRound() {
        this.holeCards = [];
        this.currentBet = 0;
        this.hasFolded = false;
        this.bestHandScore = 0;
        this.bestHandName = "";
    }

    receiveCard(card) {
        this.holeCards.push(card);
    }

    placeBet(amount) {
        if (amount > this.chips) amount = this.chips; // "All-in" scenario
        this.chips -= amount;
        this.currentBet += amount;
        return amount;
    }
}

// --- 4. HandEvaluator Class ---
class HandEvaluator {

    // Recursive generator to find all combinations of a specific size
    // We use this to find the best 5-card combination out of the 7 available cards
    static getCombinations(array, size) {
        const result = [];
        function generator(prefix, arr) {
            if (prefix.length === size) {
                result.push(prefix);
                return;
            }
            for (let i = 0; i < arr.length; i++) {
                generator(prefix.concat([arr[i]]), arr.slice(i + 1));
            }
        }
        generator([], array);
        return result;
    }

    // Returns the highest scoring 5-card hand from hole cards + community cards
    static getBestHand(holeCards, communityCards) {
        const allCards = [...holeCards, ...communityCards];

        // If the round ended early before 5 community cards are out
        if (allCards.length < 5) return { score: 0, name: "Winner by default" };

        const combos = this.getCombinations(allCards, 5);
        let bestScore = -1;
        let bestName = "";

        // Evaluate every single 5-card combination
        combos.forEach(combo => {
            const evalResult = this.evaluate5Cards(combo);
            if (evalResult.score > bestScore) {
                bestScore = evalResult.score;
                bestName = evalResult.name;
            }
        });

        return { score: bestScore, name: bestName };
    }

    // Standard static method evaluating exactly 5 cards
    static evaluate5Cards(hand) {
        const sortedHand = [...hand].sort((a, b) => b.value - a.value);
        const isFlush = this.checkFlush(sortedHand);
        const isStraight = this.checkStraight(sortedHand);
        const counts = this.getRankCounts(sortedHand);

        const pairsCount = Object.values(counts).filter(c => c === 2).length;
        const threesCount = Object.values(counts).filter(c => c === 3).length;
        const foursCount = Object.values(counts).filter(c => c === 4).length;

        // Base scores mapped to big increments so higher hand types always win
        if (isStraight && isFlush) return { score: 8000 + sortedHand[0].value, name: "Straight Flush" };
        if (foursCount === 1) return { score: 7000 + this.getRankValueByCount(counts, 4), name: "Four of a Kind" };
        if (threesCount === 1 && pairsCount === 1) return { score: 6000 + this.getRankValueByCount(counts, 3), name: "Full House" };
        if (isFlush) return { score: 5000 + sortedHand[0].value, name: "Flush" };
        if (isStraight) return { score: 4000 + sortedHand[0].value, name: "Straight" };
        if (threesCount === 1) return { score: 3000 + this.getRankValueByCount(counts, 3), name: "Three of a Kind" };
        if (pairsCount === 2) {
            const pairValues = Object.keys(counts).filter(k => counts[k] === 2).map(Number).sort((a, b) => b - a);
            return { score: 2000 + (pairValues[0] * 10) + pairValues[1], name: "Two Pair" }; // Simple tiebreaker
        }
        if (pairsCount === 1) return { score: 1000 + this.getRankValueByCount(counts, 2), name: "Pair" };

        return { score: sortedHand[0].value, name: "High Card" };
    }

    static checkFlush(hand) {
        const firstSuit = hand[0].suit;
        return hand.every(card => card.suit === firstSuit);
    }

    static checkStraight(hand) {
        for (let i = 0; i < hand.length - 1; i++) {
            if (hand[i].value - 1 !== hand[i + 1].value) {
                // Ignore standard sequence if it's the Ace-Low straight configuration
                if (i === 0 && hand[0].value === 14 && hand[1].value === 5) continue;
                return false;
            }
        }
        return true;
    }

    static getRankCounts(hand) {
        const counts = {};
        hand.forEach(card => counts[card.value] = (counts[card.value] || 0) + 1);
        return counts;
    }

    static getRankValueByCount(counts, countToFind) {
        for (const [val, count] of Object.entries(counts)) {
            if (count === countToFind) return Number(val);
        }
        return 0;
    }
}

// --- 5. GameManager Class ---
class GameManager {
    constructor() {
        this.players = [
            new Player("You (Human)", true),
            new Player("AI Player 1", false),
            new Player("AI Player 2", false)
        ];
        this.deck = null;
        this.communityCards = [];
        this.pot = 0;

        // Texas Holdem Stages: 0 = Pre-flop, 1 = Flop, 2 = Turn, 3 = River, 4 = Showdown
        this.stage = 0;
        this.highestBet = 0;
        this.isRoundActive = false;

        this.setupUIBindings();
        this.render();
    }

    setupUIBindings() {
        document.getElementById('startBtn').addEventListener('click', () => this.startRound());
        document.getElementById('foldBtn').addEventListener('click', () => this.humanAction('fold'));
        document.getElementById('callBtn').addEventListener('click', () => this.humanAction('call'));
        document.getElementById('raiseBtn').addEventListener('click', () => this.humanAction('raise'));
    }

    startRound() {
        // Validation: Verify if players have enough chips to play
        if (this.players.filter(p => p.chips > 0).length < 2) {
            this.setInfo("Game Over! Not enough players have chips to continue.");
            return;
        }

        // Initialize table
        this.deck = new Deck();
        this.deck.shuffleDeck();
        this.communityCards = [];
        this.pot = 0;
        this.stage = 0;
        this.highestBet = 0;
        this.isRoundActive = true;

        this.players.forEach(p => p.resetForRound());

        // Standard Ante (Every active player puts in 10 chips automatically)
        this.players.forEach(p => {
            if (p.chips > 0) {
                const bet = p.placeBet(10);
                this.pot += bet;
                this.highestBet = 10;
            } else {
                p.hasFolded = true; // Player is bankrupt from previous rounds
            }
        });

        // Deal 2 hole cards to each active player
        for (let i = 0; i < 2; i++) {
            this.players.forEach(p => {
                if (!p.hasFolded) p.receiveCard(this.deck.drawCard());
            });
        }

        this.setInfo("Pre-flop: Dealing complete. Action is on you.");
        this.render();
    }

    // Handles user button clicks
    humanAction(actionType) {
        const human = this.players.find(p => p.isHuman);

        if (actionType === 'fold') {
            human.hasFolded = true;
            this.setInfo(`You folded.`);
        } else if (actionType === 'call') {
            const amountToCall = this.highestBet - human.currentBet;
            const bet = human.placeBet(amountToCall);
            this.pot += bet;
            this.setInfo(amountToCall > 0 ? `You called ${bet} chips.` : "You checked.");
        } else if (actionType === 'raise') {
            const amountToCall = this.highestBet - human.currentBet;
            const raiseAmount = 50;
            const bet = human.placeBet(amountToCall + raiseAmount);
            this.highestBet += raiseAmount;
            this.pot += bet;
            this.setInfo(`You raised ${raiseAmount} chips.`);
        }

        this.render(); // Ensure UI reflects human bet instantly

        // Slight artificial delay before AI plays to simulate thinking
        setTimeout(() => {
            if (this.checkRoundOver()) {
                this.endRoundEarly();
            } else {
                this.playAITurns();
            }
        }, 800);
    }

    // Handles simplistic AI decisions
    playAITurns() {
        this.players.filter(p => !p.isHuman && !p.hasFolded).forEach(ai => {
            // Simplified logic: 15% fold if there's a raise, else 85% call
            const willFold = Math.random() < 0.15 && this.highestBet > ai.currentBet;

            if (willFold) {
                ai.hasFolded = true;
                // Omitted specific text to avoid long flashing rapid text updates
            } else {
                const amountToCall = this.highestBet - ai.currentBet;
                if (amountToCall > 0) {
                    const bet = ai.placeBet(amountToCall);
                    this.pot += bet;
                }
            }
        });

        if (this.checkRoundOver()) {
            this.endRoundEarly();
        } else {
            this.nextStage();
        }
    }

    // Checking if all players folded except one
    checkRoundOver() {
        const activePlayers = this.players.filter(p => !p.hasFolded);
        return activePlayers.length === 1;
    }

    // Conclude round without showdowns if everyone else folded
    endRoundEarly() {
        const winner = this.players.find(p => !p.hasFolded);
        if (winner) {
            winner.chips += this.pot;
            this.setInfo(`${winner.name} wins ${this.pot} chips! (Others folded)`);
        }
        this.isRoundActive = false;
        this.stage = 4; // Shift to end stage
        this.render();
    }

    // Progressing through Flop, Turn, and River
    nextStage() {
        if (!this.isRoundActive) return;

        this.stage++;

        if (this.stage === 1) { // Flop (3 cards)
            this.communityCards.push(this.deck.drawCard());
            this.communityCards.push(this.deck.drawCard());
            this.communityCards.push(this.deck.drawCard());
            this.setInfo("Flop dealt.");
        } else if (this.stage === 2) { // Turn (1 card)
            this.communityCards.push(this.deck.drawCard());
            this.setInfo("Turn dealt.");
        } else if (this.stage === 3) { // River (1 card)
            this.communityCards.push(this.deck.drawCard());
            this.setInfo("River dealt.");
        } else if (this.stage === 4) { // Showdown phase
            this.evaluateShowdown();
            this.render();
            return; // Ends loop completely
        }

        const human = this.players.find(p => p.isHuman);

        if (human.hasFolded) {
            // If human folded, automatically progress AIs until Showdown
            setTimeout(() => {
                this.playAITurns();
            }, 800);
        } else {
            setTimeout(() => {
                this.setInfo(this.stage < 4 ? `Action is on you.` : "");
            }, 1000);
        }

        this.render();
    }

    // Evaluate all remaining hands after the River
    evaluateShowdown() {
        this.isRoundActive = false;
        let bestScore = -1;
        let winners = [];

        this.players.filter(p => !p.hasFolded).forEach(player => {
            const evalResult = HandEvaluator.getBestHand(player.holeCards, this.communityCards);
            player.bestHandScore = evalResult.score;
            player.bestHandName = evalResult.name;

            if (player.bestHandScore > bestScore) {
                bestScore = player.bestHandScore;
                winners = [player];
            } else if (player.bestHandScore === bestScore) {
                winners.push(player); // Multiple winners
            }
        });

        // Distribute pot
        const winAmount = Math.floor(this.pot / winners.length);
        winners.forEach(w => w.chips += winAmount);

        // Announce
        if (winners.length === 1) {
            this.setInfo(`${winners[0].name} wins ${this.pot} chips with a ${winners[0].bestHandName}!`);
        } else {
            const names = winners.map(w => w.name).join(' & ');
            this.setInfo(`Tie! ${names} split ${this.pot} chips with a ${winners[0].bestHandName}!`);
        }
    }

    setInfo(msg) {
        document.getElementById('gameInfo').textContent = msg;
    }

    // Updates HTML UI layout
    render() {
        document.getElementById('potAmount').textContent = this.pot;

        // Populate Community Cards
        const commContainer = document.getElementById('communityCards');
        commContainer.innerHTML = '';
        this.communityCards.forEach(card => {
            commContainer.appendChild(this.createCardElement(card));
        });

        const human = this.players.find(p => p.isHuman);

        // Control Button Logic
        document.getElementById('startBtn').disabled = this.isRoundActive;
        const controlsDisabled = !this.isRoundActive || human.hasFolded;

        document.getElementById('foldBtn').disabled = controlsDisabled;
        document.getElementById('callBtn').disabled = controlsDisabled;
        document.getElementById('raiseBtn').disabled = controlsDisabled;

        // Update 'Call' button text to explicitly show 'Check' if no money is owed
        if (this.isRoundActive && !human.hasFolded) {
            const amountToCall = this.highestBet - human.currentBet;
            document.getElementById('callBtn').textContent = amountToCall > 0 ? `Call (${amountToCall})` : 'Check';
        } else {
            document.getElementById('callBtn').textContent = 'Call';
        }

        // Render Player Info
        const playersContainer = document.getElementById('playersContainer');
        playersContainer.innerHTML = '';

        this.players.forEach(player => {
            const box = document.createElement('div');
            box.className = 'player-box' +
                (player.isHuman ? ' human-player' : '') +
                (player.hasFolded ? ' folded' : '');

            // Create Header
            const header = document.createElement('div');
            header.className = 'player-header';

            const name = document.createElement('div');
            name.className = 'player-name';
            name.textContent = player.name + (player.hasFolded ? " (Folded)" : "");

            const chips = document.createElement('div');
            chips.className = 'player-chips';
            chips.textContent = `Chips: ${player.chips}`;

            const bet = document.createElement('div');
            bet.className = 'player-bet';
            bet.textContent = `Bet inside Pot: ${player.currentBet}`;

            header.appendChild(name);
            header.appendChild(chips);
            header.appendChild(bet);

            // Show best hand rank result text during Showdown
            if (this.stage === 4 && !player.hasFolded && player.bestHandName) {
                const rankSpan = document.createElement('div');
                rankSpan.style.color = '#f1c40f';
                rankSpan.style.fontSize = '14px';
                rankSpan.style.marginTop = '10px';
                rankSpan.style.fontWeight = 'bold';
                rankSpan.textContent = `Results: ${player.bestHandName}`;
                header.appendChild(rankSpan);
            }

            box.appendChild(header);

            // Create Visual Cards
            const cards = document.createElement('div');
            cards.className = 'cards';

            player.holeCards.forEach(card => {
                // AI hole cards stay hidden unless game hits showdown
                const isHidden = !player.isHuman && this.isRoundActive && !player.hasFolded;
                cards.appendChild(this.createCardElement(card, isHidden));
            });

            box.appendChild(cards);
            playersContainer.appendChild(box);
        });
    }

    // Helper method to construct HTML elements for cards
    createCardElement(card, isHidden = false) {
        const suitSymbols = { 'Hearts': '♥', 'Diamonds': '♦', 'Clubs': '♣', 'Spades': '♠' };
        const rankDisplay = { '10': '10', 'Jack': 'J', 'Queen': 'Q', 'King': 'K', 'Ace': 'A' };

        const cardEl = document.createElement('div');
        if (isHidden) {
            cardEl.className = 'card hidden';
        } else {
            cardEl.className = `card ${card.getColor()}`;
            const shortRank = rankDisplay[card.rank] || card.rank;
            const symbol = suitSymbols[card.suit];
            cardEl.innerHTML = `<span>${shortRank}</span><span>${symbol}</span>`;
        }
        return cardEl;
    }
}

// Instantiate and start the simulator
const game = new GameManager();
