import { Grid } from "./grid";

function getLargestViableValue(grid, r, c, largestValue) {
    const oldValue = grid[r][c];
    for (let newValue = largestValue; newValue > oldValue; newValue--) {
        // Temporarily assign
        grid[r][c] = newValue;

        // Check row & column
        let isValid = checkRow(grid, r) && checkColumn(grid, c);

        // Revert
        grid[r][c] = oldValue;

        if (isValid) {
            return newValue;
        }
    }
    return 0;
}

/************************************************************
 *  Utility: isSegmentValid(segment)
 *  A segment of length M is valid if it contains exactly
 *  the digits [1..M].
 ************************************************************/
function isSegmentValid(segment) {
    const M = segment.length;
    // If any digit is outside [1..M], it's invalid
    if (segment.some((d) => d < 1 || d > M)) {
        return false;
    }
    // Must have exactly M distinct digits
    const uniqueDigits = new Set(segment);
    return uniqueDigits.size === M;
}

/************************************************************
 *  Utility: checkLineValidity(line)
 *  Splits into segments, checks each segment for validity.
 ************************************************************/
function checkLineValidity(line) {
    const n = line.length;

    // dp[i] = true if line[0..i-1] can be segmented into valid segments
    const dp = new Array(n + 1).fill(false);
    dp[0] = true; // empty subarray is trivially valid

    for (let i = 1; i <= n; i++) {
        // We want to see if there's any j < i such that dp[j] = true
        // and line[j..i-1] is a valid segment.
        for (let j = 0; j < i; j++) {
            if (dp[j]) {
                const segment = line.slice(j, i); // subarray from j to i-1
                if (isSegmentValid(segment)) {
                    dp[i] = true;
                    break; // No need to look further once dp[i] is true
                }
            }
        }
    }

    return dp[n]; // true if the entire line can be segmented
}

/************************************************************
 *  Check a single row for validity
 ************************************************************/
function checkRow(grid, r) {
    return checkLineValidity(grid[r]);
}

/************************************************************
 *  Check a single column for validity
 ************************************************************/
function checkColumn(grid, c) {
    const col = grid.map((row) => row[c]);
    return checkLineValidity(col);
}

/**
 * Returns an array of segment lengths for a valid One Up segmentation
 * of "line". Uses a DP approach:
 *   - dp[i] stores the index j where the segment line[j..i-1] is valid
 *     and dp[j] was also valid. (-1 if no such j exists.)
 *   - If dp[line.length] != -1, we can reconstruct the segments by
 *     following these links backwards.
 *
 * Example:
 *   line = [1, 3, 1, 2]
 *   A valid segmentation is [1] | [3,1,2].
 *   Segment lengths might be [1, 3].
 */
function calculateLineSegmentLengths(line) {
    const n = line.length;

    // We'll store dp[i] = j meaning line[j..i-1] is a valid segment,
    // and dp[j] != -1, so line[0..j-1] can be segmented too.
    const dp = new Array(n + 1).fill(-1);
    dp[0] = 0;

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] !== -1 && isSegmentValid(line.slice(j, i))) {
                dp[i] = j;
                break;
            }
        }
    }

    // If dp[n] == -1, there's no valid segmentation
    if (dp[n] === -1) {
        return [];
    }

    // Reconstruct the segment lengths by walking backwards
    const segmentLengths = [];
    let cur = n;
    while (cur > 0) {
        const start = dp[cur]; // j that led to i=cur
        segmentLengths.push(cur - start); // Length of this segment
        cur = start;
    }

    segmentLengths.reverse(); // Now in correct order
    return segmentLengths; // List of segment lengths
}

function calculateSegmentLengths(grid) {
    const N = grid.size;
    const rowSegments = [];
    const colSegments = [];

    // ----- Handle Rows -----
    for (let r = 0; r < N; r++) {
        const segmentLengths = calculateLineSegmentLengths(grid.getRow(r).map((cell) => cell.getValue()));
        rowSegments.push(segmentLengths);
    }

    // ----- Handle Columns -----
    for (let c = 0; c < N; c++) {
        const segmentLengths = calculateLineSegmentLengths(grid.getCol(c).map((cell) => cell.getValue()));
        colSegments.push(segmentLengths);
    }

    return { rowSegments, colSegments };
}

export class GridGenerator {
    /**
     * Generates a new grid of the given size.
     *
     * @param {number} size
     *
     * @returns {Grid} The generated grid
     */
    static generate(size) {
        const N = size;
        var grid = Array.from({ length: N }, () => Array(N).fill(1));

        while (true) {
            // Find the largest value currently placed
            let largestValue = 0;
            for (let r = 0; r < N; r++) {
                for (let c = 0; c < N; c++) {
                    largestValue = Math.max(largestValue, grid[r][c]);
                }
            }

            // The largest possible value in the grid is one larger than the largest placed, capped at N
            if (largestValue < N) {
                largestValue++;
            }

            let candidates = [];
            let largestViableValue = 0;
            for (let r = 0; r < N; r++) {
                for (let c = 0; c < N; c++) {
                    const curLargestViableValue = getLargestViableValue(grid, r, c, largestValue);
                    if (curLargestViableValue > 0) {
                        if (curLargestViableValue > largestViableValue) {
                            candidates = [];
                            largestViableValue = curLargestViableValue;
                        } else if (curLargestViableValue < largestViableValue) {
                            continue;
                        }

                        candidates.push([r, c, curLargestViableValue]);
                    }
                }
            }

            // If no candidates, we're done
            if (candidates.length === 0) {
                break;
            }

            // Randomly pick one cell
            const [r, c, newValue] = candidates[Math.floor(Math.random() * candidates.length)];
            grid[r][c] = newValue;
        }

        const result = new Grid(N);
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                result.getCell(r, c).setValue(grid[r][c]);
            }
        }

        const { rowSegments, colSegments } = calculateSegmentLengths(result);
        for (let r = 0; r < N; r++) {
            result.setRowSegments(r, rowSegments[r]);
        }
		for (let c = 0; c < N; c++) {
			result.setColSegments(c, colSegments[c]);
		}
        return result;
    }
}
