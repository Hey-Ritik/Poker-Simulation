/**
 * Enum for Poker Hand Rankings
 */
public enum HandRank {
    HIGH_CARD("High Card", 1),
    PAIR("Pair", 2),
    TWO_PAIR("Two Pair", 3),
    THREE_OF_A_KIND("Three of a Kind", 4),
    STRAIGHT("Straight", 5),
    FLUSH("Flush", 6);

    private final String name;
    private final int score;

    HandRank(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public String getName() { return name; }
    public int getScore() { return score; }
}
