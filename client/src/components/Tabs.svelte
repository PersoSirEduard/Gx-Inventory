<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let items;
    export let activeItem;

    const onLogout = () => {
        dispatch('onLogout');
    };

</script>

<div class="tabs">
    <ul>
        {#each items as item}
            <li on:click={() => dispatch('tabChange', item)}>
               <div class:active={item === activeItem}>{item}</div>
            </li>
        {/each}
    </ul>

    <!-- Logout button -->
    <button type="button" class="logoutBtn" on:click={onLogout}><img src="../assets/power-icon.svg" alt="Logout" /><span>Log out</span></button>
</div>

<style>
    .tabs {
        padding-left: 15px;
        display: flex;
        flex-direction: row;
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
    .logoutBtn {
        display: flex;
        flex-direction: row;
        align-items: center;
        border: none;
        background-color: transparent;
        height: 40px;
        margin-top: auto;
        margin-bottom: auto;
        margin-left: auto;
        margin-right: 12px;
        cursor: pointer;
        overflow: hidden;
        width: 40px;
        transition: width 0.3s ease-in-out;
    }

    .logoutBtn:hover {
        width: 100px;
    }
    .logoutBtn img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
    .logoutBtn span {
        vertical-align: middle;
        text-align: center;
        display: inline-block;
        white-space: nowrap;
        opacity: 0;
        transition: all 0.3s ease-in-out;
    }

    .logoutBtn:hover span {
        vertical-align: middle;
        text-align: center;
        opacity: 1;
    }
</style>