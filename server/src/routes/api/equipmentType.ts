import {Inventory, InventoryResponse, FilterObject} from '../../helpers/types';
import {Response, Request} from 'express';
import {doesExist, query, create, getByParam, update, remove} from '../../middlewares/queries';

const { auth } = require('../../middlewares/authentication.js');

module.exports = (inv : Inventory) => {

    // Create new equipment type
    inv.app.post('/api/equipment_type', auth, async (req : Request, res: Response) => {

        var { name, description, hasSerialNumber, hasModel, hasBrand } = req.body;

        // Check if the name is provided
        if (!name) return res.status(400).send({ message: "Missing name", status: 400 });

        // Check if the name already exists
        if (await doesExist(inv.pool, 'equipment_types', 'equipment_type_name', name)) return res.status(400).send({ message: 'Name already exists', status: 400 });

        // Default values for the boolean fields
        hasSerialNumber = hasSerialNumber == "true" ? "TRUE" : "FALSE";
        hasModel = hasModel == "true" ? "TRUE" : "FALSE";
        hasBrand = hasBrand == "true" ? "TRUE" : "FALSE";
        
        // Create new equipment type
        const response = await create(inv.pool, 'equipment_types', {
            equipment_type_name: name,
            equipment_type_description: description,
            has_serial_number: hasSerialNumber,
            has_model: hasModel,
            has_brand: hasBrand
        }, "Equipment Type");

        return res.status(response.status).send(response);
        
    });

    // Get all equipment types
    inv.app.post('/api/equipment_type/all', auth, async (req : Request, res: Response) => {

        // Get all equipment types from the database
        if (req.body.amount != undefined) req.body.amount = parseInt(req.body.amount);

        // Satinitize the filters

        let filterObj : FilterObject = {filters: [], preArgument: ""};

        if (req.body.filters != undefined) {
            for (let f = 0; f < req.body.filters.length; f++) {
                let filter = req.body.filters[f];

                if (filter.selected && filter.value) {

                    // Ignore the filter if certain characters are detected
                    if (filter.selected.includes(" ") || filter.selected.includes(";")) continue;
                    if (filter.value.includes(" ") || filter.value.includes(";")) continue;

                    // Rename selected
                    if (filter.selected == "name") filter.selected = "equipment_type_name";
                    if (filter.selected == "description") filter.selected = "equipment_type_description";

                    filterObj.filters.push(filter);
                
                }
            }
        }

        const response : InventoryResponse = await query(inv.pool, 'equipment_types', "Equipment Type", req.body.amount != undefined ? req.body.amount : 30, filterObj);
        return res.status(response.status).send(response);

    });

    // Get equipment type by id
    inv.app.get('/api/equipment_type/:id', auth, async (req : Request, res: Response) => {

        // Get the name from the request

        if (!req.params.id) return res.status(400).send({ message: "Missing id", status: 400 });
        
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) return res.status(400).send({ message: "Invalid id", status: 400 });
 
        // Get the equipment type from the database
        const response : InventoryResponse = await getByParam(inv.pool, 'equipment_types', 'id', id, "Equipment Type");
        return res.status(response.status).send(response);

    });

    // Get equipment type by name
    inv.app.get('/api/equipment_type', auth, async (req : Request, res: Response) => {

        // Get the name from the request

        const { name } = req.body;
        if (!name) return res.status(400).send({ message: "Missing name", status: 400 });

        // Check if the name exists
        if (!await doesExist(inv.pool, 'equipment_types', 'equipment_type_name', name)) return res.status(400).send({ message: 'Name does not exist', status: 400 });

        // Get the equipment type from the database
        const response : InventoryResponse = await getByParam(inv.pool, 'equipment_types', 'equipment_type_name', name, "Equipment Type");
        return res.status(response.status).send(response);

    });

    // Update equipment type
    inv.app.put('/api/equipment_type/:id', auth, async (req : Request, res: Response) => {
        // Check if the id is provided
        if (!req.params.id) return res.status(400).send({ message: "Missing id", status: 400 });
        const id = parseInt(req.params.id);

        if (Number.isNaN(id)) return res.status(400).send({ message: "Invalid id", status: 400 });

        const { name, description, hasSerialNumber, hasBrand, hasModel} = req.body;

        let obj = {}
        if (req.body.name != undefined) obj = Object.assign(obj, {equipment_type_name: name});
        if (req.body.description != undefined) obj = Object.assign(obj, {equipment_type_description: description});
        if (req.body.hasSerialNumber != undefined) obj = Object.assign(obj, {has_serial_number: hasSerialNumber});
        if (req.body.hasBrand != undefined) obj = Object.assign(obj, {has_brand: hasBrand});
        if (req.body.hasModel != undefined) obj = Object.assign(obj, {has_model: hasModel});

        // Check if the id exists
        if (!await doesExist(inv.pool, 'equipment_types', 'id', id)) return res.status(400).send({ message: 'Id does not exist', status: 400 });

        // Update the equipment type
        const response : InventoryResponse = await update(inv.pool, 'equipment_types', id, obj, "Equipment Type");
        return res.status(response.status).send(response);

    });

    // Delete an equipment type by id
    inv.app.delete('/api/equipment_type/:id', auth, async (req : Request, res: Response) => {

                
        // Check if the id is provided
        if (!req.params.id) return res.status(400).send({ message: "Missing id", status: 400 });

        // Check if the id exists
        const id = parseInt(req.params.id);

        if (Number.isNaN(id)) return res.status(400).send({ message: "Invalid id", status: 400 });

        // Check if the id exists
        if (!await doesExist(inv.pool, 'equipment_types', 'id', id)) return res.status(400).send('Id does not exist');

        // Delete the equipment type
        const response : InventoryResponse = await remove(inv.pool, 'equipment_types', id, "Equipment Type");
        return res.status(response.status).send(response);
    
    });

    // Delete equipment type by name
    inv.app.delete('/api/equipment_type', auth, async (req : Request, res: Response) => {
        const {name} = req.body;
        if (!name) return res.status(400).send({ message: "Missing name", status: 400 });

        // Check if the name exists
        if (!await doesExist(inv.pool, 'equipment_types', 'equipment_type_name', name)) return res.status(400).send({ message: 'Name does not exist', status: 400 });
    
        // Get the equipment type id
        const {value} : InventoryResponse = await getByParam(inv.pool, 'equipment_types', 'equipment_type_name', name, "Equipment Type");

        // Delete the equipment type
        const response : InventoryResponse = await remove(inv.pool, 'equipment_types', value.id, "Equipment Type");
        return res.status(response.status).send(response);
    });

}