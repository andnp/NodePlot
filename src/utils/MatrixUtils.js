const forEach = (matrix, f) => {
    const rows = matrix.length;
    const cols = matrix[0].length;
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

export default {
    forEach,
    makeArray
};
