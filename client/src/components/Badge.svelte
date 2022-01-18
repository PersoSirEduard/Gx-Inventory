<script>
    export let color;
</script>

<span style="--badge-color: {color}" class="badge">
    <slot></slot>
</span>

<style>
    .badge {
        color: var(--badge-color);
        background-color: transparent;
        border-radius: 10px;
        padding: 0.25em 0.5em;
        border: 1px solid var(--badge-color);
    }
</style>