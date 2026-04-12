import java.util.ArrayList;
import java.util.List;

/**
 * Table Class: Manages the game flow
 */
public class Table {
    private List<Player> players;
    private List<Card> communityCards;
    private Deck deck;

    public Table() {
        players = new ArrayList<>();
        communityCards = new ArrayList<>();
        deck = new Deck();
        
        // Create 6 players
        String[] names = {"You", "Bot 1", "Bot 2", "Bot 3", "Bot 4", "Bot 5"};
        for (String name : names) {
            players.add(new Player(name));
        }
    }

    public void playRound() {
        deck = new Deck(); // Fresh deck
        deck.shuffle();
        communityCards.clear();
        for (Player p : players) p.reset();

        // 1. Deal 2 cards to each player
        for (int i = 0; i < 2; i++) {
            for (Player p : players) {
                p.addCard(deck.draw());
            }
        }

        // 2. Deal 5 community cards
        for (int i = 0; i < 5; i++) {
            communityCards.add(deck.draw());
        }

        // 3. Evaluate each player
        for (Player p : players) {
            List<Card> allCards = new ArrayList<>(p.getHand());
            allCards.addAll(communityCards);
            p.setHandRank(HandEvaluator.evaluate(allCards));
        }
    }

    public void displayResults() {
        System.out.println("--- POKER SIMULATION RESULTS ---");
        System.out.println("Community Cards: " + communityCards);
        System.out.println();

        Player winner = players.get(0);
        for (Player p : players) {
            System.out.println(p);
            if (p.getHandRank().getScore() > winner.getHandRank().getScore()) {
                winner = p;
            }
        }

        System.out.println("\nWINNER: " + winner.getName() + " with " + winner.getHandRank().getName() + "!");
    }
}
