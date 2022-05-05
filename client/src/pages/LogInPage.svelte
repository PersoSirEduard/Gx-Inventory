<script>
    import Popup from '../components/Popup.svelte';
    import InputBox from '../components/InputBox.svelte';
    import { api } from '../helpers/utils.js';

    // Popup box variables
    // Invoked using showError()
    let error = false;
    let errorMessage = 'Error';
    let errorTitle = '';
    let onEndError = () => {};

    /**
     * Show an error popup box
     * @param msg : String - The message to display
     * @param title : String - The title of the popup box
     * @param onEnd : Function - The function to call when the popup box is closed
     */
    const showError = (msg, title, onEnd = () => {}) => {
        error = true;
        errorMessage = msg;
        errorTitle = title;
        onEndError = () => {
            error = false;
            onEnd();
        }
    }

    // Temporary password variable
    let inventoryKey = '';
    // Event handler for changing the stored password
    const onLogIn = (e) => {
        // Access local storage, change the password and refresh the page
        localStorage.setItem('key', inventoryKey);
        location.reload();
    };

    // Event handler for creating a new password when the client clicks on the "Request for a new key by email" button
    const onNewAuth = async (e) => {
        try {

            // Request new key by email
            // Calls the api/auth/new endpoint
            const response = await api('GET', 'auth/new');
            showError("A new key has been generated. Please verify your email inbox.", "Success", () => { location.reload();});

        } catch (err) {
            showError(err.message, "Error");
        }
    };

</script>

<div class="window">

    <!-- Generate title -->
    <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
        <div class="title">
            GX-INVENTORY
        </div>
    </div>
    

    <!-- Log in box -->
    <label style="margin-top: 35px; font-size: large;" for="loginBox">Inventory key:</label>
    <InputBox id="loginBox" bind:value={inventoryKey} width="100%" />
    <button on:click={onLogIn} style="margin-top: 15px;">Log in the inventory</button>

    <!-- New password box -->
    <div class="separator"><span>Or</span></div>
    <button on:click={onNewAuth}>Request for a new key by email</button>

    <!-- Contact label -->
    <p style="font-size: small; text-align: center; color: #ccc; margin-top: auto;">To report any issue, please contact Eduard Anton at eanton@gexel.com</p>
</div>

<!-- Background image top corner -->
<img class="background-img" src="assets/squares.png" alt="" draggable="false">

<!-- Error display -->
{#if error}
    <Popup title={errorTitle} message={errorMessage} okButton={true} on:onOk={onEndError}/>
{/if}

<style>
    .title {
        background: 50% 100% / 50% 50% no-repeat
        radial-gradient(ellipse at bottom, rgb(112, 112, 112), transparent, transparent);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-size: 40px;
        font-family: 'Consolas';
        animation: reveal 3000ms ease-in-out forwards 200ms, glow 2500ms linear infinite 2000ms;
        user-select: none;
    }
    @keyframes reveal {
            80% {
                letter-spacing: 8px;
            }
            100% {
                background-size: 300% 300%;
            }
        }
    @keyframes glow {
        40% {
            text-shadow: 0 0 8px rgb(112, 112, 112);
        }
    }
    .window {
        position: absolute;
        background-color: white;
        box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.2);
        border-radius: 10px 10px 10px 10px;
        height: 500px;
        width: 400px;
        padding: 15px;
        top: 0; bottom: 0; left: 0; right: 0;
        margin: auto;
        display: flex;
        flex-direction: column;
        z-index: 2;
    }
    .separator {
        width: 100%; 
        text-align: center; 
        border-bottom: 1px solid #ccc; 
        line-height: 0.1em;
        margin: 30px 0 40px; 
    }
    .separator span {
        background-color: white;
        color: #ccc;
        padding: 0 5px;
    }
    button {
        margin-left: auto;
        margin-right: auto;
        background-color: transparent;
        border: 1px solid #000;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
    }
    button:hover {
        background-color: #ccc;
    }

    .background-img {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        z-index: 0;
        user-select: none;
        pointer-events: none;
    }

</style>