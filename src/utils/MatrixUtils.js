const dims = (matrix) => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    return {rows, cols};
};

const forEach = (matrix, f) => {
    const { rows, cols } = dims(matrix);
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
            f(matrix[i][j], i, j);
        }
    }
};

const makeArray = (size, v=0) => {
    const array = [];
    for (let i = 0; i < size; ++i) {
        array.push(v);
    }
    return array;
};

const makeMatrix = (rows, cols, v=0) => {
    const matrix = [];
    for (let i = 0; i < rows; ++i) {
        const row = [];
        for (let j = 0; j < cols; ++j) {
            row.push(v);
        }
        matrix.push(row);
    }
    return matrix;
}

const iterateColumns = (matrix, f) => {
    const { rows, cols } = dims(matrix);
    for (let j = 0; j < cols; ++j) {
        const col = [];
        for (let i = 0; i < rows; ++i) {
            col.push(matrix[i][j]);
        }
        f(col);
    }
};

const iterateRows = (matrix, f) => {
    const { rows, cols } = dims(matrix);
    for (let i = 0; i < rows; ++i) {
        const row = [];
        for (let j = 0; j < cols; ++j) {
            row.push(matrix[i][j]);
        }
        f(row);
    }
};

const transpose = (matrix) => {
    const trans = [];
    const { rows, cols } = dims(matrix);
    for (let j = 0; j < cols; ++j) {
        const col = [];
        for (let i = 0; i < rows; ++i) {
            col.push(matrix[i][j])
        }
        trans.push(col);
    }
    return trans;
}

export default {
    dims,
    forEach,
    makeArray,
    makeMatrix,
    iterateColumns,
    iterateRows,
    transpose
};
