import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Deck Class: Manages a set of 52 cards
 */
public class Deck {
    private List<Card> cards;

    public Deck() {
        cards = new ArrayList<>();
        initialize();
    }

    /**
     * Create 52 cards using nested loops
     */
    private void initialize() {
        for (Suit suit : Suit.values()) {
            for (Rank rank : Rank.values()) {
                cards.add(new Card(suit, rank));
            }
        }
    }

    /**
     * Shuffle the cards
     */
    public void shuffle() {
        Collections.shuffle(cards);
    }

    /**
     * Draw the top card
     */
    public Card draw() {
        if (cards.isEmpty()) return null;
        return cards.remove(cards.size() - 1);
    }
}
