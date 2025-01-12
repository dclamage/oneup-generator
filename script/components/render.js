import { Grid } from './grid.js';

export class GridRenderer {
    constructor(container) {
        this.container = container;
    }

	/**
	 * Renders a grid to the container, replacing any existing content.
	 * 
	 * @param {Grid} grid 
	 */
    render(grid) {
        this.container.innerHTML = ""; // clear old table

        const table = document.createElement("table");

		const N = grid.size;
        for (let r = 0; r < N; r++) {
            const tr = document.createElement("tr");
            for (let c = 0; c < N; c++) {
                const td = document.createElement("td");
                td.textContent = grid.getCell(r, c).getValue();

				const boundaries = grid.getBoundaries(r, c);

                // If rowBoundaries[r][c] is true, we apply a thick left border
                if (boundaries[0]) {
                    td.classList.add("segment-left");
                }
                // If colBoundaries[r][c] is true, we apply a thick top border
                if (boundaries[2]) {
                    td.classList.add("segment-top");
                }

                // The final row and column always have thick borders
                if (r === N - 1) {
                    td.classList.add("segment-bottom");
                }
                if (c === N - 1) {
                    td.classList.add("segment-right");
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        this.container.appendChild(table);
    }
}
