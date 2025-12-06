const socket = io();

// DOM Elements
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');
const currentUsernameDisplay = document.getElementById('current-username');
const userCountDisplay = document.getElementById('user-count');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const imageInput = document.getElementById('image-input');

let currentUsername = '';

// Login Form Submit
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    socket.emit('authenticate', { username, password });
});

// Authentication Response
socket.on('authenticated', (data) => {
    if (data.success) {
        currentUsername = data.username;
        currentUsernameDisplay.textContent = currentUsername;
        loginContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        messageInput.focus();
        loginError.textContent = '';
    } else {
        loginError.textContent = data.message || 'Authentication failed';
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Send Message
function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        socket.emit('chat-message', { text });
        messageInput.value = '';
        messageInput.focus();
    }
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Handle Image Upload
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            imageInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            socket.emit('image-message', { image: event.target.result });
            imageInput.value = '';
        };
        reader.readAsDataURL(file);
    }
});

// Receive Chat Message
socket.on('chat-message', (data) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const time = new Date(data.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-username">${escapeHtml(data.username)}</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-text">${escapeHtml(data.text)}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
});

// Receive Image Message
socket.on('image-message', (data) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const time = new Date(data.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const img = document.createElement('img');
    img.src = data.image;
    img.className = 'message-image';
    img.alt = 'Shared image';

    // Click to open image in new tab
    img.addEventListener('click', () => {
        window.open(data.image, '_blank');
    });

    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-username">${escapeHtml(data.username)}</span>
            <span class="message-time">${time}</span>
        </div>
    `;
    messageDiv.appendChild(img);

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
});

// User Joined
socket.on('user-joined', (data) => {
    const systemMsg = document.createElement('div');
    systemMsg.className = 'system-message';
    systemMsg.textContent = `${data.username} joined the chat`;
    messagesContainer.appendChild(systemMsg);

    updateUserCount(data.userCount);
    scrollToBottom();
});

// User Left
socket.on('user-left', (data) => {
    const systemMsg = document.createElement('div');
    systemMsg.className = 'system-message';
    systemMsg.textContent = `${data.username} left the chat`;
    messagesContainer.appendChild(systemMsg);

    updateUserCount(data.userCount);
    scrollToBottom();
});

// Error Handler
socket.on('error', (data) => {
    console.error('Socket error:', data.message);
});

// Update User Count
function updateUserCount(count) {
    userCountDisplay.textContent = `${count} user${count !== 1 ? 's' : ''} online`;
}

// Scroll to Bottom
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle connection errors
socket.on('connect_error', () => {
    if (!loginContainer.classList.contains('hidden')) {
        loginError.textContent = 'Cannot connect to server';
    }
});

socket.on('disconnect', () => {
    if (!chatContainer.classList.contains('hidden')) {
        const systemMsg = document.createElement('div');
        systemMsg.className = 'system-message';
        systemMsg.textContent = 'Disconnected from server';
        systemMsg.style.color = '#e74c3c';
        messagesContainer.appendChild(systemMsg);
        scrollToBottom();
    }
});

socket.on('reconnect', () => {
    if (!chatContainer.classList.contains('hidden')) {
        const systemMsg = document.createElement('div');
        systemMsg.className = 'system-message';
        systemMsg.textContent = 'Reconnected to server';
        systemMsg.style.color = '#27ae60';
        messagesContainer.appendChild(systemMsg);
        scrollToBottom();
    }
});
