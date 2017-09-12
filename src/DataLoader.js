import _ from 'lodash';
import fs from 'fs';
import Promise from 'bluebird';
import Glob from 'glob';

import Operations from '~/Operation';
import MatDash from '~/utils/MatrixUtils';
import createPool from '~/utils/Worker';

const readFilePromise = Promise.promisify(fs.readFile);
const writeFilePromise = Promise.promisify(fs.writeFile);
const globPromise = Promise.promisify(Glob);

Operations.createOperation('FileLoader', [], 'raw', (data) => {
    return readFilePromise(data.location);
});

const parseCsvString = (str) => {
    const rows = str.split('\n');
    const mat = [];
    for (let i = 0; i < rows.length; ++i) {
        const cols = rows[i].split(',');
        if (cols.length === 1 && cols[0] === '') continue;
        const row = [];
        for (let j = 0; j < cols.length; ++j) {
            if (!(j === cols.length - 1 && cols[j] === '')) row.push(parseFloat(cols[j]));
        }
        mat.push(row);
    }
    return mat;
};
const CSVParsePool = createPool(parseCsvString);

Operations.createOperation('CSVReader', ['raw'], 'matrix', (data) => {
    const buffer = data.raw;
    const str = buffer.toString();
    return CSVParsePool.use(str);
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
