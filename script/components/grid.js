import { Cell } from "./cell.js";

export class Grid {
    constructor(size) {
        this.size = size;
        this.cells = Array.from({ length: size }, () => Array.from({ length: size }, () => new Cell(size)));
        this.rowSegments = Array.from({ length: size }, () => Array.from({ length: size }, () => [size]));
        this.colSegments = Array.from({ length: size }, () => Array.from({ length: size }, () => [size]));
    }

    getCell(row, col) {
        return this.cells[row][col];
    }

	getRow(row) {
		return this.cells[row];
	}

	getCol(col) {
		return this.cells.map(row => row[col]);
	}

    getRowSegments(row) {
        return this.rowSegments[row];
    }

    getColSegments(col) {
        return this.colSegments[col];
    }

    setRowSegments(row, segments) {
        this.rowSegments[row] = segments;

        let col = 0;
        for (let i = 0; i < segments.length; i++) {
            const segmentLen = segments[i];
            for (let j = 0; j < segmentLen; j++) {
                if (!this.cells[row][col].setMaxCandidate(segmentLen)) {
                    return false;
                }
                col++;
            }
        }

        return true;
    }

    setColSegments(col, segments) {
        this.colSegments[col] = segments;

        let row = 0;
        for (let i = 0; i < segments.length; i++) {
            const segmentLen = segments[i];
            for (let j = 0; j < segmentLen; j++) {
                if (!this.cells[row][col].setMaxCandidate(segmentLen)) {
                    return false;
                }
                row++;
            }
        }

        return true;
    }

    /**
     * Returns the boundaries of the cell at the given row and column.
     *
     * @param {number} row
     * @param {number} col
     * @returns {Array<boolean>} [left, right, top, bottom]
     */
    getBoundaries(row, col) {
        let result = [col === 0, col === this.size - 1, row === 0, row === this.size - 1];

        const rowSegments = this.rowSegments[row];
        let curCol = 0;
        for (let segmentIndex = 0; segmentIndex < rowSegments.length; segmentIndex++) {
            curCol += rowSegments[segmentIndex];
            if (curCol === col) {
                result[0] = true;
            } else if (curCol == col + 1) {
                result[1] = true;
            }
        }

        const colSegments = this.colSegments[col];
        let curRow = 0;
        for (let segmentIndex = 0; segmentIndex < colSegments.length; segmentIndex++) {
            curRow += colSegments[segmentIndex];
			if (curRow === row) {
				result[2] = true;
			} else if (curRow == row + 1) {
				result[3] = true;
			}
        }

        return result;
    }
}
