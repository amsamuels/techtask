// this function pasrseCSV -  parses CSV data
function parseCSV(data) {
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j] ? currentLine[j].trim() : '';
        }

        result.push(obj);
    }

    console.log("Parsed CSV data:", result);  // Debug log
    return result;
}

// TickerGrid class for managing the ticker grid
class TickerGrid {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = [];
    }

    // Method to render the ticker grid
    render() {
        if (!this.container) {
            console.error(`Container not found.`);
            return;
        }

        // Clear previous content
        this.container.innerHTML = '';

        // Create table element
        const table = document.createElement('table');
        table.classList.add('ticker-grid__table');

        // Create table header
        const headerRow = document.createElement('tr');
        headerRow.classList.add('ticker-grid__row', 'ticker-grid__header');
        const headers = ['Name', 'Company Name', 'Price', 'Change', 'Chg %', 'Mkt Cap'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.classList.add('ticker-grid__cell');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create table rows for each data item
        this.data.forEach(item => {
            const row = document.createElement('tr');
            row.classList.add('ticker-grid__row');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.classList.add('ticker-grid__cell');
                td.textContent = item[header];
                td.setAttribute('data-name', item['Name']);
                td.setAttribute('data-key', header);
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        // Append table to container
        this.container.appendChild(table);
    }

    // Method to update data and re-render the grid
    update(newData) {
        this.data = newData;
        this.render();
    }

    // Method to merge new data into existing data
    merge(newData) {
        console.log("Merging new data:", newData);  // Debug log
        this.data = this.data.map(item => {
            if (item.Name === newData.Name) {
                Object.keys(newData).forEach(key => {
                    if (newData[key]) {
                        item[key] = newData[key];
                        // Add a visual flare to updated cells
                        const cell = document.querySelector(`.ticker-grid__cell[data-name="${item.Name}"][data-key="${key}"]`);
                        if (cell) {
                            console.log(`Highlighting cell for ${item.Name} - ${key}`);  // Debug log
                            cell.classList.add('ticker-grid__cell--highlighted');
                            setTimeout(() => {
                                cell.classList.remove('ticker-grid__cell--highlighted');
                            }, 2000); // Keep highlighted for 2 seconds
                        }
                    }
                });
            }
            return item;
        });
        this.render();
    }
}

// Main app initialization
function initializeApp() {
    const tickerGrid = new TickerGrid('tickerGrid');

    // Function to load snapshot.csv data
    function loadSnapshotData() {
        fetch('snapshot.csv')
            .then(response => response.text())
            .then(data => {
                const parsedData = parseCSV(data);
                tickerGrid.update(parsedData);
            })
            .catch(error => {
                console.error('Error loading snapshot.csv:', error);
            });
    }

    // Function to handle updates from deltas.csv
    function handleUpdates() {
        let index = 0;
        let lines = [];

        function processLines() {
            if (index >= lines.length) {
                index = 0; // Reset index to repeat from start
            }

            const line = lines[index] ? lines[index].trim() : '';
            console.log("Processing line:", line);  // Debug log
            if (!line || !isNaN(Number(line))) {
                // If the line is empty or a number, wait for the delay before processing next set of deltas
                const delay = parseInt(line, 10) || 1000;
                setTimeout(processLines, delay);
                index++;
                return;
            }

            const newData = parseCSVLine(line);
            console.log("Parsed CSV line:", newData);  // Debug log
            tickerGrid.merge(newData);

            index++;
            setTimeout(processLines, 1000); // Adjust delay time as needed
        }

        // Load and parse deltas.csv
        fetch('deltas.csv')
            .then(response => response.text())
            .then(data => {
                lines = data.trim().split('\n');
                console.log("Deltas CSV lines:", lines);  // Debug log
                processLines();
            })
            .catch(error => {
                console.error('Error loading deltas.csv:', error);
            });
    }

    // Event listener for live update button
    const liveUpdateBtn = document.getElementById('liveUpdateBtn');
    if (liveUpdateBtn) {
        liveUpdateBtn.addEventListener('click', () => {
            handleUpdates();
        });
    }

    // Load snapshot data initially
    loadSnapshotData();
}

// Utility function to parse a single CSV line into an object
function parseCSVLine(line) {
    const values = line.split(',');
    return {
        Name: values[0] ? values[0].trim() : '',
        'Company Name': values[1] ? values[1].trim() : '',
        Price: values[2] ? values[2].trim() : '',
        Change: values[3] ? values[3].trim() : '',
        'Chg %': values[4] ? values[4].trim() : '',
        'Mkt Cap': values[5] ? values[5].trim() : ''
    };
}

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
