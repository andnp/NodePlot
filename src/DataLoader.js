import _ from 'lodash';
import csv from 'csv';
import fs from 'fs';
import Promise from 'bluebird';
import Glob from 'glob';

import Operations from '~/Operation';
import MatDash from '~/utils/MatrixUtils';

const readFilePromise = Promise.promisify(fs.readFile);
const writeFilePromise = Promise.promisify(fs.writeFile);
const csvParse = Promise.promisify(csv.parse);
const globPromise = Promise.promisify(Glob);

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

Operations.createOperation('ReadGlob', [], 'map', async (data) => {
    const glob = data.location;

    const files = await globPromise(glob);
    return files.map((file) => {
        const obj = _.cloneDeep(data);
        obj.location = file;
        return obj;
    });
});

Operations.createOperation('WriteCSV', ['matrix'], '', async (data, file) => {
    let str = '';
    const matrix = data.matrix;
    const { rows, cols } = MatDash.dims(matrix);
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
            str += `${matrix[i][j]}${j === cols-1 ? '' : ','}`;
        }
        str += '\n';
    }

    return writeFilePromise(file, str);
});
