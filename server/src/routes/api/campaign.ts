import {Inventory, InventoryResponse, FilterObject} from '../../helpers/types';
import {Response, Request} from 'express';
import {doesExist, query, create, getByParam, update, remove} from '../../middlewares/queries';

const { auth } = require('../../middlewares/authentication.js');

module.exports = (inv : Inventory) => {

    // Create new campaign
    inv.app.post('/api/campaign', auth, async (req : Request, res: Response) => {

        const { name, description } = req.body;

        // Check if the name is provided
        if (!name) return res.status(400).send({ message: "Missing name", status: 400 });

        // Check if the name already exists
        if (await doesExist(inv.pool, 'campaigns', 'campaign_name', name)) return res.status(400).send({ message: 'Name already exists', status: 400 });
        
        // Create new campaign
        const response = await create(inv.pool, 'campaigns', {
            campaign_name: name,
            campaign_description: description
        }, "Campaign");

        return res.status(response.status).send(response);
        
    });

    // Get all campaigns
    inv.app.post('/api/campaign/all', auth, async (req : Request, res: Response) => {

        // Get all campaigns from the database
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
                    if (filter.selected == "name") filter.selected = "campaign_name";
                    if (filter.selected == "description") filter.selected = "campaign_description";

                    filterObj.filters.push(filter);
                
                }
            }
        }

        const response : InventoryResponse = await query(inv.pool, 'campaigns', "Campaign", req.body.amount != undefined ? req.body.amount : 30, filterObj);
        return res.status(response.status).send(response);

    });

    // Get campaign by id
    inv.app.get('/api/campaign/:id', auth, async (req : Request, res: Response) => {

        // Get the name from the request

        if (!req.params.id) return res.status(400).send({ message: "Missing id", status: 400 });
        
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) return res.status(400).send({ message: "Invalid id", status: 400 });
 
        // Get the campaign from the database
        const response : InventoryResponse = await getByParam(inv.pool, 'campaigns', 'id', id, "Campaign");
        return res.status(response.status).send(response);

    });

    // Get campaign by name
    inv.app.get('/api/campaign', auth, async (req : Request, res: Response) => {

        // Get the name from the request

        const { name } = req.body;
        if (!name) return res.status(400).send({ message: "Missing name", status: 400 });

        // Check if the name exists
        if (!await doesExist(inv.pool, 'campaigns', 'campaign_name', name)) return res.status(400).send({ message: 'Name does not exist', status: 400 });

        // Get the campaign from the database
        const response : InventoryResponse = await getByParam(inv.pool, 'campaigns', 'campaign_name', name, "Campaign");
        return res.status(response.status).send(response);

    });

    // Update campaign
    inv.app.put('/api/campaign/:id', auth, async (req : Request, res: Response) => {
        // Check if the id is provided
        if (!req.params.id) return res.status(400).send({ message: "Missing id", status: 400 });
        const id = parseInt(req.params.id);

        if (Number.isNaN(id)) return res.status(400).send({ message: "Invalid id", status: 400 });

        const { name, description } = req.body;

        let obj = {}
        if (req.body.name != undefined) obj = Object.assign(obj, {campaign_name: name});
        if (req.body.description != undefined) obj = Object.assign(obj, {campaign_description: description});

        // Check if the id exists
        if (!await doesExist(inv.pool, 'campaigns', 'id', id)) return res.status(400).send({ message: 'Id does not exist', status: 400 });

        // Update the campaign
        const response : InventoryResponse = await update(inv.pool, 'campaigns', id, obj, "Campaign");
        return res.status(response.status).send(response);

    });

    // Delete an campaign by id
    inv.app.delete('/api/campaign/:id', auth, async (req : Request, res: Response) => {

                
        // Check if the id is provided
        if (!req.params.id) return res.status(400).send({ message: "Missing id", status: 400 });

        // Check if the id exists
        const id = parseInt(req.params.id);

        if (Number.isNaN(id)) return res.status(400).send({ message: "Invalid id", status: 400 });

        // Check if the id exists
        if (!await doesExist(inv.pool, 'campaigns', 'id', id)) return res.status(400).send({ message: 'Id does not exist', status: 400 });

        // Delete the campaign
        const response : InventoryResponse = await remove(inv.pool, 'campaigns', id, "Campaign");
        return res.status(response.status).send(response);
    
    });

    // Delete equipment by name
    inv.app.delete('/api/campaign', auth, async (req : Request, res: Response) => {
        const {name} = req.body;
        if (!name) return res.status(400).send({ message: "Missing name", status: 400 });

        // Check if the name exists
        if (!await doesExist(inv.pool, 'campaigns', 'campaign_name', name)) return res.status(400).send({ message: 'Name does not exist', status: 400 });
    
        // Get the campaign id
        const {value} : InventoryResponse = await getByParam(inv.pool, 'campaigns', 'campaign_name', name, "Campaign");

        // Delete the campaign
        const response : InventoryResponse = await remove(inv.pool, 'campaigns', value.id, "Campaign");
        return res.status(response.status).send(response);
    });

}