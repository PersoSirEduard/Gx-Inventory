<script>
    import Tabs from './components/Tabs.svelte';
    import Tab from './components/Tab.svelte';
    import LogInPage from './pages/LogInPage.svelte';
    import EquipmentPage from './pages/EquipmentPage.svelte';
    import EquipmentTypePage from './pages/EquipmentTypePage.svelte';
    import CampaignPage from './pages/CampaignPage.svelte';
    import ChangelogPage from './pages/ChangelogPage.svelte';

    // Tab labels to be displayed
    let items = ["Equipment", "Equipment Type", "Campaign", "Changelog"];
    // Current page
    let activeItem = "Equipment";

    // Event handler for changing the active tab
    const tabChange = (e) => activeItem = e.detail;

    // Event handler for logging out
    const onLogout = (e) => {

        // Remove the key from localStorage and refresh the page
        localStorage.removeItem('key');
        location.reload();
    }

</script>

<!-- Browser tab information -->
<svelte:head>
	<title>Gx-Inventory</title>
	<html lang="en" />
</svelte:head>

<main>

    {#if localStorage.getItem('key') !== null }
        <Tabs {items} {activeItem} on:tabChange={tabChange} on:onLogout={onLogout}/>
        <Tab name="Equipment" {activeItem}>
            <EquipmentPage />
        </Tab>
        <Tab name="Equipment Type" {activeItem}>
            <EquipmentTypePage />
        </Tab>
        <Tab name="Campaign" {activeItem}>
            <CampaignPage />
        </Tab>
        <Tab name="Changelog" {activeItem}>
            <ChangelogPage />
        </Tab>
    {:else}
        <LogInPage />
    {/if}

    <p class="credits">Developed by Eduard Anton.</p>
</main>


<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
    main {
        background-color: #f9f9f9;
        width: 100%;
        height: 100%;
    }

    .credits {
        position: absolute;
        color: rgb(192, 192, 192);
        bottom: 0;
        margin-left: 10px;
    }

    .oups {
        margin-top: auto;
        margin-bottom: auto;
        margin-left: auto;
        margin-right: auto;
        font-size: xx-large;
    }
</style>