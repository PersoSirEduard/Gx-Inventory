<svelte:options accessors/>

<script>
    import InputBox from "./InputBox.svelte";
    import RichInputBox from "./RichInputBox.svelte";
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let selectedItem = null;
    export let structure = [];

    let output = {};

    const onLoad = () => {
        output = {};
        for (let r = 0; r < structure.length; r++) {
            for (let c = 0; c < structure[r].length; c++) {
                output[structure[r][c].name] = null;
            }
        }
    };

    const onUpdate = () => {

        let newItem = {}
        for (const [key, element] of Object.entries(output)) {
            newItem[key] = element.value;
        }
        
        dispatch('onUpdate', newItem);
    };

    const onDelete = (e) => {
        dispatch('onDelete', selectedItem);
    };

</script>

<svelte:window on:load={onLoad}/>

<div class="container srollbar-style">

    {#if selectedItem != null}

    {#each structure as row}
    <div class="row-wrapper">
        {#each row as column}
            <div>

                <label for={column.name}>{column.label}:</label>

                <!-- Input box -->
                {#if column.type === "text"}
                    <InputBox id={column.name} bind:this={output[column.name]} value={String(selectedItem[column.name])} width="100%"/>

                <!-- Combo box array -->
                {:else if column.type === "select"}
                    <select id={column.name} bind:this={output[column.name]} style="margin: 8px 0; width: 100%;" value={String(selectedItem[column.name])}>
                        {#each column.values as val}
                            <option value={String(val)}>{val}</option>
                        {/each}
                    </select>

                <!-- Combo box obj -->
                {:else if column.type === "select-obj"}
                    <select id={column.name} bind:this={output[column.name]} style="margin: 8px 0; width: 100%;" value={String(selectedItem[column.name])}>
                        {#each Object.entries(column.values) as [key, val]}
                            <option value={String(key)}>{val}</option>
                        {/each}
                    </select>

                <!-- Rich text box -->
                {:else if column.type === "richtext"}
                    <RichInputBox id={column.name} bind:this={output[column.name]} value={String(selectedItem[column.name])} height="110px"/>
                {/if}
            </div>
        {/each}
    </div>
{/each}

    <div class="row-wrapper" style="justify-content: center; margin-top: 0;">
        <button style="margin-right: 10px; --btn-color: red;" on:click={onDelete}>Delete</button>
        <button on:click={onUpdate} style="--btn-color: green;">Update</button>
    </div>
    
    {:else}
        <p class="no-item-selected">No item selected.</p>
    {/if}
</div>

<style>
    .container {
        padding: 5px;
        overflow-y: none;

    }
    .row-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
        justify-content: space-between;
    }
    .row-wrapper > div {
        flex: 50%;
    }
    .row-wrapper > div:first-child {
        margin-right: 2px
    }
    .row-wrapper > div:last-child {
        margin-left: 2px;
    }
    button {
        background-color: #fff;
        border: 1px solid var(--btn-color);
        color: var(--btn-color);
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        transition: all 0.3s;
        min-width: 80px;
    }
    button:hover {
        background-color: var(--btn-color);
        color: white;
    }
    .no-item-selected {
        text-align: center;
        font-size: large;
        color: rgb(192, 192, 192);
    }
</style>