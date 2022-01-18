<script>
    import InputBox from './InputBox.svelte'
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let value;
    export let properties;
    export let selectedProperty;
    export let id;

    const onClose = (e) => {
        dispatch('onClose', id);
    };

</script>

<div class="container">
    <p>Contains <InputBox bind:value width='20%' /> in <select style="width: 28%;" bind:value={selectedProperty}>
        {#each properties as property}
            {#if property !== 'id'}
                <option value={property}>{property}</option>
            {/if}
        {/each}
    </select></p>
    <button on:click={onClose}>Remove</button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        margin: 10px 10px;
        width: 90%;
        border: 1px solid black;
        border-radius: 10px;
        align-items: center;
    }
    .container p {
        text-align: center;
    }
    .container button {
        background-color: transparent;
        border-radius: 20px;
        text-align: center;
        padding: 3px 5px;
        border: 1px solid red;
        color: red;
        cursor: pointer;
        margin-right: 10px;
        transition: all 0.2s;
    }

    .container button:hover {
        background-color: red;
        color: white;
    }
</style>