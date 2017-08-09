import uuid from 'uuid/v4';
import Promise from 'bluebird';
import _ from 'lodash';

const Node = function (funct) {
    this.id = uuid();
    this.outs = {};

    this.addOutput = (node) => {
        this.outs[node.id] = node;
    };
    this.removeOutput = (node) => {
        delete this.outs[node.id];
    };

    const executeChildren = (d, visited_nodes) => {
        const promises = [];
        _.forOwn(this.outs, (child) => {
            const child_promise = child.execute(d, visited_nodes);
            promises.push(child_promise);
        });
        return Promise.all(promises);
    };
    this.execute = (d, visited_nodes) => {
        if (visited_nodes.includes(this.id)) return Promise.resolve(d);
        visited_nodes.push(this.id);
        // Cast output of funct to a promise (regardless of if it was a promise originally)
        const promise = Promise.resolve(funct(d))
            .then(() => executeChildren(d, visited_nodes));
        return promise;
    };
};

const Graph = function () {
    this.entry;
    this.nodes = {};
    this.Node = (funct) => {
        const n = new Node(funct);
        // Defines the first created node as the entry point
        if (!this.entry) this.entry = n;
        this.nodes[n.id] = n;
        return n;
    };

    // Connects output of n1 to input of n2
    this.connect = (n1, n2) => {
        n1.addOutput(n2);
    };

    this.insertBetween = (n1, n2, n3) => {
        n1.removeOutput(n3);
        n1.addOutput(n2);
        n2.addOutput(n3);
    };

    this.execute = (d) => {
        const visited_nodes = [];
        return this.entry.execute(d, visited_nodes).then(() => d);
    };
};

export default Graph;
