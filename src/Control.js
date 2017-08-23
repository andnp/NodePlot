import _ from 'lodash';
import Promise from 'bluebird';

import MatDash from '~/utils/MatrixUtils';
import Operations from '~/Operation';

const flattenOnce = (arr) => {
    const out = [];
    for (let i = 0; i < arr.length; ++i) {
        for (let j = 0; j < arr[i].length; ++j) {
            out.push(arr[i][j]);
        }
    }
    return out;
}

Operations.createOperation('Map', ['map'], 'map', async (data, op, PROCESSORS = 32) => {
    const array = data.map;
    op = op.isOpBuilder ? op() : op;
    const func = op.isOperation ? op.execute : op;
    if (PROCESSORS > 0) {
        const chunks = _.chunk(array, PROCESSORS);
        const results = [];
        for (let i = 0; i < chunks.length; ++i) {
            results.push(
                await Promise.all(chunks[i].map((dat) => func(dat)))
            );
        }
        return flattenOnce(results);
    }

    return Promise.all(array.map((dat) => func(dat)));
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
