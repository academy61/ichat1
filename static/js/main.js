document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Generate a simple, unique-enough session ID for this client
    const sessionId = 'user_' + Math.random().toString(36).substr(2, 9);

    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messageArea = document.getElementById('message-area');

    // Function to handle sending a message
    const sendMessage = () => {
        const msg = messageInput.value;
        if (msg) {
            // Send a message object instead of just a string
            socket.emit('message', { text: msg, senderId: sessionId });
            messageInput.value = '';
        }
    };

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Listen for incoming messages from the server
    socket.on('message', (data) => {
        // Determine if the message was sent by the current user or received from another
        const messageType = data.senderId === sessionId ? 'sent' : 'received';
        appendMessage(data.text, messageType);
    });

    function appendMessage(msg, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = msg;
        messageArea.appendChild(messageElement);
        // Auto-scroll to the latest message
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // --- Profile Sidebar Logic ---
    const appContainer = document.querySelector('.app-container');
    const profileButton = document.getElementById('profile-button');
    const closeProfileButton = document.getElementById('close-profile-button');

    profileButton.addEventListener('click', () => {
        appContainer.classList.add('profile-visible');
    });

    closeProfileButton.addEventListener('click', () => {
        appContainer.classList.remove('profile-visible');
    });

    // --- Settings Dropdown Logic ---
    const menuButton = document.getElementById('menu-button');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const settingsButton = document.getElementById('settings-button');

    menuButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the window click listener from firing immediately
        settingsDropdown.classList.toggle('show');
    });

    settingsButton.addEventListener('click', () => {
        console.log('Settings clicked!');
        settingsDropdown.classList.remove('show');
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (!event.target.matches('#menu-button')) {
            if (settingsDropdown.classList.contains('show')) {
                settingsDropdown.classList.remove('show');
            }
        }
    });
});
