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
const queries_1 = require("../../middlewares/queries");
const { auth } = require('../../middlewares/authentication.js');
module.exports = (inv) => {
    inv.app.post('/api/equipment_type', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description } = req.body;
        if (!name)
            return res.status(400).send({ message: "Missing name", status: 400 });
        if (yield (0, queries_1.doesExist)(inv.pool, 'equipment_types', 'equipment_type_name', name))
            return res.status(400).send({ message: 'Name already exists', status: 400 });
        const response = yield (0, queries_1.create)(inv.pool, 'equipment_types', {
            equipment_type_name: name,
            equipment_type_description: description
        }, "Equipment Type");
        return res.status(response.status).send(response);
    }));
    inv.app.post('/api/equipment_type/all', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.amount != undefined)
            req.body.amount = parseInt(req.body.amount);
        let filterObj = { filters: [], preArgument: "" };
        if (req.body.filters != undefined) {
            for (let f = 0; f < req.body.filters.length; f++) {
                let filter = req.body.filters[f];
                if (filter.selected && filter.value) {
                    if (filter.selected.includes(" ") || filter.selected.includes(";"))
                        continue;
                    if (filter.value.includes(" ") || filter.value.includes(";"))
                        continue;
                    if (filter.selected == "name")
                        filter.selected = "equipment_type_name";
                    if (filter.selected == "description")
                        filter.selected = "equipment_type_description";
                    filterObj.filters.push(filter);
                }
            }
        }
        const response = yield (0, queries_1.query)(inv.pool, 'equipment_types', "Equipment Type", req.body.amount != undefined ? req.body.amount : 30, filterObj);
        return res.status(response.status).send(response);
    }));
    inv.app.get('/api/equipment_type/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.id)
            return res.status(400).send({ message: "Missing id", status: 400 });
        const id = parseInt(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).send({ message: "Invalid id", status: 400 });
        const response = yield (0, queries_1.getByParam)(inv.pool, 'equipment_types', 'id', id, "Equipment Type");
        return res.status(response.status).send(response);
    }));
    inv.app.get('/api/equipment_type', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = req.body;
        if (!name)
            return res.status(400).send({ message: "Missing name", status: 400 });
        if (!(yield (0, queries_1.doesExist)(inv.pool, 'equipment_types', 'equipment_type_name', name)))
            return res.status(400).send({ message: 'Name does not exist', status: 400 });
        const response = yield (0, queries_1.getByParam)(inv.pool, 'equipment_types', 'equipment_type_name', name, "Equipment Type");
        return res.status(response.status).send(response);
    }));
    inv.app.put('/api/equipment_type/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.id)
            return res.status(400).send({ message: "Missing id", status: 400 });
        const id = parseInt(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).send({ message: "Invalid id", status: 400 });
        const { name, description } = req.body;
        let obj = {};
        if (req.body.name != undefined)
            obj = Object.assign(obj, { equipment_type_name: name });
        if (req.body.description != undefined)
            obj = Object.assign(obj, { equipment_type_description: description });
        if (!(yield (0, queries_1.doesExist)(inv.pool, 'equipment_types', 'id', id)))
            return res.status(400).send({ message: 'Id does not exist', status: 400 });
        const response = yield (0, queries_1.update)(inv.pool, 'equipment_types', id, obj, "Equipment Type");
        return res.status(response.status).send(response);
    }));
    inv.app.delete('/api/equipment_type/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.id)
            return res.status(400).send({ message: "Missing id", status: 400 });
        const id = parseInt(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).send({ message: "Invalid id", status: 400 });
        if (!(yield (0, queries_1.doesExist)(inv.pool, 'equipment_types', 'id', id)))
            return res.status(400).send('Id does not exist');
        const response = yield (0, queries_1.remove)(inv.pool, 'equipment_types', id, "Equipment Type");
        return res.status(response.status).send(response);
    }));
    inv.app.delete('/api/equipment_type', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = req.body;
        if (!name)
            return res.status(400).send({ message: "Missing name", status: 400 });
        if (!(yield (0, queries_1.doesExist)(inv.pool, 'equipment_types', 'equipment_type_name', name)))
            return res.status(400).send({ message: 'Name does not exist', status: 400 });
        const { value } = yield (0, queries_1.getByParam)(inv.pool, 'equipment_types', 'equipment_type_name', name, "Equipment Type");
        const response = yield (0, queries_1.remove)(inv.pool, 'equipment_types', value.id, "Equipment Type");
        return res.status(response.status).send(response);
    }));
};
//# sourceMappingURL=equipmentType.js.map