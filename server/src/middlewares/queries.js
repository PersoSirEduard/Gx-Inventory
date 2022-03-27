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
exports.remove = exports.update = exports.create = exports.query = exports.findFirstDeleted = exports.getCount = exports.getByParam = exports.doesExist = void 0;
function parseFilters(filterObj) {
    let searchArgs = [];
    for (let i = 0; i < filterObj.filters.length; i++) {
        const filter = filterObj.filters[i];
        if (!filter.value || !filter.selected)
            continue;
        searchArgs.push(`LOWER(${filter.selected}) LIKE LOWER('%${filter.value}%')`);
    }
    const searchString = searchArgs.join(" AND ");
    return searchString;
}
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
function getCount(pool, table, subject, filterObj) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _) => {
            const searchString = parseFilters(filterObj);
            pool.query(`SELECT COUNT(id) FROM ${table} ${filterObj.preArgument} WHERE ${searchString} ${searchString.length > 0 ? 'AND' : ""} deleted IS FALSE`, (err, result) => {
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
exports.getCount = getCount;
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
function query(pool, table, subject, amount = 30, filterObj, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        let entryCount = (yield getCount(pool, table, subject, filterObj)).value;
        if (entryCount == null)
            entryCount = 1;
        const totalPages = Math.ceil(entryCount / (amount > 0 ? amount : 30));
        return new Promise((resolve, _) => {
            if (page - 1 > totalPages)
                return resolve({
                    message: "Invalid page number",
                    status: 400,
                    value: null
                });
            var searchString = parseFilters(filterObj);
            pool.query(`SELECT * FROM ${table} ${filterObj.preArgument} WHERE ${searchString} ${searchString.length > 0 ? 'AND' : ""} deleted IS FALSE ORDER BY id ASC ${amount >= 0 ? 'LIMIT ' + String(amount) : ""} ${amount >= 0 ? 'OFFSET ' + String((page - 1) * amount) : ""}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return resolve({
                        message: `Error querying ${subject}s`,
                        status: 500,
                        value: null,
                        pages: totalPages,
                        count: entryCount
                    });
                }
                return resolve({
                    message: `${subject}s retrieved`,
                    status: 200,
                    value: result.rows,
                    pages: totalPages,
                    count: entryCount
                });
            });
        });
    });
}
exports.query = query;
function create(pool, table, inputs, subject) {
    return __awaiter(this, void 0, void 0, function* () {
        const availableIndex = yield findFirstDeleted(pool, table, subject);
        return new Promise((resolve, _) => {
            inputs = Object.assign(inputs, { modified_at: 'NOW()' });
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
function update(pool, table, id, inputs, subject) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _) => {
            inputs = Object.assign(inputs, { modified_at: 'NOW()' });
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
function remove(pool, table, id, subject) {
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
exports.remove = remove;
//# sourceMappingURL=queries.js.map