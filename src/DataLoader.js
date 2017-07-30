import csv from 'csv';
import fs from 'fs';
import Promise from 'bluebird';

import Operations from 'Operation';

const readFilePromise = Promise.promisify(fs.readFile);
const csvParse = Promise.promisify(csv.parse);

Operations.createOperation('FileLoader', [], 'raw', (data) => {
    return readFilePromise(data.location);
});

Operations.createOperation('CSVReader', ['raw'], 'raw_set', (data) => {
    return csvParse(data.raw);
});

Operations.createOperation('NumericMatrix', ['raw_set'], ['matrix', 'rows', 'cols'], (data) => {
    const matrix = data.raw_set;
    const newMatrix = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    for (let i = 0; i < rows; ++i) {
        const rowdat = [];
        for (let j = 0; j < cols; ++j) {
            rowdat.push(parseFloat(matrix[i][j]));
        }
        newMatrix.push(rowdat);
    }
    return [newMatrix, rows, cols];
});
