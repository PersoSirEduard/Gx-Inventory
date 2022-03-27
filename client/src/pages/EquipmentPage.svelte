<script>
    import PropertyPanel from '../components/PropertyPanel.svelte';
    import ContainerPanel from '../components/ContainerPanel.svelte';
    import List from '../components/List.svelte';
    import Popup from '../components/Popup.svelte';
    import Header from '../components/Header.svelte';
    import FilterBox from '../components/FilterBox.svelte';
    import ScannerListener from '../components/ScannerListener.svelte';
    import DetailForm from '../components/DetailForm.svelte';
    import PopupForm from '../components/PopupForm.svelte';
    import { onMount } from 'svelte';
    import { genId, api, attemptJsonParse } from '../helpers/utils.js';
    import download from 'downloadjs';


    // Global variables
    // Labels to display in the header of the result list
    let properties = ["id", "name", "type", "status", "location", "campaign"]
    // Store all the current equipment types for the properties panel
    let types = {}
    // Store all the current campaigns for the properties panel
    let campaigns = {}
    // Current search filters
    let filters = []
    // Current equipment list to display
    let items = []
    // Current equipment to display in the detail form
    let selectedItem = null;
    // Current page to display
    let currentPage = 1;
    // Total number of pages
    let totalPages = 1;
    // Total number of items to display
    let totalItems = 0;

    // Popup box variables
    // Invoked using showError()
    let error = false;
    let errorTitle = 'Error';
    let errorMessage = '';
    let hasCancelBtn = false;
    let onCancelError = () => {};
    let onOkError = () => {};

    /**
     * Show an error popup box
     * @param msg : String - The message to display
     * @param title : String - The title of the popup box
     * @param onEnd : Function - The function to call when the popup box is closed
     */
    const showError = (msg, title, onCancel = () => {}, onOk = () => {}, hasCancel = false) => {
        errorMessage = msg;
        errorTitle = title;
        hasCancelBtn = hasCancel;
        onCancelError = () => {
            error = false;
            onCancel();
        }
        onOkError = () => {
            error = false;
            onOk();
        }
        error = true;
    }

    // Event handler for changing the selected item
    const onItemSelected = (e) => {

        // Check if the selected is valid
        if (e.detail == null) {
            selectedItem = null;
            return;
        }

        // Use the id of the selected item to find the item in the items list
        // and set it as the selected item to display
        const id = e.detail.id;
        selectedItem = items.find(item => item.id === id);
    };

    // Property panel
    // Event handler for pressing the search button
    const onClickSearch = async () => {
        currentPage = 1;
        await reload();
    };

    // Event handler for pressing the add filter button
    const onClickAddQuery = () => {

        // Limit the number of filters to 5
        if (filters.length >= 5) {
            showError("You can only have a maximum of 5 filters.", "Too many filters");
            return;
        }

        // Add a new filter to the filters list
        // A unique id is generated for the filter to recognize it
        filters.push({value: "", selected: properties[0], id: genId()});
        filters = filters; // Svelte weird behavior, need to force update
    };

    // Event handler for pressing the download button
    // Download the current equipment list as a CSV file
    const onClickDownload = async () => {
        try {
            // Get the CSV data as a string
            const downloadData = await api('GET', 'equipment/download');
            // Download the CSV file as 'equipment.csv'
            download(downloadData, 'equipment.csv', 'text/csv');

        } catch (err) {
            if (err.message == "Failed to fetch") err.message = "Failed to connect to the server, try again later.";
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }
    }

    // Properties panel
    // Event handler for updating the a selected item
    const onClickUpdate = async (e) => {
        
        try {
            // Request the server to update the selected item
            const equipment = await api('PUT', `equipment/${selectedItem.name}`, {
                name: e.detail.name,
                type: e.detail.type,
                status: e.detail.status,
                location: e.detail.location,
                description: e.detail.description,
                campaign: e.detail.campaign,
                serial_number: e.detail.serial_number,
                agent: e.detail.agent,
                brand: e.detail.brand,
                model: e.detail.model
            });
            
        } catch (err) {
            if (err.message == "Failed to fetch") err.message = "Failed to connect to the server, try again later.";
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }

        // Reload the items list to display the updated item
        await reload();

    };

    // Event handler for pressing the delete button
    const onClickDelete = async (e) => {
        try {
            // Request the server to delete the selected item
            const response = await api('DELETE', `equipment/${selectedItem.name}`);
            // Reload the items list to remove the deleted item
            await reload();
        } catch (err) {
            if (err.message == "Failed to fetch") err.message = "Failed to connect to the server, try again later.";
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }
    };

    // Structure defining how to display the properties panel
    // Each inner array represents a row in the panel
    // Each object in the inner array represents a property
    // On each row, each object take the following properties:
    // - label : String - The label of the property
    // - value : String - The default value of the property
    // - type : String - The type of input for the property (text, select, select-obj, richtext)
    // - onlyif : String - Conditions to display the property
    $: newItemStructure = [
        [{type: "text", label: "Name", value: "", name: "name"}, {type: "select-obj", label: "Type", value: Object.keys(types)[0], values: types, name: "type"}],
        [{type: "text", label: "Location", value: "", name: "location"}, {type: "select", label: "Status", value: "In Stock", values: ["In Stock", "In Use", "Unknown", "Not Returned - Formal Notice"], name: "status"}],
        [{type: "text", label: "Agent Name", value: "", name: "agent"}, {type: "select-obj", label: "Campaign", value: Object.keys(campaigns)[0], values: campaigns, name: "campaign"}],
        [{type: "text", label: "Brand", value: "", name: "brand"}, {type: "text", label: "Model", value: "", name: "model"}],
        [{type: "text", label: "Serial Number", value: "", name: "serial_number", onlyif: Object.entries(types).filter((el) => el[1] == "Laptop" || el[1] == "PC").map((el) => parseInt(el[0])) }],
        [{type: "richtext", label: "Description", value: "", name: "description"}],
        // [{type: "label", label: "Modified at: ", name: "modified_at"}]
    ];

    // Add a new equipment item window
    // Window also uses the same structure as the properties panel
    let newItemWindow = false;
    let newItemWindowTitle = 'Add Equipment';

    // Handler for scanning device listener
    const onScan = async (e) => {

        // Open new equipment window
        try {
            // Request the server to get the equipment data
            const equipment = await api('POST', `equipment/all`, {filters:[{selected: "name", value: e.detail}]});
            
            // Found equipment already in list, then display it
            if (equipment != undefined && equipment.value != undefined && equipment.value.length > 0) {
                selectedItem = {id: equipment.value[0].id, 
                                name: equipment.value[0].equipment_name,
                                type: equipment.value[0].equipment_type,
                                status: equipment.value[0].equipment_status,
                                location: equipment.value[0].equipment_location,
                                description: equipment.value[0].equipment_description,
                                campaign: equipment.value[0].equipment_campaign,
                                brand: equipment.value[0].equipment_brand,
                                model: equipment.value[0].equipment_model,
                                agent: equipment.value[0].equipment_agent,
                                serial_number: equipment.value[0].equipment_serial_number,
                                modified_at: new Date(equipment.value[0].modified_at).toLocaleString()};
            }
            else {
                // Equipment not found. Create new item
                newItemWindow = true;
                newItemStructure[0][0].value = e.detail;
            }

        } catch (err) {
	        console.log(err);
            newItemWindow = true;
            newItemStructure[0][0].value = e.detail;
        }

        
    };

    // Popup form
    // Event handler for pressing the add button
    const onAddNewItem = async (e) => {
        try {
            const response = await api('POST', 'equipment', e.detail);

            // Reload list
            await reload();
        } catch (err) {
            if (err.message == "Failed to fetch") err.message = "Failed to connect to the server, try again later.";
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }
    }

    const onNextPage = async (e) => {
        await reload();
    }

    /**
     * Reload the equipment list and its necessary data (campaigns, types, etc)
     */
    async function reload() {

        selectedItem = null; // Reset selected item

        // Get equipment type list
        try {
            const equipment_types = await api('POST', 'equipment_type/all', {amount: -1});

            // Update types dictionnary
            types = {}
            for (let i = 0; i < equipment_types.value.length; i++) {
                types[equipment_types.value[i].id] = equipment_types.value[i].equipment_type_name;
            }

        } catch (err) {
            if (err.message == "Failed to fetch") err.message = "Failed to connect to the server, try again later.";
            showError(attemptJsonParse(err.message, "message"), 'Error');
            return
        }

        // Get equipment campaign list
        try {
            const equipment_campaigns = await api('POST', 'campaign/all', {amount: -1});

            // Update types dictionnary
            campaigns = {}
            for (let i = 0; i < equipment_campaigns.value.length; i++) {
                campaigns[equipment_campaigns.value[i].id] = equipment_campaigns.value[i].campaign_name;
            }

        } catch (err) {
            if (err.message == "Failed to fetch") err.message = "Failed to connect to the server, try again later.";
            showError(attemptJsonParse(err.message, "message"), 'Error');
            return
        }

        // Get equipment list
        try {

            const equipments = await api('POST', 'equipment/all', {amount: 30, filters, page: currentPage});
            totalPages = equipments.pages; // Update total pages
            if (currentPage > totalPages) currentPage = totalPages;

            totalItems = equipments.count; // Update total items

            // Update items list
            items = [];
            for (let i = 0; i < equipments.value.length; i++) {
                items.push({id: equipments.value[i].id,
                            name: equipments.value[i].equipment_name,
                            type: equipments.value[i].equipment_type,
                            status: equipments.value[i].equipment_status,
                            location: equipments.value[i].equipment_location,
                            description: equipments.value[i].equipment_description,
                            campaign: equipments.value[i].equipment_campaign,
                            model: equipments.value[i].equipment_model,
                            brand: equipments.value[i].equipment_brand,
                            agent: equipments.value[i].equipment_agent,
                            serial_number: equipments.value[i].equipment_serial_number,
                            modified_at: new Date(equipments.value[0].modified_at).toLocaleString()
                        });
            }

        } catch (err) {
            if (err.message == "Failed to fetch") err.message = "Failed to connect to the server, try again later.";
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }

    }

    // Load the equipment list on page load
    onMount(async () => {
        await reload();
    });

    
