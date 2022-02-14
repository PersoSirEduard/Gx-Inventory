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
const { auth, generateKey } = require('../../middlewares/authentication.js');
module.exports = (inv) => {
    inv.app.post('/api/equipment', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { name, type, status, location, description, campaign, serial_number, brand, model, agent } = req.body;
        if (!name)
            name = "P-" + generateKey(8, true);
        if (!type || Number.isNaN(parseInt(type)))
            return res.status(400).send('Missing or invalid type');
        if (!status)
            return res.status(400).send('Missing status');
        let obj = {
            equipment_name: name,
            equipment_type: parseInt(type),
            equipment_status: status
        };
        if (location != undefined)
            obj = Object.assign(obj, { equipment_location: location });
        if (description != undefined)
            obj = Object.assign(obj, { equipment_description: description });
        if (serial_number != undefined)
            obj = Object.assign(obj, { equipment_serial_number: serial_number });
        if (brand != undefined)
            obj = Object.assign(obj, { equipment_brand: brand });
        if (model != undefined)
            obj = Object.assign(obj, { equipment_model: model });
        if (agent != undefined)
            obj = Object.assign(obj, { equipment_agent: agent });
        if (campaign != undefined && !Number.isNaN(parseInt(campaign)))
            obj = Object.assign(obj, { equipment_campaign: parseInt(campaign) });
        name = name.replace(" ", "_");
        if (name == "all")
            return res.status(400).send('Name cannot be "all"');
        if (yield (0, queries_1.doesExist)(inv.pool, 'equipments', 'equipment_name', name))
            return res.status(400).send('Name already exists');
        const response = yield (0, queries_1.create)(inv.pool, 'equipments', obj, "Equipment Item");
        return res.status(response.status).send(response);
    }));
    inv.app.post('/api/equipment/all', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.amount != undefined)
            req.body.amount = parseInt(req.body.amount);
        if (req.body.page != undefined) {
            req.body.page = parseInt(req.body.page);
        }
        else {
            req.body.page = 1;
        }
        let filterObj = { filters: [], filterArg: "" };
        if (req.body.filters != undefined) {
            for (let f = 0; f < req.body.filters.length; f++) {
                let filter = req.body.filters[f];
                if (filter.selected && filter.value) {
                    if (filter.selected.includes(" ") || filter.selected.includes(";"))
                        continue;
                    if (filter.value.includes(" ") || filter.value.includes(";"))
                        continue;
                    if (filter.selected == "name")
                        filter.selected = "equipment_name";
                    if (filter.selected == "type") {
                        filter.selected = "types.equipment_type_name";
                        filterObj.filterArg = "INNER JOIN (SELECT id AS equipment_type_id, equipment_type_name, equipment_type_description FROM equipment_types) types ON equipments.equipment_type = types.equipment_type_id";
                    }
                    if (filter.selected == "campaign") {
                        filter.selected = "all_campaigns.campaign_name";
                        if (filterObj.filterArg == "") {
                            filterObj.filterArg = "INNER JOIN (SELECT id AS campaign, campaign_name, campaign_description FROM campaigns) all_campaigns ON equipments.equipment_campaign = all_campaigns.campaign";
                        }
                        else {
                            filterObj.filterArg += " INNER JOIN (SELECT id AS campaign, campaign_name, campaign_description FROM campaigns) all_campaigns ON equipments.equipment_campaign = types.campaign";
                        }
                    }
                    if (filter.selected == "status")
                        filter.selected = "equipment_status";
                    if (filter.selected == "location")
                        filter.selected = "equipment_location";
                    if (filter.selected == "description")
                        filter.selected = "equipment_description";
                    if (filter.selected == "serial_number")
                        filter.selected = "equipment_serial_number";
                    if (filter.selected == "brand")
                        filter.selected = "equipment_brand";
                    if (filter.selected == "model")
                        filter.selected = "equipment_model";
                    if (filter.selected == "agent")
                        filter.selected = "equipment_agent";
                    filterObj.filters.push(filter);
                }
            }
        }
        const response = yield (0, queries_1.getAll)(inv.pool, 'equipments', "Equipment Item", req.body.amount != undefined ? req.body.amount : 30, filterObj, req.body.page != undefined ? req.body.page : 1);
        return res.status(response.status).send(response);
    }));
    inv.app.get('/api/equipment/:name', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.name)
            return res.status(400).send('Missing name id');
        const name = req.params.name;
        const response = yield (0, queries_1.getByParam)(inv.pool, 'equipments', 'equipment_name', name, "Equipment Item");
        return res.status(response.status).send(response);
    }));
    inv.app.put('/api/equipment/:name', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.name)
            return res.status(400).send('Missing name id');
        const name = req.params.name;
        let obj = {};
        if (req.body.name)
            obj = Object.assign(obj, { equipment_name: req.body.name });
        if (req.body.type && !Number.isNaN(parseInt(req.body.type)))
            obj = Object.assign(obj, { equipment_type: parseInt(req.body.type) });
        if (req.body.status)
            obj = Object.assign(obj, { equipment_status: req.body.status });
        if (req.body.location)
            obj = Object.assign(obj, { equipment_location: req.body.location });
        if (req.body.description)
            obj = Object.assign(obj, { equipment_description: req.body.description });
        if (req.body.serial_number)
            obj = Object.assign(obj, { equipment_serial_number: req.body.serial_number });
        if (req.body.brand)
            obj = Object.assign(obj, { equipment_brand: req.body.brand });
        if (req.body.model)
            obj = Object.assign(obj, { equipment_model: req.body.model });
        if (req.body.agent)
            obj = Object.assign(obj, { equipment_agent: req.body.agent });
        if (req.body.campaign && !Number.isNaN(parseInt(req.body.campaign)))
            obj = Object.assign(obj, { equipment_campaign: parseInt(req.body.campaign) });
        if (Object.keys(obj).length == 0)
            return res.status(400).send('Missing inputs');
        if (!(yield (0, queries_1.doesExist)(inv.pool, 'equipments', 'equipment_name', name)))
            return res.status(400).send('Name does not exist');
        const { value } = yield (0, queries_1.getByParam)(inv.pool, 'equipments', 'equipment_name', name, "Equipment Item");
        const response = yield (0, queries_1.update)(inv.pool, 'equipments', value.id, obj, "Equipment Item");
        return res.status(response.status).send(response);
    }));
    inv.app.delete('/api/equipment/:name', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.params.name == undefined)
            return res.status(400).send('Missing name id');
        const name = req.params.name;
        if (!(yield (0, queries_1.doesExist)(inv.pool, 'equipments', 'equipment_name', name)))
            return res.status(400).send('Name does not exist');
        const { value } = yield (0, queries_1.getByParam)(inv.pool, 'equipments', 'equipment_name', name, "Equipment Item");
        const response = yield (0, queries_1.del)(inv.pool, 'equipments', value.id, "Equipment Item");
        return res.status(response.status).send(response);
    }));
};
//# sourceMappingURL=equipment.js.map