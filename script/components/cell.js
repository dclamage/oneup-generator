export class Cell {
    constructor(size) {
        this.value = 0;
        this.candidates = (1 << size) - 1;
    }

	setValue(value) {
		this.value = value;
		this.candidates = 0;
	}

	hasValue() {
		return this.value !== 0;
	}

	getValue() {
		return this.value;
	}

	clearCandidate(value) {
		this.candidates &= ~(1 << (value - 1));
	}

	setMaxCandidate(value) {
		if (this.value !== 0) {
			return this.value <= value;
		}
		
		this.candidates = this.candidates & ((1 << value) - 1);
		return this.candidates !== 0;
	}

	isCandidate(value) {
		return this.value !== 0 ? this.value === value : (this.candidates & (1 << (value - 1))) !== 0;
	}

	isValid() {
		return this.value !== 0 || this.candidates !== 0;
	}
}
