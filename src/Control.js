import _ from 'lodash';
import Promise from 'bluebird';

import MatDash from '~/utils/MatrixUtils';
import Operations from '~/Operation';

Operations.createOperation('Map', ['map'], 'map', (data, op) => {
    const array = data.map;
    const promises = array.map((dat) => op(dat));
    return Promise.all(promises);
});

Operations.createOperation('AppendColumn', ['map'], ['matrix', 'rows', 'cols'], (data) => {
    const array = data.map;
    const matrix = [];
    array.forEach((d) => {
        MatDash.iterateColumns(d.matrix, (col) => matrix.push(col));
    });

    const trans = MatDash.transpose(matrix);
    const { rows, cols } = MatDash.dims(trans);
    return [trans, rows, cols];
});

Operations.createOperation('AppendRow', ['map'], ['matrix', 'rows', 'cols'], (data) => {
    const array = data.map;
    const matrix = [];
    array.forEach((d) => {
        MatDash.iterateRows(d.matrix, (row) => matrix.push(row));
    });

    const { rows, cols } = MatDash.dims(matrix);
    return [matrix, rows, cols];
});
