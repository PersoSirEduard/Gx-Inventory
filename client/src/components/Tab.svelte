<script>
    export let name;
    export let activeItem;
</script>

{#if activeItem === name}
<div class="tab">
    <slot></slot>
</div>
{/if}

<style>
    .tab {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
    }
</style>
