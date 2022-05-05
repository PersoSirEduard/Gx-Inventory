<svelte:options accessors/>

<script>
    import InputBox from "./InputBox.svelte";
    import RichInputBox from "./RichInputBox.svelte";
    import { createEventDispatcher, onMount } from 'svelte';
    const dispatch = createEventDispatcher();

    export let title = "";
    export let structure = [];
    export let visible = false;
    export let okButton = false;
    export let cancelButton = false;
    export let okButtonName = "Add";
    export let cancelButtonName = "Cancel";

    let window;
    let screenHeight = 1;

    onMount(() => {
        let heightPerc = window.offsetHeight / screenHeight * 100;
        window.style.top = String(50 - (heightPerc / 2)) + "%";
    });

    let output = {};

    const onLoad = () => {
        output = {};
        for (let r = 0; r < structure.length; r++) {
            for (let c = 0; c < structure[r].length; c++) {
                output[structure[r][c].name] = null;
            }
        }
    };

    const pressedOK = () => {
        visible = false;

        // Generate item
        let newItem = {}
        for (const [key, element] of Object.entries(output)) {
            newItem[key] = element.value;
        }

        dispatch('onOk', newItem);
    };

    const pressedCancel = () => {
        visible = false;
        dispatch('onCancel');
    };

</script>


<svelte:window on:load={onLoad} bind:innerHeight={screenHeight}/>

<div class="background" on:click={() => visible = false}></div>
<div class="window srollbar-style" bind:this={window}>

    <!-- Close button -->
    <button class="exitBtn" on:click={() => visible = false}>X</button>
    <!-- Title of the window -->
    <p style="font-size: x-large; text-align: center;">{title}</p>

    <!-- Generate the form -->
    {#each structure as row}
        <div class="row-wrapper">
            {#each row as column}
                <div>

                    <label for={column.name}>{column.label}:</label>

                    <!-- Input box -->
                    {#if column.type === "text"}
                        <InputBox id={column.name} bind:this={output[column.name]} value={column.value} width="100%"/>

                    <!-- Combo box array -->
                    {:else if column.type === "select"}
                        <select id={column.name} bind:this={output[column.name]} style="margin: 8px 0; width: 100%;" value={column.value}>
                            {#each column.values as val}
                                <option value={val}>{val}</option>
                            {/each}
                        </select>

                    <!-- Combo box obj -->
                    {:else if column.type === "select-obj"}
                        <select id={column.name} bind:this={output[column.name]} style="margin: 8px 0; width: 100%;" value={column.value}>
                            {#each Object.entries(column.values) as [key, val]}
                                <option value={key}>{val}</option>
                            {/each}
                        </select>

                    <!-- Rich text box -->
                    {:else if column.type === "richtext"}
                        <RichInputBox id={column.name} bind:this={output[column.name]} value={column.value} height="110px"/>
                    {/if}
                </div>
            {/each}
        </div>
    {/each}
    
    <!-- Control buttons -->
    <div class="buttons">
        {#if okButton}
            <button style="--btn-color: green;" class="controlBtn" on:click={pressedOK}>{okButtonName}</button>
        {/if}
        {#if cancelButton}
            <button style="--btn-color: red;" class="controlBtn" on:click={pressedCancel}>{cancelButtonName}</button>
        {/if}
    </div>

</div>


<style>
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
    .window {
        position: absolute;
        z-index: 4;
        width: 25%;
        min-height: 15%;
        background-color: white;
        border-radius: 10px 10px 10px 10px;
        padding: 10px;
        left: 37.5%;
        animation: zoomin 0.7s;
    }
    .background {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: black;
        top: 0;
        left: 0;
        opacity: 0.3;
        animation: fadein 0.7s;
        z-index: 2;
    }

    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 0.3; }
    }

    @keyframes zoomin {
        from { transform: scale(0); }
        to   { transform: scale(1) ;; }
    }
    .exitBtn {
        position: absolute;
        top: 0;
        right: 0;
        background-color: white;
        border: none;
        border-radius: 10px;
        padding: 5px;
        margin-right: 5px;
        font-size: large;
        cursor: pointer;
    }
    .buttons {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .controlBtn {
        border: none;
        color: white;
        min-width: 80px;
        padding: 5px 10px;
        background-color: transparent;
        color: var(--btn-color);
        border: 2px solid var(--btn-color);
        border-radius: 10px;
        margin: 0 10px;
        transition: all 0.2s;
        cursor: pointer;
    }
    .controlBtn:hover {
        background-color: var(--btn-color);
        color: white;
    }
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
</style>