import Promise from 'bluebird';
import _ from 'lodash';

const Operations = {};
const ExportTypes = {};

const addReturn = (data, type, ret) => {
    if (type === '') return;
    if (type === 'chart') {
        if (_.isUndefined(data[type])) data[type] = [];
        data[type].push(ret);
    } else if (type === 'map') {
        data = {};
        data.map = ret;
    } else {
        data[type] = ret;
    }

    return data;
}

Operations.createOperation = (name, deps, exportTypes, opfunc) => {
    if (typeof exportTypes !== 'object') exportTypes = [exportTypes];

    const operation = function (data, ...args) {
        const prior_promises = deps.map((dep) => {
            if (!data[dep]) {
                // Dependency not met
                const allPriors = ExportTypes[dep].map((depName) => {
                    return Operations[depName](data);
                });

                return Promise.any(allPriors);
            }
            return Promise.resolve();
        });

        // Once all dependencies have been computed, perform this operation
        return Promise.all(prior_promises).then(() => {
            return opfunc(data, ...args);
        }).then((op_values) => {
            // If there are multiple return values, grab each and add it to the data object
            if (exportTypes.length > 1) {
                exportTypes.forEach((type, i) => {
                    data = addReturn(data, type, op_values[i]);
                });
            } else {
                const type = exportTypes[0];
                data = addReturn(data, type, op_values);
            }

            return data;
        })
        // One of the dependencies failed.
        .tapCatch((err) => {
            console.log('Dependency error', err);
        });

    };

    operation.dependencies = deps;

    Operations[name] = operation;
    exportTypes.forEach((type) => {
        ExportTypes[type] ? ExportTypes[type].push(name) : ExportTypes[type] = [name];
    });

    return operation;
};

export default Operations;
