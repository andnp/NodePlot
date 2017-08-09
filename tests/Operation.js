import test from 'ava';

import Operations from 'Operation';

test.beforeEach(() => {
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

test('Can append anonymous functions as operations', async t => {
    const data = {};

    const comp_graph = Operations.baseOp()
    .and((d) => d.test = 1)
    .and(Operations.secondOp);

    await comp_graph.execute(data);

    t.deepEqual(data, { out1: 0, out2: 1, test: 1 });
});

test('Can merge two graphs into a single chain', async t => {
    const data = {};

    const g1 = Operations.baseOp()
    .and((d) => d.thing = 1);

    const g2 = Operations.secondOp()
    .and((d) => d.thing++)
    .and(Operations.thirdOp);

    g1.and(g2);

    await g1.execute(data);

    t.deepEqual(data, { out1: 0, out2: 1, thing: 2, out3: 2 });
});
