<svelte:options accessors/>

<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let value = "";
    export let width = "auto";
    export let height = "auto";

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            value = e.target.value;
            e.target.focus();
            dispatch('onEnter', value);
        } else {
            dispatch('onKeyDown', value);
        }
    };


</script>

<input bind:value style="width: {width}; height: {height};" on:keypress={onKeyDown}>

<style>
    input {
        padding: 6px 10px;
        margin: 8px 0;
        box-sizing: border-box;
    }
</style>