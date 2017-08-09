import test from 'ava';

import Graph from 'Graph';

test('Can create a simple graph', async t => {
    const g = new Graph();
    const n1 = g.Node((d) => d.a = 1);
    const n2 = g.Node((d) => d.c = d.b + 1);
    g.connect(n1, n2);
    const n3 = g.Node((d) => d.b = d.a + 1);

    // make graph now n1 -> n3 -> n2
    g.insertBetween(n1, n3, n2);

    const data = {};
    await g.execute(data);

    t.deepEqual(data, {a: 1, b: 2, c: 3});
});

test('Can deal with multiple dependencies', async t => {
    const g = new Graph();
    const n1 = g.Node((d) => d.n1 = 1);
    const n2a = g.Node((d) => d.n2a = d.n1 + 2);
    const n2b = g.Node((d) => d.n2b = d.n1 + 1);
    let called = 0;
    const n3 = g.Node((d) => d.n3 = ++called);
    g.connect(n1, n2a);
    g.connect(n1, n2b);
    g.connect(n2a, n3);
    g.connect(n2b, n3);

    const data = {};
    await g.execute(data);

    t.deepEqual(data, { n1: 1, n2a: 3, n2b: 2, n3: 1 });
});

