<script>
    import Tabs from './components/Tabs.svelte';
    import Tab from './components/Tab.svelte';
    import LogInPage from './pages/LogInPage.svelte';
    import EquipmentPage from './pages/EquipmentPage.svelte';
    import EquipmentTypePage from './pages/EquipmentTypePage.svelte';
    import ChangelogPage from './pages/ChangelogPage.svelte';

    let items = ["Equipment", "Equipment Type", "Agents", "Exchange Log", "Changelog"];
    let activeItem = "Equipment";

    const tabChange = (e) => activeItem = e.detail;

    const onLogout = (e) => {

        // Remove the key from localStorage and refresh the page
        localStorage.removeItem('key');
        location.reload();
    }

</script>


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
        <Tab name="Agents" {activeItem}>
            <p class="oups">Oups, it seems this page is under development and will be available soon.</p>
        </Tab>
        <Tab name="Exchange Log" {activeItem}>
            <p class="oups">Oups, it seems this page is under development and will be available soon.</p>
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