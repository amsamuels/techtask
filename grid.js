class TickerGrid {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID "${containerId}" not found.`);
        }
        this.data = [];
        this.headers = ['Name', 'Company Name', 'Price', 'Change', 'Chg %', 'Mkt Cap'];
    }

    render() {
        this.container.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add('ticker-grid__table');

        const headerRow = this.createHeaderRow();
        table.appendChild(headerRow);

        this.data.forEach(item => {
            const row = this.createDataRow(item);
            table.appendChild(row);
        });

        this.container.appendChild(table);
    }

    createHeaderRow() {
        const headerRow = document.createElement('tr');
        headerRow.classList.add('ticker-grid__row', 'ticker-grid__header');

        this.headers.forEach(headerText => {
            const th = document.createElement('th');
            th.classList.add('ticker-grid__cell');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        return headerRow;
    }

    createDataRow(item) {
        const row = document.createElement('tr');
        row.classList.add('ticker-grid__row');

        this.headers.forEach(header => {
            const td = document.createElement('td');
            td.classList.add('ticker-grid__cell');
            td.textContent = item[header];
            td.dataset.name = item['Name'];
            td.dataset.key = header;
            row.appendChild(td);
        });

        return row;
    }

    update(newData) {
        this.data = newData;
        this.render();
    }

    merge(newData) {
        this.data = this.data.map(item => {
            if (item.Name === newData.Name) {
                this.headers.forEach(header => {
                    if (newData[header]) {
                        item[header] = newData[header];
                        this.highlightCell(item.Name, header);
                    }
                });
            }
            return item;
        });
        this.render();
    }

    highlightCell(name, key) {
        const cell = document.querySelector(`.ticker-grid__cell[data-name="${name}"][data-key="${key}"]`);
        if (cell) {
            cell.classList.add('ticker-grid__cell--highlighted');
            setTimeout(() => {
                cell.classList.remove('ticker-grid__cell--highlighted');
            }, 2000);
        }
    }
}
