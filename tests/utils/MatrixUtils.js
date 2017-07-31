import test from 'ava';
import MatDash from 'utils/MatrixUtils';

test('forEach iterates over each element of matrix', t => {
    const matrix = [
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ];

    MatDash.forEach(matrix, (m, i, j) => {
        t.is(m, matrix[i][j]);
    });
});

test('makeArray creates an array of size n initialized to 0s', t => {
    const n = 10;

    const array = MatDash.makeArray(n);

    for (let i = 0; i < n; ++i) {
        t.is(array[i], 0);
    }
});

test('makeArray creates an array of size n initialized to x', t => {
    const n = 10;
    const x = 3.14;

    const array = MatDash.makeArray(n, x);

    for (let i = 0; i < n; ++i) {
        t.is(array[i], x);
    }
});
