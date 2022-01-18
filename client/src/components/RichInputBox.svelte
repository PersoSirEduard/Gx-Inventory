<svelte:options accessors/>

<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let value = "";
    export let width = "auto";
    export let height = "auto";
    export let maxLength = 100;
    let currentLength = 0;

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            value = e.target.value;
            e.target.focus();
            dispatch('onEnter', value);
        } else {
            dispatch('onKeyDown', value);
        }
    };

    const onTextChange = (e) => {
        dispatch('onEnter', e.target.value);
        currentLength = e.target.value.length;
    };


</script>

<div class="container">
    <textarea bind:value style="width: {width}; height: {height};" {maxLength} on:keypress={onKeyDown} on:input={onTextChange}></textarea>
    <p class="lengthText">{maxLength - currentLength}</p>
</div>


<style>
    .container {
        margin: 8px 0;
        padding: 0;
        border: none;
        display: grid;
    }
    textarea {
        padding: 6px 10px;
        box-sizing: border-box;
        resize: none;
        width: 100%;
        height: 100%;
    }
    .lengthText{
        font-size: 12px;
        color: #999;
        text-align: right;
        margin-top: 0;
        margin-bottom: 0;
        height: 20px;
    }
</style>