import java.util.ArrayList;
import java.util.List;

/**
 * Player Class: Stores player state with Encapsulation
 */
public class Player {
    private String name;
    private List<Card> hand;
    private HandRank handRank;

    public Player(String name) {
        this.name = name;
        this.hand = new ArrayList<>();
    }

    public void addCard(Card card) {
        hand.add(card);
    }

    public void reset() {
        hand.clear();
        handRank = null;
    }

    // Getters and Setters (Encapsulation)
    public String getName() { return name; }
    public List<Card> getHand() { return hand; }
    public HandRank getHandRank() { return handRank; }
    public void setHandRank(HandRank handRank) { this.handRank = handRank; }

    @Override
    public String toString() {
        return name + " " + hand + " [" + (handRank != null ? handRank.getName() : "N/A") + "]";
    }
}
