import fs from 'fs';
import {Inventory} from '../helpers/types';

// Import all routes from the api folder
module.exports = (instance : Inventory) => {
    fs.readdirSync(__dirname + '/api/').forEach((file : String) => {
        require(`./api/${file.substring(0, file.indexOf('.'))}`)(instance);
    });
}