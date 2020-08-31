"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase_1 = require("./shared/camelCase");
const filter_1 = require("./shared/filter");
const columnsDataTypes_1 = require("./cleanRows/columnsDataTypes");
exports.cleanRows = (rows) => {
    const columnTypes = columnsDataTypes_1.guessColumnsDataTypes(rows);
    return rows.map(row => Object.entries(row)
        .filter(([columnName]) => !filter_1.filter.includes(columnName))
        .map(obj => ({
        [camelCase_1.camelCase(obj[0])]: convertCell(columnTypes, obj[0], obj[1]),
    }))
        .reduce((row, cell) => Object.assign(row, cell), {}));
};
function convertCell(columnTypes, key, val) {
    switch (columnTypes[key]) {
        case 'number':
            return Number(val.replace(/,/g, ''));
        case 'boolean':
            // when column contains null we return false, otherwise check boolean value
            return val === null ? false : val === 'TRUE';
        default:
            return val === '' ? null : val;
    }
}
