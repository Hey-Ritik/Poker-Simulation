# Texas Hold'em Poker Simulation 🃏

A complete, browser-based **Texas Hold'em Poker Simulation** built with pure HTML, CSS, and Vanilla JavaScript. This project features an automated game flow, AI opponents, and advanced Object-Oriented Programming (OOP) design.

![Poker Simulation Preview](https://raw.githubusercontent.com/Hey-Ritik/Poker-Simulation/main/poker_showdown_preview.png)

## 🌟 Key Features

- **Automated Game Flow**: Smooth progression through Pre-flop, Flop, Turn, River, and Showdown with timed delays.
- **Smart AI Opponents**: 5 Bots with automated decision-making logic using randomization.
- **Real Poker Mechanics**:
  - Betting system: **Fold**, **Call**, and **Raise**.
  - Small Blind ($10) and Big Blind ($20) system.
  - Dynamic Pot accumulation.
- **Hand Evaluation**: Accurate detection of hand rankings (from High Card to Four of a Kind) with kicker-based tie-breaking.
- **Responsive UI**: A centered poker table design with pulsing winner highlights and zero overlapping elements.

## 💻 Powered by OOP Concepts

This project was built using a clean Object-Oriented approach to demonstrate core programming principles:

- **Inheritance**: Used a base `Player` class and a specialized `Bot` subclass that extends it to shared common properties while adding unique behaviors.
- **Polymorphism**: Implemented a `makeMove()` method in both `Player` and `Bot` classes. The `Table` class triggers the move without needing to know if the player is human or AI.
- **Encapsulation**: Game data (chips, hands, deck) and logic are encapsulated within respective classes (`Card`, `Deck`, `Table`, `HandEvaluator`) for better maintainability.

## 🛠️ Technologies Used

- **HTML5**: Semantic structure for the poker table and player panels.
- **CSS3**: Modern styling with Flexbox/Grid, gradients, and keyframe animations.
- **Vanilla JavaScript**: Pure logic for card shuffling, hand evaluation, and game state management (No frameworks).

## 🚀 How to Run

1. Clone or download this repository.
2. Locate the `index.html` file inside the `web` folder.
3. Open `web/index.html` in any modern web browser (Chrome, Firefox, Edge, etc.).
4. Click **"New Round"** to start the simulation!

## 📁 Project Structure

```text
├── web/
│   ├── index.html      # Main game structure and UI elements
│   ├── style.css       # Table layout, player positioning, and animations
│   └── script.js       # Core game logic, OOP classes, and hand evaluation
├── java-project/       # Backend/Java implementation (if applicable)
└── README.md           # Project documentation
```

## 👤 Author

**Ritik Singh**
Developed for academic evaluation and demonstration of professional JavaScript OOP implementation.
