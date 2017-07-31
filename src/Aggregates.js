import Operations from 'Operation';
import MatDash from 'utils/MatrixUtils';

Operations.createOperation('HorizontalAverage', ['matrix'], 'horizontal_averages', (data) => {
    const { matrix, rows, cols } = data;
    const rowVals = MatDash.makeArray(rows);
    MatDash.forEach(matrix, (m, i) => {
        rowVals[i] += m;
    });

    const avgs = rowVals.map((row) => row/cols);
    return avgs;
});

Operations.createOperation('VerticalAverage', ['matrix'], 'vertical_averages', (data) => {
    const { matrix, rows, cols } = data;
    const colVals = MatDash.makeArray(cols);
    MatDash.forEach(matrix, (m, i_, j) => {
        colVals[j] += m;
    });

    const avgs = colVals.map((col) => col/rows);
    return avgs;
});
