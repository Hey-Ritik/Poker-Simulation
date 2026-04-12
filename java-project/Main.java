/**
 * Main Class: Entry point for the Java Poker Simulation
 */
public class Main {
    public static void main(String[] args) {
        // Create the table
        Table table = new Table();
        
        // Play the simulation
        table.playRound();
        
        // Show results in console
        table.displayResults();
    }
}
