<script>
    export let title;
    export let icon;
    export let iconColor = 'black';
</script>

<div class="header">
    <img src={icon} style="fill: {iconColor};" class="logo" alt={title}/>
    <p>{title}</p>
</div>

<style>
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: black solid 1px;
        padding-bottom: 5px;
        margin-bottom: 15px;
    }

    .logo {
        width: 25px;
        height: 25px;
        margin-right: 10px;
    }

    p {
        font-size: x-large;
        padding: 0;
        margin: 0;
    }
</style>