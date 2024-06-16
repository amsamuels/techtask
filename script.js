class App {
    constructor() {
        this.tickerGrid = new TickerGrid('tickerGrid');
        this.snapshotLoader = new CSVLoader('snapshot.csv');
        this.deltasLoader = new CSVLoader('deltas.csv');
        this.initialize();
    }

    initialize() {
        // Load the initial snapshot data
        this.snapshotLoader.loadCSV(data => {
            this.tickerGrid.update(data);
            // Start processing deltas after the snapshot is loaded
            this.handleUpdates();
        });
    }

    handleUpdates() {
        this.deltasLoader.loadCSV(data => {

         //   console.log(data)
            let index = 0;

            const processLines = () => {
                if (index >= data.length) {
                    return; // Stop processing when all lines are processed
                }
              //  console.log(data)
                const lines = data.slice(index, index + 10);
               
                lines.forEach(line => {
                    if (line && isNaN(Number(line))) {
                        this.tickerGrid.merge(line);
                    }
                });

                index += 10;

                // Find the delay line which is the first line after the 10 lines block
                const delayLine = data[index];
                const delay = parseInt(delayLine, 10) * 1000 || 1000; // Convert to milliseconds or default to 1 second


                index++; // Move past the delay line
                setTimeout(processLines, delay);
            };

            processLines();
        });
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
