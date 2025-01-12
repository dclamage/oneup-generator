import { GridRenderer } from "./components/render";
import { GridGenerator } from "./components/generate";
import { isGoodGrid } from "./components/gridEvaluator";

const sizeInput = document.getElementById('size-input');
const generateButton = document.getElementById('generate-button');
const gridContainer = document.getElementById('grid-container');

generateButton.addEventListener('click', () => {
	const size = parseInt(sizeInput.value);

	let grid = null;
	let curGridIsGood = false;
	while (!curGridIsGood) {
        grid = GridGenerator.generate(size);
        curGridIsGood = isGoodGrid(grid);
    }

	const renderer = new GridRenderer(gridContainer);
	renderer.render(grid);
});