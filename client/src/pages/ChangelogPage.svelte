<div class="wrapper">
    <div class="panel scrollbar-style">
        <h2>Version 1.3.0</h2>
        <ul>
            <li>Added configurable properties (has brand, has model, and has serial number) to equipment types.</li>
            <li>Enhanced the general resize layout of the property and search panels.</li>
            <li>Change to the list header that will now remain visible (sticked to the top) at any time.</li>
            <li>Added a new login page design.</li>
        </ul> 
        <div class="separator"></div>
        <h2>Version 1.2.1</h2>
        <ul>
            <li>Added new popup functionalities. When deleting or updating an item, a prompt message will first appear to confirm the alteration.</li>
            <li>Fixed the bug where new searches would glitch the displayed page if the new search page count was smaller than the previous search page count.</li>
            <li>Fixed popup error message format. It should be friendlier now.</li>
            <li>Improved general application stability.</li>
        </ul> 
        <div class="separator"></div>
        <h2>Version 1.2.0</h2>
        <ul>
            <li>Added a visible item counter.</li>
            <li>Added a 'modified_at' property that can only be viewed, for the moment, by downloading the database.</li>
            <li>Optimized the backend server and database.</li>
            <li>Added a download database feature to export results in CSV files.</li>
            <li>Fixed the bug where items would duplicate from one page to another.</li>
        </ul> 
        <div class="separator"></div>
        <h2>Version 1.1.5</h2>
        <ul>
            <li>Added brand field property for equipments.</li>
            <li>Added model field property for equipments.</li>
            <li>Added agent field property for equipments.</li>
            <li>Change with the serial number that will only be available for certain equipment type.</li>
            <li>Fixed the bug where empty fields would not save.</li>
        </ul> 
        <div class="separator"></div>
        <h2>Version 1.1.0</h2>
        <ul>
            <li>Removed the agent page.</li>
            <li>Added the campaign page.</li>
            <li>Added the serial number and agent fields for equipments.</li>
            <li>Fixed total visible pages bug (?).</li>
        </ul> 
        <div class="separator"></div>
	    <h2>Version 1.0.6</h2>
        <ul>
            <li>Fixed the crashing issue when sometimes creating a new item.</li>
        </ul> 
        <div class="separator"></div>
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