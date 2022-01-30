"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.findFirstDeleted = exports.update = exports.getByParam = exports.create = exports.getAll = exports.getMaxValue = exports.doesExist = void 0;
function doesExist(pool, table, param, value) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${param}='${value}')`, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(false);
                }
                resolve(result.rows[0].exists);
            });
        });
    });
}
exports.doesExist = doesExist;
function getMaxValue(pool, table, subject, filterObj) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _) => {
            let searchArgs = [];
            for (let i = 0; i < filterObj.filters.length; i++) {
                let filter = filterObj.filters[i];
                if (!filter.value || !filter.selected)
                    continue;
                searchArgs.push(`${i == 0 ? "WHERE" : ""} LOWER(${filter.selected}) LIKE LOWER('%${filter.value}%')`);
            }
            let searchString = searchArgs.join(" AND ");
            console.log(`SELECT COUNT(id) FROM ${table} ${filterObj.filterArg} ${searchString}`);
            pool.query(`SELECT COUNT(id) FROM ${table} ${filterObj.filterArg} ${searchString}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return resolve({
                        message: `Error querying ${subject}s`,
                        status: 500,
                        value: null
                    });
                }
                return resolve({
                    message: `${subject}s retrieved`,
                    status: 200,
                    value: result.rows[0].count
                });
            });
        });
    });
}
exports.getMaxValue = getMaxValue;
function getAll(pool, table, subject, amount = 30, filterObj, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        var maxVal = (yield getMaxValue(pool, table, subject, filterObj)).value;
        console.log(`max val: ${maxVal}`);
        if (maxVal == null)
            maxVal = 1;
        const totalPages = Math.ceil(maxVal / (amount >= 0 ? amount : 30));
        console.log(`pages: ${maxVal}`);
        return new Promise((resolve, _) => {
            if (page > totalPages)
                return resolve({
                    message: "Invalid page number",
                    status: 400,
                    value: null
                });
            let searchArgs = [];
            for (let i = 0; i < filterObj.filters.length; i++) {
                let filter = filterObj.filters[i];
                if (!filter.value || !filter.selected)
                    continue;
                searchArgs.push(`AND LOWER(${filter.selected}) LIKE LOWER('%${filter.value}%') `);
            }
            let searchString = searchArgs.join("");
            console.log(`SELECT * FROM ${table} ${filterObj.filterArg} WHERE id > ${(page - 1) * (amount >= 0 ? amount : 30)} AND deleted IS FALSE ${searchString} ORDER BY id ASC ${amount >= 0 ? 'LIMIT ' + String(amount) : ""}`);
            pool.query(`SELECT * FROM ${table} ${filterObj.filterArg} WHERE id > ${(page - 1) * (amount >= 0 ? amount : 30)} AND deleted IS FALSE ${searchString} ORDER BY id ASC ${amount >= 0 ? 'LIMIT ' + String(amount) : ""}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return resolve({
                        message: `Error querying ${subject}s`,
                        status: 500,
                        value: null,
                        pages: totalPages
                    });
                }
                return resolve({
                    message: `${subject}s retrieved`,
                    status: 200,
                    value: result.rows,
                    pages: totalPages
                });
            });
        });
    });
}
exports.getAll = getAll;
function create(pool, table, inputs, subject) {
    return __awaiter(this, void 0, void 0, function* () {
        const availableIndex = yield findFirstDeleted(pool, table, subject);
        return new Promise((resolve, _) => {
            if (availableIndex.value != undefined && availableIndex.value != null) {
                var objs = "";
                Object.entries(inputs).forEach(([key, value]) => {
                    objs += `${key}='${value}', `;
                });
                objs = objs.substring(0, objs.length - 2);
                pool.query(`UPDATE ${table} SET deleted=false, ${objs} WHERE id=${availableIndex.value} RETURNING *`, (err, result) => {
                    if (err) {
                        console.log(err);
                        return resolve({
                            message: `Error creating ${subject}`,
                            status: 500,
                            value: null
                        });
                    }
                    return resolve({
                        message: `${subject} created`,
                        status: 200,
                        value: result.rows[0]
                    });
                });
            }
            const keys = (Object.keys(inputs)).join(", ");
            const values = "'" + (Object.values(inputs)).join("', '") + "'";
            pool.query(`INSERT INTO ${table} (${keys}) VALUES (${values}) RETURNING *`, (err, result) => {
                if (err) {
                    console.log(err);
                    return resolve({
                        message: `Error creating a new ${subject}`,
                        status: 500,
                        value: null
                    });
                }
                return resolve({
                    message: `${subject} created`,
                    status: 201,
                    value: result.rows[0]
                });
            });
        });
    });
}
exports.create = create;
function getByParam(pool, table, param, value, subject) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _) => {
            pool.query(`SELECT * FROM ${table} WHERE ${param}='${value}'`, (err, result) => {
                if (err) {
                    console.log(err);
                    return resolve({
                        message: `Error querying ${subject}`,
                        status: 500,
                        value: null
                    });
                }
                return resolve({
                    message: `${subject} retrieved`,
                    status: 200,
                    value: result.rows[0]
                });
            });
        });
    });
}
exports.getByParam = getByParam;
function update(pool, table, id, inputs, subject) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _) => {
            var objs = "";
            Object.entries(inputs).forEach(([key, value]) => {
                objs += `${key}='${value}', `;
            });
            objs = objs.substring(0, objs.length - 2);
            pool.query(`UPDATE ${table} SET ${objs} WHERE id=${id} RETURNING *`, (err, result) => {
                if (err) {
                    console.log(err);
                    return resolve({
                        message: `Error updating ${subject}`,
                        status: 500,
                        value: null
                    });
                }
                return resolve({
                    message: `${subject} updated`,
                    status: 200,
                    value: result.rows[0]
                });
            });
        });
    });
}
exports.update = update;
function findFirstDeleted(pool, table, subject) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _) => {
            pool.query(`SELECT id FROM ${table} WHERE deleted IS TRUE LIMIT 1`, (err, result) => {
                if (err) {
                    console.log(err);
                    return resolve({
                        message: `Error querying ${subject}s`,
                        status: 500,
                        value: null
                    });
                }
                return resolve({
                    message: `${subject}s retrieved`,
                    status: 200,
                    value: result.rows.length > 0 ? result.rows[0].id : null
                });
            });
        });
    });
}
exports.findFirstDeleted = findFirstDeleted;
function del(pool, table, id, subject) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _) => {
            pool.query(`UPDATE ${table} SET deleted=true WHERE id=${id} RETURNING *`, (err, result) => {
                if (err) {
                    console.log(err);
                    return resolve({
                        message: `Error deleting ${subject}`,
                        status: 500,
                        value: null
                    });
                }
                return resolve({
                    message: `${subject} deleted`,
                    status: 200,
                    value: result.rows[0]
                });
            });
        });
    });
}
exports.del = del;
//# sourceMappingURL=queries.js.map