</script>

<ScannerListener on:onScan={onScan}/>

{#if error}
        <Popup title={errorTitle} message={errorMessage} bind:visible={error} okButton={true} cancelButton={hasCancelBtn} on:onOk={onOkError} on:onCancel={onCancelError}/>
{/if}

{#if newItemWindow}
        <PopupForm title={newItemWindowTitle} bind:visible={newItemWindow} okButton={true} cancelButton={true} structure={newItemStructure} on:onOk={onAddNewItem}/>
{/if}

<ContainerPanel>
    <List {properties} {items} {selectedItem} {types} {campaigns} {totalPages} bind:currentPage={currentPage} on:onItemSelected={onItemSelected} on:onNextPage={onNextPage}/>
</ContainerPanel>

<PropertyPanel>

    <Header title="Search" icon="assets/filter-icon.svg" />
    <FilterBox properties={[].concat(properties, ["serial_number", "agent", "brand", "model"])} bind:filters/>
    <div class="row-wrapper" style="justify-content: flex-end;">
        {#if totalItems > 0}
            <button class="btn" on:click={onClickDownload} style="--btn-color: #ccc;"><img src="assets/csv-icon.svg" alt="Search" style="width: 15px; height: 15px; margin-right: 5px;">Download</button>
        {/if}
        <button class="btn" on:click={onClickAddQuery} style="--btn-color: #ccc;"><span style="font-weight:bold;">+</span> Add New Query</button>
        <button class="btn" on:click={onClickSearch} style="--btn-color: #ccc;"><img src="assets/search-icon.svg" alt="Search" style="width: 15px; height: 15px; margin-right: 5px;">Search</button>
    </div>
    {#if totalItems > 0}
        <b style="margin-left: auto; margin-right: 10px;">Found {totalItems} items.</b>
    {/if}

    <Header title="Properties" icon="assets/params-icon.svg" />
    <DetailForm {selectedItem} structure={newItemStructure} on:onUpdate={(e) => {showError("Update this item?", "Item Update", () => {}, () => {onClickUpdate(e)}, true)}} on:onDelete={(e) => {showError("Delete this item permanently?", "Item Deletion", () => {}, () => {onClickDelete(e)}, true)}}/>
    <button class="btn btn-add-item" style="--btn-color: green; border-width: 3px; font-size: large;" on:click={() => newItemWindow = true}><span style="font-weight:bold;">+</span> Add New Item</button>

</PropertyPanel>

<style>
    .row-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
    }
    .btn {
        background-color: #fff;
        border: 1px solid var(--btn-color);
        border-radius: 5px;
        padding: 5px 10px;
        margin-right: 10px;
        cursor: pointer;
        transition: all 0.3s;
    }
    .btn:hover {
        background-color: var(--btn-color);
    }
    .btn-add-item {
        color: green;
        margin-left: auto;
        margin-right: auto;
        margin-top: auto;
        margin-bottom: 10px;
    }
    .btn-add-item:hover {
        color: white;
    }
</style>