/**
 * Enum for Suit of a card
 */
enum Suit {
    SPADES("♠"), HEARTS("♥"), DIAMONDS("♦"), CLUBS("♣");
    
    private final String symbol;
    Suit(String symbol) { this.symbol = symbol; }
    public String getSymbol() { return symbol; }
}

/**
 * Enum for Rank of a card
 */
enum Rank {
    TWO("2", 2), THREE("3", 3), FOUR("4", 4), FIVE("5", 5), SIX("6", 6), 
    SEVEN("7", 7), EIGHT("8", 8), NINE("9", 9), TEN("10", 10), 
    JACK("J", 11), QUEEN("Q", 12), KING("K", 13), ACE("A", 14);

    private final String name;
    private final int value;

    Rank(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public String getName() { return name; }
    public int getValue() { return value; }
}

/**
 * Card Class: Represents a single playing card with Encapsulation
 */
public class Card {
    private final Suit suit;
    private final Rank rank;

    public Card(Suit suit, Rank rank) {
        this.suit = suit;
        this.rank = rank;
    }

    public Suit getSuit() { return suit; }
    public Rank getRank() { return rank; }
    public int getValue() { return rank.getValue(); }

    @Override
    public String toString() {
        return rank.getName() + suit.getSymbol();
    }
}
