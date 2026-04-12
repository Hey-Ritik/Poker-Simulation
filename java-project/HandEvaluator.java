import java.util.*;

/**
 * HandEvaluator Class: Logic to detect poker hands using simple loops
 */
public class HandEvaluator {

    public static HandRank evaluate(List<Card> allCards) {
        // Sort cards by value (descending)
        allCards.sort((a, b) -> b.getValue() - a.getValue());

        if (isFlush(allCards)) return HandRank.FLUSH;
        if (isStraight(allCards)) return HandRank.STRAIGHT;

        // Group cards by rank to find pairs, trips, etc.
        Map<Rank, Integer> counts = new HashMap<>();
        for (Card card : allCards) {
            counts.put(card.getRank(), counts.getOrDefault(card.getRank(), 0) + 1);
        }

        int pairs = 0;
        boolean hasTrips = false;

        for (int count : counts.values()) {
            if (count == 3) hasTrips = true;
            if (count == 2) pairs++;
        }

        if (hasTrips) return HandRank.THREE_OF_A_KIND;
        if (pairs >= 2) return HandRank.TWO_PAIR;
        if (pairs == 1) return HandRank.PAIR;

        return HandRank.HIGH_CARD;
    }

    private static boolean isFlush(List<Card> cards) {
        Map<Suit, Integer> suitCounts = new HashMap<>();
        for (Card card : cards) {
            suitCounts.put(card.getSuit(), suitCounts.getOrDefault(card.getSuit(), 0) + 1);
        }
        for (int count : suitCounts.values()) {
            if (count >= 5) return true;
        }
        return false;
    }

    private static boolean isStraight(List<Card> cards) {
        // Get unique values and sort them
        Set<Integer> uniqueValuesSet = new TreeSet<>(Collections.reverseOrder());
        for (Card card : cards) uniqueValuesSet.add(card.getValue());
        
        List<Integer> values = new ArrayList<>(uniqueValuesSet);
        if (values.size() < 5) return false;

        for (int i = 0; i <= values.size() - 5; i++) {
            if (values.get(i) - values.get(i + 4) == 4) return true;
        }
        return false;
    }
}
