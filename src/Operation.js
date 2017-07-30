import Promise from 'bluebird';

const Operations = {};
const ExportTypes = {};

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
                    data[type] = op_values[i];
                });
            } else {
                const type = exportTypes[0];
                data[type] = op_values;
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
