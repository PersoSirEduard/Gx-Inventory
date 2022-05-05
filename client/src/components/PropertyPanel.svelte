<script>

</script>

<div class="panel srollbar-style">
    <slot></slot>
</div>

<style>
    .panel {
        float: right;
        background-color: white;
        display: flex;
        flex-direction: column;
        box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.2);
        border-radius: 10px 10px 10px 10px;
        width: 20%;
        min-width: 320px;
        height: auto;
        margin-right: 40px;
        margin-top: 10px;
        margin-bottom: 110px;
        padding: 15px;
        overflow-y: auto;
    }

    .srollbar-style::-webkit-scrollbar {
        background-color: lightgray;
        border-radius: 10px;
        width: 10px;
        height: 20px;
    }

    .srollbar-style::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        border-radius: 10px;
    }
</style>