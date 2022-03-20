import {Inventory, InventoryResponse, FilterObject} from '../../helpers/types';
import {Response, Request} from 'express';
import {doesExist, query, create, getByParam, update, remove} from '../../middlewares/queries';
import { stringify } from 'csv-stringify/sync';

const { auth, generateKey } = require('../../middlewares/authentication.js');

var latestQueryFilters : FilterObject;

module.exports = (inv : Inventory) => {

    // Create new equipment item
    inv.app.post('/api/equipment', auth, async (req : Request, res: Response) => {
    
            let { name, type, status, location, description, campaign, serial_number, brand, model, agent } = req.body;

            // Generate a key for the new item if not specified
            if (!name) name = "P-" + generateKey(8, true);

            if (!type || Number.isNaN(parseInt(type))) return res.status(400).send({ message: "Missing or invalid type", status: 400 });
            if (!status) return res.status(400).send({ message: "Missing status", status: 400 });

            let obj = {
                equipment_name: name,
                equipment_type: parseInt(type),
                equipment_status: status
            }

            if (location != undefined) obj = Object.assign(obj, {equipment_location: location});
            if (description != undefined) obj = Object.assign(obj, {equipment_description: description});
            if (serial_number != undefined) obj = Object.assign(obj, {equipment_serial_number: serial_number});
            if (brand != undefined) obj = Object.assign(obj, {equipment_brand: brand});
            if (model != undefined) obj = Object.assign(obj, {equipment_model: model});
            if (agent != undefined) obj = Object.assign(obj, {equipment_agent: agent});
            if (campaign != undefined && !Number.isNaN(parseInt(campaign))) obj = Object.assign(obj, {equipment_campaign: parseInt(campaign)});

            name = name.replace(" ", "_");

            if (name == "all") return res.status(400).send({ message: 'Name cannot be "all"', status: 400 });

            // Check if the name already exists
            if (await doesExist(inv.pool, 'equipments', 'equipment_name', name)) return res.status(400).send({ message: 'Name already exists', status: 400 });

            // Create new equipment item
            const response = await create(inv.pool, 'equipments', obj, "Equipment Item");

            return res.status(response.status).send(response);
            
    });

    // Get all equipment items
    inv.app.post('/api/equipment/all', auth, async (req : Request, res: Response) => {

        // Get all equipment types from the database
        if (req.body.amount != undefined) req.body.amount = parseInt(req.body.amount);

        if (req.body.page != undefined) {
            req.body.page = parseInt(req.body.page);
        } else {
            req.body.page = 1;
        }

        // Sanitize the filters

        let filterObj : FilterObject = {filters: [], preArgument: ""};

        if (req.body.filters != undefined) {
            for (let f = 0; f < req.body.filters.length; f++) {
                let filter = req.body.filters[f];

                if (filter.selected && filter.value) {

                    // Ignore the filter if certain characters are detected
                    if (filter.selected.includes(" ") || filter.selected.includes(";")) continue;
                    if (filter.value.includes(" ") || filter.value.includes(";")) continue;

                    // Rename selected
                    if (filter.selected == "name") filter.selected = "equipment_name";
                    if (filter.selected == "type") {
                        // Join the equipment types table
                        filter.selected = "types.equipment_type_name";
                        filterObj.preArgument = "INNER JOIN (SELECT id AS equipment_type_id, equipment_type_name, equipment_type_description FROM equipment_types) types ON equipments.equipment_type = types.equipment_type_id";
                    }
                    if (filter.selected == "campaign") {
                        // Join the campaigns table
                        filter.selected = "all_campaigns.campaign_name";

                        if (filterObj.preArgument == "") {
                            // No prvious filter arguments
                            filterObj.preArgument = "INNER JOIN (SELECT id AS campaign, campaign_name, campaign_description FROM campaigns) all_campaigns ON equipments.equipment_campaign = all_campaigns.campaign";
                        } else {
                            // Previous filter arguments exists, add a new one to the end
                            filterObj.preArgument += " INNER JOIN (SELECT id AS campaign, campaign_name, campaign_description FROM campaigns) all_campaigns ON equipments.equipment_campaign = types.campaign";
                        }
                    }
                    if (filter.selected == "status") filter.selected = "equipment_status";
                    if (filter.selected == "location") filter.selected = "equipment_location";
                    if (filter.selected == "description") filter.selected = "equipment_description";
                    if (filter.selected == "serial_number") filter.selected = "equipment_serial_number";
                    if (filter.selected == "brand") filter.selected = "equipment_brand";
                    if (filter.selected == "model") filter.selected = "equipment_model";
                    if (filter.selected == "agent") filter.selected = "equipment_agent";

                    filterObj.filters.push(filter);
                
                }
            }
        }

        const response : InventoryResponse = await query(inv.pool, 'equipments', "Equipment Item", req.body.amount != undefined ? req.body.amount : 30, filterObj, req.body.page != undefined ? req.body.page : 1);
        if (response.status == 200) latestQueryFilters = filterObj; // Save the latest query request
        return res.status(response.status).send(response);

    });

    inv.app.get('/api/equipment/download', auth, async (_ : Request, res: Response) => {
        res.setHeader('Content-disposition', 'attachment; filename=equipment.csv');
        res.setHeader('Content-type', 'text/csv');

        var data = [["Id", "Name", "Type", "Status", "Location", "Serial Number", "Brand", "Model", "Campaign", "Modified at", "Description"]];

        try {
            const response = await query(inv.pool, 'equipments', "Equipment Item", -1, latestQueryFilters, 1);

            if (response.status == 200) {
               for (let i = 0; i < response.value.length; i++) {
                    let item = response.value[i];

                    // Get equipment type
                    let type = item.equipment_type;
                    try {
                        type = (await getByParam(inv.pool, 'equipment_types', 'id', item.equipment_type, 'Equipment Item')).value.equipment_type_name;
                    } catch (e) {
                        type = "Unknown";
                    }

                    // Get campaign
                    let campaign = "";
                    try {
                        campaign = (await getByParam(inv.pool, 'campaigns', 'id', item.equipment_campaign, 'Campaign')).value.campaign_name;
                    } catch (e) {
                        campaign = "Unknown";
                    }

                    let row = [item.id.toString(), item.equipment_name, type, item.equipment_status, item.equipment_location, item.equipment_serial_number, item.equipment_brand, item.equipment_model, campaign, item.modified_at.toString(), item.equipment_description];
                    data.push(row);
                    
                }
            }
        } catch {
            return res.status(500).send({ message: 'Error while downloading equipment', status: 500 });
        }

        const output = stringify(data);
        return res.send(output);

    });

    // Get equipment item by name
    inv.app.get('/api/equipment/:name', auth, async (req : Request, res: Response) => {

        // Get the name from the request

        if (!req.params.name) return res.status(400).send({ message: "Missing name", status: 400 });

        const name = req.params.name;
    
        // Get the equipment type from the database
        const response : InventoryResponse = await getByParam(inv.pool, 'equipments', 'equipment_name', name, "Equipment Item");

        return res.status(response.status).send(response);

    });

    // Update equipment item
    inv.app.put('/api/equipment/:name', auth, async (req : Request, res: Response) => {
            
        // Get the name from the request

        if (!req.params.name) return res.status(400).send({ message: 'Missing name id', status: 400 });

        const name = req.params.name;

        // Check if the equipment properties exist
        let obj = {}
        if (req.body.name) obj = Object.assign(obj, {equipment_name: req.body.name});
        if (req.body.type && !Number.isNaN(parseInt(req.body.type))) obj = Object.assign(obj, {equipment_type: parseInt(req.body.type)});
        if (req.body.status) obj = Object.assign(obj, {equipment_status: req.body.status});
        if (req.body.location) obj = Object.assign(obj, {equipment_location: req.body.location});
        if (req.body.description) obj = Object.assign(obj, {equipment_description: req.body.description});
        if (req.body.serial_number) obj = Object.assign(obj, {equipment_serial_number: req.body.serial_number});
        if (req.body.brand) obj = Object.assign(obj, {equipment_brand: req.body.brand});
        if (req.body.model) obj = Object.assign(obj, {equipment_model: req.body.model});
        if (req.body.agent) obj = Object.assign(obj, {equipment_agent: req.body.agent});
        if (req.body.campaign && !Number.isNaN(parseInt(req.body.campaign))) obj = Object.assign(obj, {equipment_campaign: parseInt(req.body.campaign)});

        if (Object.keys(obj).length == 0) return res.status(400).send('Missing inputs');

        // Check if the name exits
        if (!await doesExist(inv.pool, 'equipments', 'equipment_name', name)) return res.status(400).send({ message: "Equipment item does not exist", status: 400 });

        // Get the equipment id
        const {value} = await getByParam(inv.pool, 'equipments', 'equipment_name', name, "Equipment Item");

        // Get the equipment type from the database
        const response : InventoryResponse = await update(inv.pool, 'equipments', value.id, obj, "Equipment Item");
        return res.status(response.status).send(response);
    
    });

    // Delete equipment item
    inv.app.delete('/api/equipment/:name', auth, async (req : Request, res: Response) => {
                
        // Get the name from the request

        if (req.params.name == undefined) return res.status(400).send({ message: 'Missing name id', status: 400 });

        const name = req.params.name;

        // Check if the name exists
        if (!await doesExist(inv.pool, 'equipments', 'equipment_name', name)) return res.status(400).send({ message: "Equipment item does not exist", status: 400 });

        // Get the equipment id
        const {value} = await getByParam(inv.pool, 'equipments', 'equipment_name', name, "Equipment Item");

        // Delete the equipment item
        const response : InventoryResponse = await remove(inv.pool, 'equipments', value.id, "Equipment Item");
        return res.status(response.status).send(response);
        
    });
}