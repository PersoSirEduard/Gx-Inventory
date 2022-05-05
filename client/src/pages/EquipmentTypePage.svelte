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


    // Global variables
    let properties = ["id", "name", "description", "hasSerialNumber", "hasBrand", "hasModel"]
    let filters = []
    let items = []
    let selectedItem = null;
    let currentPage = 1;
    let totalPages = 1;

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
        currentPage = 1;
        await reload();
    };

    const onClickAddQuery = () => {
        if (filters.length >= 5) {
            showError('You can only have a maximum of 5 filters.', 'Too many filters');
            return;
        }
        filters.push({value: "", selected: properties[0], id: genId()});
        filters = filters;
    };


    // Properties panel
    $: selectedItemStructure = [
        [{type: "text", label: "Name", value: "", name: "name"}],
        [{type: "select", label: "Has Serial Number", value: "false", values: ["false", "true"], name: "hasSerialNumber"}],
        [{type: "select", label: "Has Brand", value: "false", values: ["false", "true"], name: "hasBrand"}, {type: "select", label: "Has Model", value: "false", values: ["false", "true"], name: "hasModel"}],
        [{type: "richtext", label: "Description", value: "", name: "description"}]
    ];

    const onClickUpdate = async (e) => {
        
        try {

            const equipment = await api('PUT', `equipment_type/${selectedItem.id}`, {
                name: e.detail.name,
                description: e.detail.description,
                hasSerialNumber: e.detail.hasSerialNumber,
                hasBrand: e.detail.hasBrand,
                hasModel: e.detail.hasModel
            });
            
        } catch (err) {
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }

        // Reload list
        await reload();

    };

    const onClickDelete = async (e) => {
        try {
            const response = await api('DELETE', `equipment_type/${selectedItem.id}`);

            await reload();
        } catch (err) {
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }
    };

    // Add item panel
    $: newItemStructure = [
        [{type: "text", label: "Name", value: "", name: "name"}],
        [{type: "select", label: "Has Serial Number", value: "false", values: ["false", "true"], name: "hasSerialNumber"}],
        [{type: "select", label: "Has Brand", value: "false", values: ["false", "true"], name: "hasBrand"}, {type: "select", label: "Has Model", value: "false", values: ["false", "true"], name: "hasModel"}],
        [{type: "richtext", label: "Description", value: "", name: "description"}]
    ];
    let newItemWindow = false;
    let newItemWindowTitle = 'Add Equipment Type';

    // Scanning listener
    const onScan = async (e) => {
        // Open new equipment window

        try {
            const equipmentType = await api('GET', `equipment_type/${e.detail}`);
            
            // Found equipment already in list
            if (equipmentType != undefined && equipmentType.value != undefined) {
                selectedItem = {id: equipmentType.value.id, 
                    name: equipmentType.value.equipment_type_name, 
                    description: equipmentType.value.equipment_type_description, 
                    hasSerialNumber: equipmentTypes.value[i].has_serial_number,
                    hasBrand: equipmentTypes.value[i].has_brand,
                    hasModel: equipmentTypes.value[i].has_model
                };
            }
            else {
                // Equipment not found. Create new item
                newItemWindow = true;
                newItemStructure[0][0].value = e.detail;
            }

        } catch (err) {
            newItemWindow = true;
            newItemStructure[0][0].value = e.detail;
        }

        
    };

    // Popup form
    const onAddNewItem = async (e) => {
        try {
            const response = await api('POST', 'equipment_type', e.detail);

            // Reload list
            await reload();
        } catch (err) {
            showError(attemptJsonParse(err.message, "message"), 'Error');
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

            const equipmentTypes = await api('POST', 'equipment_type/all', {amount: 30, filters, page: currentPage});

            totalPages = equipmentTypes.pages; // Update total pages
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            // Update items list
            items = [];
            for (let i = 0; i < equipmentTypes.value.length; i++) {
                items.push({id: equipmentTypes.value[i].id, 
                    name: equipmentTypes.value[i].equipment_type_name, 
                    description: equipmentTypes.value[i].equipment_type_description, 
                    hasSerialNumber: equipmentTypes.value[i].has_serial_number,
                    hasBrand: equipmentTypes.value[i].has_brand,
                    hasModel: equipmentTypes.value[i].has_model,
                });
            }

        } catch (err) {
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }

    }

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
    <List {properties} {items} {selectedItem} types={{}} {totalPages} bind:currentPage={currentPage} on:onItemSelected={onItemSelected} on:onNextPage={onNextPage}/>
</ContainerPanel>

<PropertyPanel>

    <Header title="Search" icon="assets/filter-icon.svg" />
    <FilterBox {properties} bind:filters/>
    <div class="row-wrapper" style="justify-content: flex-end;">
        <button class="btn" on:click={onClickAddQuery} style="--btn-color: #ccc;"><span style="font-weight:bold;">+</span> Add New Query</button>
        <button class="btn" on:click={onClickSearch} style="--btn-color: #ccc;"><img src="assets/search-icon.svg" alt="Search" style="width: 15px; height: 15px; margin-right: 5px;">Search</button>
    </div>

    <Header title="Properties" icon="assets/params-icon.svg" />
    <DetailForm {selectedItem} structure={selectedItemStructure} on:onUpdate={(e) => {showError("Update this equipment type?", "Equipment Type Update", () => {}, () => {onClickUpdate(e)}, true)}} on:onDelete={(e) => {showError("Delete this equipment type permanently? (Associated items to this type must be unassigned first)", "Equipment Type Deletion", () => {}, () => {onClickDelete(e)}, true)}}/>
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