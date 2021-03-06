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
    let properties = ["id", "name", "description"]
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
        [{type: "richtext", label: "Description", value: "", name: "description"}]
    ];

    const onClickUpdate = async (e) => {
        
        try {

            const equipment = await api('PUT', `campaign/${selectedItem.id}`, {
                name: e.detail.name,
                description: e.detail.description
            });
            
        } catch (err) {
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }

        // Reload list
        await reload();

    };

    const onClickDelete = async (e) => {
        try {
            const response = await api('DELETE', `campaign/${selectedItem.id}`);

            await reload();
        } catch (err) {
            showError(attemptJsonParse(err.message, "message"), 'Error');
        }
    };

    // Add item panel
    $: newItemStructure = [
        [{type: "text", label: "Name", value: "", name: "name"}],
        [{type: "richtext", label: "Description", value: "", name: "description"}]
    ];
    let newItemWindow = false;
    let newItemWindowTitle = 'Add Campaign';

    // Scanning listener
    const onScan = async (e) => {
        // Open new equipment window

        try {
            const campaign = await api('GET', `campaign/${e.detail}`);
            
            // Found equipment already in list
            if (campaign != undefined && campaign.value != undefined) {
                selectedItem = {id: campaign.value.id, name: campaign.value.campaign_name, description: campaign.value.campaign_description}
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
            const response = await api('POST', 'campaign', e.detail);

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

            const campaigns = await api('POST', 'campaign/all', {amount: 30, filters, page: currentPage});

            totalPages = campaigns.pages; // Update total pages
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            // Update items list
            items = [];
            for (let i = 0; i < campaigns.value.length; i++) {
                items.push({id: campaigns.value[i].id, name: campaigns.value[i].campaign_name, description: campaigns.value[i].campaign_description});
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
    <DetailForm {selectedItem} structure={selectedItemStructure} on:onUpdate={(e) => {showError("Update this campaign?", "Campaign Update", () => {}, () => {onClickUpdate(e)}, true)}} on:onDelete={(e) => {showError("Delete this campaign permanently? (Associated items to this campain must be unassigned first)", "Campaign Deletion", () => {}, () => {onClickDelete(e)}, true)}}/>
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