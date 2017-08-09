import test from 'ava';

import Operations from 'Operation';

let called = 0;
Operations.createOperation('baseOp', [], 'out1', (data_) => {
    return called++;
});

Operations.createOperation('secondOp', ['out1'], 'out2', (data) => {
    return data.out1 + 1;
});

Operations.createOperation('thirdOp', ['out2'], 'out3', (data) => {
    return data.out2 + 1;
});

// Operations.createOperation('noDep', ['out3'], 'out4', (data) => {
//     return data.out3 - 1;
// });

// Operations.createOperation('deps', ['out3', 'out4'], 'out5', (data) => {
//     return data.out3 + data.out4;
// });

test('Can chain operations and execute graph multiple times', async t => {
    const data = {};
    const data2 = {};
    const data3 = {};

    const comp_graph = Operations.baseOp()
    .and(Operations.secondOp)
    .and(Operations.thirdOp);

    await comp_graph.execute(data);
    await comp_graph.execute(data2);
    await comp_graph.execute(data3);

    t.deepEqual(data, { out1: 0, out2: 1, out3: 2 });
    t.deepEqual(data2, { out1: 1, out2: 2, out3: 3 });
    t.deepEqual(data3, { out1: 2, out2: 3, out3: 4 });
});
