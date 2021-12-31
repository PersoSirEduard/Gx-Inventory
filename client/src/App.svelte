<script>
    import Tabs from './components/Tabs.svelte';
    import Tab from './components/Tab.svelte';
    import PropertyPanel from './components/PropertyPanel.svelte';
import ContainerPanel from './components/ContainerPanel.svelte';

    let items = ["Home", "Equipment", "Equipment Type", "Agents", "Transactions"];
    let activeItem = "Home";

    const tabChange = (e) => activeItem = e.detail;

</script>

<main>
    <Tabs {items} {activeItem} on:tabChange={tabChange} />
    <Tab name="Home" {activeItem}>
        <ContainerPanel>
            <h1>Home page</h1>
        </ContainerPanel>
        <PropertyPanel />
    </Tab>
    <Tab name="Equipment" {activeItem}>
        <h1>Page Two</h1>
    </Tab>
    <Tab name="Equipment Type" {activeItem}>
        <h1>Page Three</h1>
    </Tab>
    <Tab name="Agents" {activeItem}>
        <h1>Page Four</h1>
    </Tab>
    <Tab name="Transactions" {activeItem}>
        <h1>Page Five</h1>
    </Tab>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
    main {
        background-color: #f9f9f9;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
</style>