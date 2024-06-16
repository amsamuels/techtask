class CSVLoader {
    constructor(filePath) {
        this.filePath = filePath;
    }

    loadCSV(callback) {
        fetch(this.filePath)
            .then(response => response.text())
            .then(data => {
                let parsedData
                if (this.filePath==="snapshot.csv"){
                    parsedData = this.parseCSV(data);
                }
                if (this.filePath==="deltas.csv"){
                    parsedData = this.parseCSVDel(data);
                }
                callback(parsedData);
            })
            .catch(error => {
                console.error(`Error loading ${this.filePath}:`, error);
            });
    }

    parseCSV(data) {
        const [headerLine, ...lines] = data.trim().split('\n');
        const headers = headerLine.split(',').map(header => header.trim());
        return lines.map(line => {
            const values = line.split(',').map(value => value.trim());
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
            }, {});
        });
    }

    parseCSVDel(data) {
        const lines = data.trim().split('\n');

        // Initialize variables to track parsing state
        let index = 0;
        let delay = 0;
        const result = [];

        while (index < lines.length) {
            const line = lines[index].trim();
            
            // Skip empty rows
            if (line === ',,') {
                index++;
                continue;
            }

            // If it's a delay row, update delay and move to the next line
            if (!isNaN(Number(line))) {
                delay = parseInt(line);
                index++;
                continue;
            }

            // Otherwise, process the data row
            const values = line.split(',').map(value => value.trim());
            result.push(values);
            index++;
        }
console.log(result)
        return { data: result, delay };
    }
}
