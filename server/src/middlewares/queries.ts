import { Pool } from "pg";
import { InventoryResponse, FilterObject } from "src/helpers/types";

/**
 * Parses the filters and returns a query string
 * @param filterObj : FilterObject - The filters to parse
 * @returns string - The query string
 */
function parseFilters(filterObj : FilterObject) : string {

    // Build the query filters
    let searchArgs : string[] = [];

    // Include the valid filters
    for (let i = 0; i < filterObj.filters.length; i++) {
        const filter = filterObj.filters[i];

        // Skip if the filter is incomplete
        if (!filter.value || !filter.selected) continue;
        
        // Add the filter to the query
        searchArgs.push(`LOWER(${filter.selected}) LIKE LOWER('%${filter.value}%')`);
    }  

    // Assemble the query into a string
    const searchString = searchArgs.join(" AND ");
    return searchString;
}

/**
 * Check if an entry with a specific value exists in a table
 * @param pool : Pool - The database pool
 * @param table : string - The table to check
 * @param param : string - The parameter to check
 * @param value : string - The value to check
 * @returns Promise<boolean> - If the value exists or not
 */
export async function doesExist(pool: Pool, table: string, param: string, value: any) : Promise<boolean> {

    return new Promise((resolve, reject) => {
        // console.log(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${param}='${value}')`)
        pool.query(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${param}='${value}')`, (err : any, result : any) => {
            
            // Check for errors
            if (err) {
                console.log(err);
                reject(false);
            }

            // Return false if the entry does not exist
            resolve(result.rows[0].exists);
        });
    });

}

/**
 * Get an entry from a table by a specific parameter.
 * @param pool : Pool - The database pool
 * @param table : string - The target table to query
 * @param param : string - The parameter to search by
 * @param value : string - The value to search for
 * @param subject : string - The target subject to query
 * @returns Promise<InventoryResponse> - The response containing the entry in the value field
 */
 export async function getByParam(pool: Pool, table: string, param: string, value: any, subject: string) : Promise<InventoryResponse> {
    return new Promise((resolve, _) => {

        // console.log(`SELECT * FROM ${table} WHERE ${param}='${value}'`)
        pool.query(`SELECT * FROM ${table} WHERE ${param}='${value}'`, (err : any, result : any) => {

            // Check for errors
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
}

/**
 * Count the number of entries in a table
 * @param pool : Pool - The database pool
 * @param table : string - The table to count
 * @param subject : string - The subject to count
 * @param filterObj : FilterObject - The filters to apply
 * @returns Promise<InventoryResponse> - The response containing the count in the value field
 */
export async function getCount(pool: Pool, table: string, subject: string, filterObj : FilterObject) : Promise<InventoryResponse> {
    return new Promise((resolve, _) => {

        const searchString = parseFilters(filterObj);

        // Get all equipment types from the database
        // console.log(`SELECT COUNT(id) FROM ${table} ${filterObj.preArgument} WHERE ${searchString} ${searchString.length > 0 ? 'AND' : ""} deleted IS FALSE`);
        pool.query(`SELECT COUNT(id) FROM ${table} ${filterObj.preArgument} WHERE ${searchString} ${searchString.length > 0 ? 'AND' : ""} deleted IS FALSE`, (err : any, result : any) => {

            // Check for errors
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
                value: result.rows[0].count // Return the number of entries
            });

        });

    });
}

/**
 * Find the first entry in a table that is labeled as deleted.
 * @param pool : Pool - The database pool
 * @param table : string - The table to search
 * @param subject : string - The subject to search
 * @returns Promise<InventoryResponse> - The response containing the entry in the value field
 */
export async function findFirstDeleted(pool: Pool, table: string, subject: string) : Promise<InventoryResponse> {
    return new Promise((resolve, _) => {

        // console.log(`SELECT * FROM ${table} WHERE deleted IS TRUE LIMIT 1`);
        pool.query(`SELECT id FROM ${table} WHERE deleted IS TRUE LIMIT 1`, (err : any, result : any) => {

            // Check for errors
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
}

/**
 * Query the database for all entries in a table that match the filters.
 * @param pool : Pool - The database pool
 * @param table : string - The target table to query
 * @param subject : string - The target subject to query
 * @param amount : number - The maximum amount of entries to return
 * @param filterObj : FilterObject - The filters to apply
 * @param page : number - The page to return (if applicable)
 * @returns Promise<InventoryResponse> - The response containing the entries in the value field
 */
export async function query(pool: Pool, table: string, subject: string, amount: number = 30, filterObj : FilterObject, page: number = 1) : Promise<InventoryResponse> {

    // Get the amount of entries
    let entryCount = (await getCount(pool, table, subject, filterObj)).value;
    if (entryCount == null) entryCount = 1;

    // Estimate the amount of pages
    const totalPages = Math.ceil(entryCount / (amount > 0 ? amount : 30));

    return new Promise((resolve, _) => {

        // Check if the page is valid
        if (page-1 > totalPages) return resolve({
            message: "Invalid page number",
            status: 400,
            value: null
        });

        // Get the filters to apply
        var searchString = parseFilters(filterObj);

        // Get all equipment types from the database
        // console.log(`SELECT * FROM ${table} ${filterObj.preArgument} WHERE ${searchString} ${searchString.length > 0 ? 'AND' : ""} deleted IS FALSE ORDER BY id ASC ${amount >= 0 ? 'LIMIT ' + String(amount) : ""} ${amount >=0 ? 'OFFSET ' + String((page-1) * amount) : ""}`)
        pool.query(`SELECT * FROM ${table} ${filterObj.preArgument} WHERE ${searchString} ${searchString.length > 0 ? 'AND' : ""} deleted IS FALSE ORDER BY id ASC ${amount >= 0 ? 'LIMIT ' + String(amount) : ""} ${amount >=0 ? 'OFFSET ' + String((page-1) * amount) : ""}`, (err : any, result : any) => {

            // Check for errors
            if (err) {
                console.log(err);
                return resolve({
                    message: `Error querying ${subject}s`,
                    status: 500,    // Return an error
                    value: null,
                    pages: totalPages,
                    count: entryCount
                });
            }
            
            // Return the entries
            return resolve({
                message: `${subject}s retrieved`,
                status: 200,    // Success
                value: result.rows,
                pages: totalPages,
                count: entryCount
            });

        });

    });
}

/**
 * Create a new entry in a table.
 * @param pool : Pool - The database pool
 * @param table : string - The target table to query
 * @param inputs : Object - The inputs to insert into the table
 * @param subject : string - The target subject to query
 * @returns Promise<InventoryResponse> - The response containing the entry in the value field
 */
export async function create(pool: Pool, table: string, inputs: Object, subject: string) : Promise<InventoryResponse> {

    const availableIndex = await findFirstDeleted(pool, table, subject);

    return new Promise((resolve, _) => {

        // Update time
        inputs = Object.assign(inputs, {modified_at: new Date()});

        // First find an item labeled as deleted to replace it
        // Check to see if an available index exists and update it if it does
        if (availableIndex.value != undefined && availableIndex.value != null) {

            // Generate list of values to update
            var objs = "";
            Object.entries(inputs).forEach(([key, value]) => {
                objs += `${key}='${value}', `;
            });

            // Remove the last comma
            objs = objs.substring(0, objs.length - 2);

            pool.query(`UPDATE ${table} SET deleted=false, ${objs} WHERE id=${availableIndex.value} RETURNING *`, (err : any, result : any) => {

                // Check for errors
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

        // If no available index labeled as deleted exists, create a new one

        const keys = (Object.keys(inputs)).join(", ")
        const values = "'" + (Object.values(inputs)).join("', '") + "'";

        pool.query(`INSERT INTO ${table} (${keys}) VALUES (${values}) RETURNING *`, (err : any, result : any) => {

            // Check for errors
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
}

// Update an entry in a table
export async function update(pool: Pool, table: string, id: number, inputs: Object, subject: string) : Promise<InventoryResponse> {
    return new Promise((resolve, _) => {

        // Update time
        inputs = Object.assign(inputs, {modified_at: new Date()});

        // Generate list of values to update
        var objs = "";
        Object.entries(inputs).forEach(([key, value]) => {
            objs += `${key}='${value}', `;
        });

        objs = objs.substring(0, objs.length - 2);

        pool.query(`UPDATE ${table} SET ${objs} WHERE id=${id} RETURNING *`, (err : any, result : any) => {

            // Check for errors
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
}

/**
 * Remove an entry from a table. This is done by setting the deleted field to true.
 * @param pool : Pool - The database pool
 * @param table : string - The target table to query
 * @param id : number - The id of the entry to remove
 * @param subject : string - The target subject to query
 * @returns Promise<InventoryResponse> - The response containing the entry in the value field
 */
export async function remove(pool: Pool, table: string, id: number, subject: string) : Promise<InventoryResponse> {
    return new Promise((resolve, _) => {
            
            pool.query(`UPDATE ${table} SET deleted=true WHERE id=${id} RETURNING *`, (err : any, result : any) => {
    
                // Check for errors
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
}