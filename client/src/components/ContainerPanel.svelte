<script>
</script>

<div class="panel srollbar-style">
    <slot></slot>
</div>

<style>
    .panel {
        background-color: white;
        box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.2);
        border-radius: 10px 10px 10px 10px;
        flex: 1;
        height: auto;
        margin-right: 40px;
        margin-top: 10px;
        margin-left: 40px;
        margin-bottom: 110px;
        padding: 15px;
        overflow: auto;
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