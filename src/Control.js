import _ from 'lodash';
import Promise from 'bluebird';

import MatDash from '~/utils/MatrixUtils';
import Operations from '~/Operation';

Operations.createOperation('Map', ['map'], 'map', (data, op) => {
    const array = data.map;
    const promises = array.map((dat) => op(dat));
    return Promise.all(promises);
});

Operations.createOperation('AppendColumn', ['map'], 'matrix', (data) => {
    const array = data.map;
    const matrix = [];
    array.forEach((d) => {
        MatDash.iterateColumns(d.matrix, (col) => matrix.push(col));
    });

    const trans = MatDash.transpose(matrix);
    return trans;
});

Operations.createOperation('AppendRow', ['map'], 'matrix', (data) => {
    const array = data.map;
    const matrix = [];
    array.forEach((d) => {
        MatDash.iterateRows(d.matrix, (row) => matrix.push(row));
    });

    return matrix;
});
