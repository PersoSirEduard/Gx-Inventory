<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let totalString = "";
    let lastTime = new Date();

    function handleKeydown(e) {
        let nowTime = new Date();
        let delta = nowTime - lastTime;

        if (delta <= 10) {
            if (e.key === "Enter") {
                dispatch("onScan", totalString);
            }
            totalString += e.key;
        } else {
            totalString = e.key;
        }

        lastTime = nowTime;
    }

</script>

<svelte:window on:keydown={handleKeydown}/>