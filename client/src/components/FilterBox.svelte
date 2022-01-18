<script>
    import FilterItem from './FilterItem.svelte';
    
    export let properties;
    export let filters;

    const onRemoveFilter = (e) => {
        filters = filters.filter(filter => filter.id !== e.detail);
    }
    
</script>

<div class="container">
    {#if filters.length == 0}
        <p class="no-filter">No filters selected.</p>
    {/if}
    {#each filters as filter}
        <FilterItem {properties} bind:value={filter.value} bind:selectedProperty={filter.selected} id={filter.id} on:onClose={onRemoveFilter} />
    {/each}
    
    
</div>

<style>
    .container {
        width: 100%;
        min-height: 30%;
        outline: 3px dashed rgb(148, 148, 148);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: hidden;
        margin-bottom: 20px;
    }

    .no-filter {
        text-align: center;
        font-size: large;
        color: rgb(192, 192, 192);
    }
</style>