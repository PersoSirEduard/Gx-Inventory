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
    inv.app.post('/api/agent', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { firstname, lastname, email } = req.body;
        if (!firstname)
            return res.status(400).send('Missing name');
        if (!lastname)
            return res.status(400).send('Missing type_id');
        let obj = {
            agent_firstname: firstname,
            agent_lastname: lastname
        };
        if (email != undefined)
            obj = Object.assign(obj, { agent_email: email });
        const response = yield (0, queries_1.create)(inv.pool, 'agents', obj, "Agent");
        return res.status(response.status).send(response);
    }));
    inv.app.post('/api/agent/all', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.amount != undefined)
            req.body.amount = parseInt(req.body.amount);
        let filterObj = { filters: [], filterArg: "" };
        if (req.body.filters != undefined) {
            for (let f = 0; f < req.body.filters.length; f++) {
                let filter = req.body.filters[f];
                if (filter.selected && filter.value) {
                    if (filter.selected.includes(" ") || filter.selected.includes(";"))
                        continue;
                    if (filter.value.includes(" ") || filter.value.includes(";"))
                        continue;
                    if (filter.selected == "firstname")
                        filter.selected = "agent_firstname";
                    if (filter.selected == "lastname")
                        filter.selected = "agent_lastname";
                    if (filter.selected == "email")
                        filter.selected = "agent_email";
                    filterObj.filters.push(filter);
                }
            }
        }
        const response = yield (0, queries_1.getAll)(inv.pool, 'agents', "Agent", req.body.amount != undefined ? req.body.amount : 30, filterObj);
        return res.status(response.status).send(response);
    }));
    inv.app.get('/api/agent/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.id)
            return res.status(400).send('Missing id');
        const id = req.params.id;
        const response = yield (0, queries_1.getByParam)(inv.pool, 'agents', 'id', id, "Agent");
        return res.status(response.status).send(response);
    }));
    inv.app.put('/api/agent/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.id)
            return res.status(400).send('Missing id');
        const id = parseInt(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).send('Invalid id');
        let obj = {};
        if (req.body.firstname)
            obj = Object.assign(obj, { agent_firstname: req.body.firstname });
        if (req.body.lastname)
            obj = Object.assign(obj, { agent_lastname: req.body.lastname });
        if (req.body.email)
            obj = Object.assign(obj, { agent_email: req.body.email });
        if (Object.keys(obj).length == 0)
            return res.status(400).send('Missing inputs');
        if (!(yield (0, queries_1.doesExist)(inv.pool, 'agents', 'id', id)))
            return res.status(400).send('Agent does not exist');
        const response = yield (0, queries_1.update)(inv.pool, 'agents', id, obj, "Agent");
        return res.status(response.status).send(response);
    }));
    inv.app.delete('/api/agent/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.id)
            return res.status(400).send('Missing id');
        const id = parseInt(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).send('Invalid id');
        if (!(yield (0, queries_1.doesExist)(inv.pool, 'agents', 'id', id)))
            return res.status(400).send('Agent does not exist');
        const response = yield (0, queries_1.del)(inv.pool, 'equipments', id, "Agent");
        return res.status(response.status).send(response);
    }));
};
//# sourceMappingURL=agent.js.map