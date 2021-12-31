<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let items;
    export let activeItem;

</script>

<div class="tabs">
    <ul>
        {#each items as item}
            <li on:click={() => dispatch('tabChange', item)}>
               <div class:active={item === activeItem}>{item}</div>
            </li>
        {/each}
    </ul>
</div>

<style>
    .tabs {
        /* margin-bottom: 2px; */
        padding-left: 15px;
    }
    ul {
        display: flex;
        justify-content: left;
        padding: 0;
        list-style-type: none;
    }
    li {
        margin: 0 10px;
        font-size: 18px;
        color: gray;
        cursor: pointer;
    }
    .active {
        color: black;
        border-bottom: 2px solid black;
        padding-bottom: 8px;
    }
</style>