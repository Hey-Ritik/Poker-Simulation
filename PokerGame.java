import java.util.ArrayList;
import java.util.List;

public class PokerGame {
    public static void main(String[] args) {
        System.out.println("=====================================");
        System.out.println("Java-Based Poker Simulation (Console)");
        System.out.println("=====================================\n");

        // 1. Create deck and shuffle
        Deck deck = new Deck();
        deck.shuffleDeck();
        System.out.println("Deck initialized and shuffled.\n");

        // 2. Create 3 players
        List<Player> players = new ArrayList<>();
        players.add(new Player("Alice"));
        players.add(new Player("Bob"));
        players.add(new Player("Charlie"));

        // 3. Deal 5 cards each
        for (int i = 0; i < 5; i++) {
            for (Player p : players) {
                p.receiveCard(deck.drawCard());
            }
        }

        System.out.println("Cards dealt successfully.\n");

        // 4. Display hands and evaluate
        Player winner = null;
        int bestScore = -1;
        String winningHandName = "";
        boolean isTie = false;

        for (Player p : players) {
            p.showHand();

            HandEvaluator.EvaluationResult eval = HandEvaluator.evaluate(p.getHand());
            System.out.println("  => Hand Rank: " + eval.getName() + " (Score: " + eval.getScore() + ")\n");

            if (eval.getScore() > bestScore) {
                bestScore = eval.getScore();
                winner = p;
                winningHandName = eval.getName();
                isTie = false;
            } else if (eval.getScore() == bestScore) {
                isTie = true; // Simple tie handling
            }
        }

        // 5. Determine and print result
        System.out.println("=====================================");
        if (isTie) {
            System.out.println("Result: It's a Tie! (Multiple players have the same high score)");
        } else {
            System.out.println("Winner: " + winner.getName() + " with a " + winningHandName + "!");
        }
        System.out.println("=====================================");
    }
}
