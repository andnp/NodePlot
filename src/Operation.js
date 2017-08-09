import Promise from 'bluebird';
import _ from 'lodash';
import Graph from '~/Graph';

const Operations = {};
const ExportTypes = {};

const addReturn = (data, type, ret) => {
    if (type === '') return data;
    if (type === 'chart') {
        if (_.isUndefined(data[type])) data[type] = [];
        data[type].push(ret);
    } else {
        data[type] = ret;
    }

    return data;
}

// const ancestorExportsDep = (graph, dep) => {
//     if (graph.exportTypes.includes(dep)) return graph;
//     if (graph.children.length === 0) return false;
//     return _.some(graph.children.map((child) => ancestorExportsDep(child, dep)));
// };

const addGraphToOp = (context, exportTypes, opfunc, ...options) => {
    context.graph = new Graph();
    context.node = context.graph.Node((d) => {
        return Promise.resolve(opfunc(d, ...options))
            .then((op_values) => {
                // If there are multiple return values, grab each and add it to the data object
                if (exportTypes.length > 1) {
                    exportTypes.forEach((type, i) => {
                        d = addReturn(d, type, op_values[i]);
                    });
                } else {
                    const type = exportTypes[0];
                    d = addReturn(d, type, op_values);
                }
                return d;
            });
    });
}

const createOpBuilder = (name, deps, exportTypes, opfunc) => {
    const OpBuilder = function (...options) {
        const Operation = function () {
            addGraphToOp(this, exportTypes, opfunc, ...options);
            this.name = name;
            this.exportTypes = exportTypes;
            this.dependencies = deps;

            // this.backfill = (node) => {
            //     node.dependencies.forEach((dep) => {
            //         if (!ancestorExportsDep(this, dep)) {
            //             // TODO: This needs to be chosen in a smarter way.
            //             // Perhaps I should choose the operation with the minimum depth sub-graph
            //             const op_name = ExportTypes[dep][0];
            //             const op = new Operations[op_name]();
            //             this.backfill(op);
            //             this.graph.connect(op.node, node.node);
            //         }
            //     });
            // };
            this.addChild = (node) => {
                node.graph = this.graph;
                this.graph.connect(this.node, node.node);
                // This is where I need to resolve inferred in-between nodes
                // this.backfill(node);
            };
            this.and = (NextOpClass, ...args) => {
                let Op;
                if (NextOpClass.isOpBuilder) {
                    Op = NextOpClass(...args);
                } else {
                    const builder = createOpBuilder('', [''], [''], NextOpClass);
                    Op = builder(...args);
                }
                this.addChild(Op);
                return Op;
            };

            this.execute = (data) => {
                return this.graph.execute(data);
            };
        };

        return new Operation();
    };

    OpBuilder.isOpBuilder = true;
    return OpBuilder;
};

Operations.createOperation = (name, deps, exportTypes, opfunc) => {
    if (typeof exportTypes !== 'object') exportTypes = [exportTypes];

    const OpBuilder = createOpBuilder(name, deps, exportTypes, opfunc);

    Operations[name] = OpBuilder;
    exportTypes.forEach((type) => {
        ExportTypes[type] ? ExportTypes[type].push(name) : ExportTypes[type] = [name];
    });

    return OpBuilder;
};

export default Operations;
