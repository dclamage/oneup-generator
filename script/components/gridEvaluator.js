import { Grid } from "./grid.js";

/**
 *
 * @param {Grid} grid
 * @returns {boolean} Whether the grid is good
 */
export function isGoodGrid(grid) {
    return getLargestValue(grid) > grid.size - 2 && !hasIslands(grid);
}

/**
 *
 * @param {Grid} grid
 * @returns {number} The largest value in the grid
 */
function getLargestValue(grid) {
    const N = grid.size;
    let largestValue = 0;
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            largestValue = Math.max(largestValue, grid.getCell(r, c).getValue());
        }
    }
    return largestValue;
}

/**
 * 
 * @param {Grid} grid 
 * @returns {boolean} Whether the grid has islands
 */
function hasIslands(grid) {
    const N = grid.size;

    if (N === 0) return false; // trivially no islands in empty grid

    const visited = new Set();
    const queue = [[0, 0]]; // Start BFS from top-left
    visited.add("0,0");

    while (queue.length > 0) {
        const [r, c] = queue.shift();
        const [left, right, top, bottom] = grid.getBoundaries(r, c);

        // -- Move Left --
        if (c > 0 && !left) {
            const leftKey = `${r},${c - 1}`;
            if (!visited.has(leftKey)) {
                visited.add(leftKey);
                queue.push([r, c - 1]);
            }
        }

        // -- Move Right --
        if (c < N - 1 && !right) {
            const rightKey = `${r},${c + 1}`;
            if (!visited.has(rightKey)) {
                visited.add(rightKey);
                queue.push([r, c + 1]);
            }
        }

        // -- Move Up --
        if (r > 0 && !top) {
            const upKey = `${r - 1},${c}`;
            if (!visited.has(upKey)) {
                visited.add(upKey);
                queue.push([r - 1, c]);
            }
        }

        // -- Move Down --
        if (r < N - 1 && !bottom) {
            const downKey = `${r + 1},${c}`;
            if (!visited.has(downKey)) {
                visited.add(downKey);
                queue.push([r + 1, c]);
            }
        }
    }

    // If not all cells were visited, there's at least one disconnected component
    return visited.size < N * N;
}
