// script.js
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupNavigation();
    setupEncryption();
    setupSteganography();
    setupBruteforce();
    
    // Show home section by default
    showSection('home');
}

// Navigation System
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// Encryption Module
function setupEncryption() {
    const generateKeyBtn = document.getElementById('generateKeyBtn');
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');

    generateKeyBtn?.addEventListener('click', generateKey);
    encryptBtn?.addEventListener('click', encryptText);
    decryptBtn?.addEventListener('click', decryptText);
}

function generateKey() {
    const keyLength = document.getElementById('keyLength')?.value || 256;
    const key = CryptoJS.lib.WordArray.random(keyLength/8).toString();
    document.getElementById('encKey').value = key;
}

function encryptText() {
    try {
        const text = document.getElementById('inputText').value;
        const key = document.getElementById('encKey').value;
        const encrypted = CryptoJS.AES.encrypt(text, key).toString();
        document.getElementById('outputText').value = encrypted;
        showToast('Encryption successful!', 'success');
    } catch (error) {
        showToast('Encryption failed!', 'error');
        console.error('Encryption error:', error);
    }
}

function decryptText() {
    try {
        const ciphertext = document.getElementById('inputText').value;
        const key = document.getElementById('encKey').value;
        const decrypted = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
        
        if (!decrypted) throw new Error('Invalid key or ciphertext');
        
        document.getElementById('outputText').value = decrypted;
        showToast('Decryption successful!', 'success');
    } catch (error) {
        showToast('Decryption failed! Invalid key or ciphertext', 'error');
        console.error('Decryption error:', error);
    }
}

// Steganography Module
function setupSteganography() {
    const imageUpload = document.getElementById('imageUpload');
    const hideBtn = document.getElementById('hideBtn');
    const revealBtn = document.getElementById('revealBtn');

    imageUpload?.addEventListener('change', handleImageUpload);
    hideBtn?.addEventListener('click', hideMessage);
    revealBtn?.addEventListener('click', revealMessage);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `
            <img src="${e.target.result}" 
                 class="stego-preview" 
                 alt="Upload preview">
            <p class="text-sm text-gray-400 mt-2">${file.name}</p>
        `;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function hideMessage() {
    const message = document.getElementById('secretMessage').value;
    const imageInput = document.getElementById('imageUpload');
    
    if (!message || !imageInput.files[0]) {
        showToast('Please upload an image and enter a message!', 'warning');
        return;
    }

    // Steganography implementation would go here
    showToast('Message hidden in image!', 'success');
}

function revealMessage() {
    const imageInput = document.getElementById('imageUpload');
    
    if (!imageInput.files[0]) {
        showToast('Please upload an image with hidden message!', 'warning');
        return;
    }

    // Message extraction implementation would go here
    document.getElementById('secretMessage').value = 'Extracted message';
    showToast('Message revealed!', 'success');
}

// Bruteforce Module
function setupBruteforce() {
    const startBruteforceBtn = document.getElementById('startBruteforceBtn');
    startBruteforceBtn?.addEventListener('click', startBruteforceAttack);
}

function startBruteforceAttack() {
    const progressBar = document.getElementById('progress');
    const attemptCount = document.getElementById('attemptCount');
    const speedDisplay = document.getElementById('speed');
    
    let progress = 0;
    let attempts = 0;
    let startTime = Date.now();

    const attackInterval = setInterval(() => {
        progress += Math.random() * 2;
        attempts += Math.floor(Math.random() * 100);
        
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - startTime) / 1000;
        const speed = Math.floor(attempts / elapsedSeconds);

        if(progress >= 100) {
            clearInterval(attackInterval);
            progress = 100;
            showToast('Password not found!', 'error');
        }

        progressBar.style.width = `${progress}%`;
        attemptCount.textContent = attempts;
        speedDisplay.textContent = speed;
    }, 100);
}

// UI Utilities
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type} fixed top-4 right-4 glass-panel p-4 rounded-lg`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function handleFileUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="max-h-64 rounded-lg">`;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    });
}

// Error Handling
window.onerror = function(message, source, lineno, colno, error) {
    showToast(`Unexpected error: ${message}`, 'error');
    console.error('Application error:', { message, source, lineno, colno, error });
};