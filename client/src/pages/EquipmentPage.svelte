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
    import { genId, api } from '../helpers/utils.js';


    // Global variables
    let properties = ["id", "name", "type", "status", "location", "campaign"]
    let types = {}
    let campaigns = {}
    let filters = []
    let items = []
    let selectedItem = null;
    let currentPage = 1;
    let totalPages = 1;

    // Global error variables
    let error = false;
    let errorTitle = 'Error';
    let errorMessage = '';

    // Container panel
    // On new item selected event
    const onItemSelected = (e) => {
            if (e.detail == null) {
                selectedItem = null;
                return;
            }
            const id = e.detail.id;
            selectedItem = items.find(item => item.id === id);
        };

    // Property panel
    // Seach panel
    const onClickSearch = async () => {
        await reload();
    };

    const onClickAddQuery = () => {
        if (filters.length >= 5) {
            error = true;
            errorTitle = 'Too many filters';
            errorMessage = 'You can only have a maximum of 5 filters.';
            return;
        }
        filters.push({value: "", selected: properties[0], id: genId()});
        filters = filters;
    };


    // Properties panel
    const onUpdate = async (e) => {
        
        try {

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
            
        } catch (e) {
            error = true;
            errorTitle = 'Error';
            errorMessage = e.message;
        }

        // Reload list
        await reload();

    };

    const onDelete = async (e) => {
        try {
            const response = await api('DELETE', `equipment/${selectedItem.name}`);

            await reload();
        } catch (e) {
            error = true;
            errorTitle = 'Error';
            errorMessage = e.message;
        }
    };

    // Add item panel
    $: newItemStructure = [
        [{type: "text", label: "Name", value: "", name: "name"}, {type: "select-obj", label: "Type", value: Object.keys(types)[0], values: types, name: "type"}],
        [{type: "text", label: "Location", value: "", name: "location"}, {type: "select", label: "Status", value: "In Stock", values: ["In Stock", "In Use", "Unknown", "Not Returned - Formal Notice"], name: "status"}],
        [{type: "text", label: "Agent Name", value: "", name: "agent"}, {type: "select-obj", label: "Campaign", value: Object.keys(campaigns)[0], values: campaigns, name: "campaign"}],
        [{type: "text", label: "Brand", value: "", name: "brand"}, {type: "text", label: "Model", value: "", name: "model"}],
        [{type: "text", label: "Serial Number", value: "", name: "serial_number", onlyif: Object.entries(types).filter((el) => el[1] == "Laptop" || el[1] == "PC").map((el) => parseInt(el[0])) }],
        [{type: "richtext", label: "Description", value: "", name: "description"}]
    ];
    let newItemWindow = false;
    let newItemWindowTitle = 'Add Equipment';

    // Scanning listener
    const onScan = async (e) => {
        // Open new equipment window

        try {
            const equipment = await api('POST', `equipment/all`, {filters:[{selected: "name", value: e.detail}]});
            
            // Found equipment already in list
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
                                serial_number: equipment.value[0].equipment_serial_number};
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

    const onAddNewItem = async (e) => {
        try {
            const response = await api('POST', 'equipment', e.detail);

            // Reload list
            await reload();
        } catch (err) {
            error = true;
            errorTitle = 'Error';
            errorMessage = err;
        }
    }

    const onNextPage = async (e) => {
        await reload();
    }

    // Load equipment types and equipment lists
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
            error = true;
            errorTitle = 'Error';
            errorMessage = err;
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
            error = true;
            errorTitle = 'Error';
            errorMessage = err;
        }

        // Get equipment list
        try {

            const equipments = await api('POST', 'equipment/all', {amount: 30, filters, page: currentPage});
            totalPages = equipments.pages; // Update total pages
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

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
                            serial_number: equipments.value[i].equipment_serial_number});
            }

        } catch (err) {
            error = true;
            errorTitle = 'Error';
            errorMessage = err;
        }

    }

    onMount(async () => {
        await reload();
    });

    
</script>

<ScannerListener on:onScan={onScan}/>

{#if error}
        <Popup title={errorTitle} message={errorMessage} bind:visible={error} okButton={true}/>
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
        <button class="btn" on:click={onClickAddQuery} style="--btn-color: #ccc;"><span style="font-weight:bold;">+</span> Add New Query</button>
        <button class="btn" on:click={onClickSearch} style="--btn-color: #ccc;"><img src="assets/search-icon.svg" alt="Search" style="width: 15px; height: 15px; margin-right: 5px;">Search</button>
    </div>

    <Header title="Properties" icon="assets/params-icon.svg" />
    <DetailForm {selectedItem} structure={newItemStructure} on:onUpdate={onUpdate} on:onDelete={onDelete}/>
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