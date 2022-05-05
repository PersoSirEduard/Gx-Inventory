<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let items = [];
    export let properties = [];
    export let selectedItem = null;
    export let types;
    export let campaigns;
    export let totalPages = 1;
    export let currentPage = 1;

    const onItemSelected = (item) => {
        dispatch('onItemSelected', item);
    }

    const onNextPage = () => {

        // Limit to max pages
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        // Get the next page
        dispatch('onNextPage');
    }

</script>

<table class="srollbar-style">
    <tr on:click={() => onItemSelected(null)}>
        {#each properties as property}
            <th>{property.charAt(0).toUpperCase() + property.slice(1)}</th>
        {/each}
    </tr>
    {#each items as item}
        <tr on:click={() => onItemSelected(item) } style="{selectedItem != null && selectedItem.id == item.id ? "background-color: lightblue;" : ""}">
            {#each properties as property}
                {#if property === "type"}
                    <td>{types[item[property]]}</td>
                {:else if property == "campaign"}
                    <td>{campaigns[item[property]]}</td>
                {:else}
                    <td>{item[property]}</td>
                {/if}
            {/each}
        </tr>
    {/each}

</table>
<div style="width:100%; display: flex; justify-content: center; margin-top: 10px;">
    {#if currentPage > 1}
        <button class="btn" style="--btn-color: #ccc;" on:click={() => { currentPage--; onNextPage(); }}>Back</button>
    {/if}
    <span style="color: rgb(192, 192, 192); text-align: center; margin-top: 5px; padding-left: 10px; padding-right: 10px;">{items.length} items on this page. ({currentPage}/{totalPages})</span>
    {#if currentPage < totalPages}
        <button class="btn" style="--btn-color: #ccc;" on:click={() => { currentPage++; onNextPage(); }}>Next</button>
    {/if}
</div>

<style>
    .srollbar-style::-webkit-scrollbar {
        background-color: lightgray;
        border-radius: 10px;
        width: 10px;
        height: 20px;;
    }
    .srollbar-style::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        border-radius: 10px;
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }

    th, td {
        padding: 0.5rem 1rem;
        text-align: left;
        height: 50px;
    }

    th {
        border-bottom: 1px solid black;
        position: sticky;
        top: 0;
        background-color: white;
    }

    tr:nth-child(even) {
        background-color: #fafafa;
    }

    tr:nth-child(odd) {
        background-color: #eee;
    }

    tr:hover {
        background-color: #ddd;
    }

    tr:first-child {
        background-color: #ffffff;
        font-size: large;
    }

    .btn {
        background-color: #fff;
        border: 1px solid var(--btn-color);
        border-radius: 8px;
        padding: 5px 10px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn:hover {
        background-color: var(--btn-color);
    }
</style>