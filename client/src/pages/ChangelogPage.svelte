<div class="wrapper">
    <div class="panel scrollbar-style">
        <h2>Version 1.0.5</h2>
        <ul>
            <li>Added pagination for the lists.</li>
            <li>Added "Not Returned - Formal Notice" as new equipment status.</li>
            <li>Added the changelog page.</li>
            <li>The list will now be ordered by ID and missing IDs will be replaced on an item's creation.</li>
            <li>Fixed the item duplication bug when filtering by equipment type.</li>
        </ul> 
        <div class="separator"></div>
        <h2>Version 1.0.1</h2>
        <ul>
            <li>Fixed the interface for smaller screens.</li>
            <li>Added a new scrollbar style.</li>
        </ul>
        <div class="separator"></div>
        <h2>Version 1.0.0</h2>
        <ul>
            <li>Initial release of the application.</li>
        </ul>
        <div class="separator"></div>
        <h2>TODO</h2>
        <ul>
            <li>Implement the agents page.</li>
            <li>Link up the agents to their equipment.</li>
            <li>Implement the exchange log page.</li>
            <li>Implement user modification description.</li>
            <li>And more...</li>
        </ul>
    </div>  
</div>

<style>
    li {
        word-wrap: break-word;
        width: 30vw;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 0 auto;
        padding: 0;
        overflow-y: auto;
    }

    .panel {
        background-color: white;
        box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.2);
        border-radius: 10px 10px 10px 10px;
        height: 50%;
        width: 50%;
        padding: 15px;
        overflow-x: hidden;
    }

    .scrollbar-style::-webkit-scrollbar {
        background-color: lightgray;
        border-radius: 10px;
        width: 10px;
        height: 20px;;
    }

    .scrollbar-style::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        border-radius: 10px;
    }
    .separator {
        width: 100%; 
        text-align: center; 
        border-bottom: 1px solid #ccc; 
        line-height: 0.1em;
        margin: 30px 0 40px; 
    }
</style>