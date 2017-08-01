import test from 'ava';
import _ from 'lodash';
import Operations from 'Operation';

import 'Control';

// Should be able to map an operation to each data point in a mapped object
test(`Map takes a mapped data object and applies an op to each piece of data`, async t => {
    const data = {
        map: [
            {test: 1},
            {test: 2},
            {test: 3}
        ]
    };
    const fakeOp = async (data) => {
        data.test++;
        return data;
    };

    await Operations.Map(data, fakeOp);

    _.times(3, (i) => {
        t.is(data.map[i].test, i + 2);
    });
});

// Should be able append matrices by column
test(`Append column takes mapped matrices and outputs a single data object with matrices joined`, async t => {
    const matrix1 = [
        [1, 2, 3],
        [4, 5, 6]
    ];
    const matrix2 = [
        [3, 2, 1],
        [6, 5, 4]
    ];

    const expected = [
        [1, 2, 3, 3, 2, 1],
        [4, 5, 6, 6, 5, 4]
    ];

    const data = {
        map: [
            {matrix: matrix1},
            {matrix: matrix2}
        ]
    };

    await Operations.AppendColumn(data);

    t.deepEqual(data.matrix, expected);
});

// Should be able append matrices by row
test(`Append row takes mapped matrices and outputs a single data object with matrices joined`, async t => {
    const matrix1 = [
        [1, 2, 3],
        [4, 5, 6]
    ];
    const matrix2 = [
        [3, 2, 1],
        [6, 5, 4]
    ];

    const expected = [
        [1, 2, 3],
        [4, 5, 6],
        [3, 2, 1],
        [6, 5, 4]
    ];

    const data = {
        map: [
            { matrix: matrix1 },
            { matrix: matrix2 }
        ]
    };

    await Operations.AppendRow(data);

    t.deepEqual(data.matrix, expected);
});
