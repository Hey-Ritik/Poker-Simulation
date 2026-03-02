import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HandEvaluator {

    // Helper class to hold evaluation result
    public static class EvaluationResult {
        private String name;
        private int score;

        public EvaluationResult(String name, int score) {
            this.name = name;
            this.score = score;
        }

        public String getName() {
            return name;
        }

        public int getScore() {
            return score;
        }
    }

    public static EvaluationResult evaluate(List<Card> hand) {
        // Sort hand in descending order of value
        List<Card> sortedHand = new ArrayList<>(hand);
        sortedHand.sort((c1, c2) -> Integer.compare(c2.getValue(), c1.getValue()));

        boolean isFlush = checkFlush(sortedHand);
        boolean isStraight = checkStraight(sortedHand);
        Map<Integer, Integer> counts = getRankCounts(sortedHand);

        int pairsCount = 0;
        int threesCount = 0;
        int foursCount = 0;

        for (int count : counts.values()) {
            if (count == 2)
                pairsCount++;
            else if (count == 3)
                threesCount++;
            else if (count == 4)
                foursCount++;
        }

        // Return scores using base values to distinguish hands.
        if (isStraight && isFlush) {
            return new EvaluationResult("Straight Flush", 800 + sortedHand.get(0).getValue());
        }
        if (foursCount == 1) {
            return new EvaluationResult("Four of a Kind", 700 + getRankValueByCount(counts, 4));
        }
        if (threesCount == 1 && pairsCount == 1) {
            return new EvaluationResult("Full House", 600 + getRankValueByCount(counts, 3));
        }
        if (isFlush) {
            return new EvaluationResult("Flush", 500 + sortedHand.get(0).getValue());
        }
        if (isStraight) {
            return new EvaluationResult("Straight", 400 + sortedHand.get(0).getValue());
        }
        if (threesCount == 1) {
            return new EvaluationResult("Three of a Kind", 300 + getRankValueByCount(counts, 3));
        }
        if (pairsCount == 2) {
            List<Integer> pairValues = new ArrayList<>();
            for (Map.Entry<Integer, Integer> entry : counts.entrySet()) {
                if (entry.getValue() == 2)
                    pairValues.add(entry.getKey());
            }
            Collections.sort(pairValues, Collections.reverseOrder());
            return new EvaluationResult("Two Pair", 200 + pairValues.get(0));
        }
        if (pairsCount == 1) {
            return new EvaluationResult("Pair", 100 + getRankValueByCount(counts, 2));
        }

        return new EvaluationResult("High Card", sortedHand.get(0).getValue());
    }

    private static boolean checkFlush(List<Card> hand) {
        String firstSuit = hand.get(0).getSuit();
        for (Card card : hand) {
            if (!card.getSuit().equals(firstSuit)) {
                return false;
            }
        }
        return true;
    }

    private static boolean checkStraight(List<Card> hand) {
        for (int i = 0; i < hand.size() - 1; i++) {
            if (hand.get(i).getValue() - 1 != hand.get(i + 1).getValue()) {
                // Special case: Ace low straight (Ace, 5, 4, 3, 2). Ace is 14.
                if (i == 0 && hand.get(0).getValue() == 14 && hand.get(1).getValue() == 5) {
                    continue;
                }
                return false;
            }
        }
        return true;
    }

    private static Map<Integer, Integer> getRankCounts(List<Card> hand) {
        Map<Integer, Integer> counts = new HashMap<>();
        for (Card card : hand) {
            counts.put(card.getValue(), counts.getOrDefault(card.getValue(), 0) + 1);
        }
        return counts;
    }

    private static int getRankValueByCount(Map<Integer, Integer> counts, int targetCount) {
        for (Map.Entry<Integer, Integer> entry : counts.entrySet()) {
            if (entry.getValue() == targetCount) {
                return entry.getKey();
            }
        }
        return 0;
    }
}
