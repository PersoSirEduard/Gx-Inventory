<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let title = "Error";
    export let message = "Hello World";
    export let visible = false;
    export let okButton = false;
    export let cancelButton = false;
    export let okButtonName = "OK";
    export let cancelButtonName = "Cancel";

    const pressedOK = () => {
        visible = false;
        dispatch('onOk');
    };

    const pressedCancel = () => {
        visible = false;
        dispatch('onCancel');
    };

</script>

<div class="background" on:click={() => visible = false}></div>
<div class="window">
    <button class="exitBtn" on:click={() => visible = false}>X</button>
    <p style="font-size: x-large">{title}</p>
    <p style="font-size: large">{message}</p>
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
    .window {
        position: absolute;
        width: 20%;
        min-height: 15%;
        top: 50%;
        left: 50%;
        margin: -5% 0 0 -10%;
        background-color: white;
        border-radius: 10px 10px 10px 10px;
        padding: 10px;
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
    }

    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 0.3; }
    }

    @keyframes zoomin {
        from { transform: scale(0); }
        to   { transform: scale(1); }
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

    .window p {
        text-align: center;
        overflow: hidden;
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

</style>