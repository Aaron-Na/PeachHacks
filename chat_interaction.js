const avatarPicker = document.getElementById('avatar-picker');
const glitterPicker = document.getElementById('glitter-picker');
const chatInput = document.getElementById('chat-input');
const bgPicker = document.getElementById('bg-picker');
const pageBgPicker = document.getElementById('page-bg-picker');
const chatContainer = document.getElementById('chat-container');
const pageBody = document.getElementById('page-body');
const usernameInput = document.getElementById('username');
const messagesDiv = document.getElementById('messages');

const fetchMessages = async () => {
  const res = await fetch('http://localhost:5000/messages');
  const data = await res.json();
  messagesDiv.innerHTML = '';
  data.forEach(({ user, message, avatar }) => {
    const glitter = glitterPicker.value;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bg-blue-100';
    bubble.innerHTML = `
      <div class="relative w-6 h-6">
        <img src="${avatar}" class="w-6 h-6 rounded-full absolute z-10" />
        ${glitter ? `<img src="${glitter}" class="w-6 h-6 rounded-full absolute z-20 pointer-events-none" />` : ''}
      </div>
      <div><strong>${user}:</strong> ${message}</div>
    `;
    messagesDiv.appendChild(bubble);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

setInterval(fetchMessages, 2000);
fetchMessages();

chatInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter' && chatInput.value.trim()) {
    const msg = chatInput.value.trim();
    const user = usernameInput.value.trim() || 'Anonymous';
    const avatar = avatarPicker.value;

    await fetch('http://localhost:5000/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, message: msg, avatar })
    });

    chatInput.value = '';
    fetchMessages();
  }
});

bgPicker.addEventListener('change', (e) => {
  const val = e.target.value;
  if (val.startsWith('url')) {
    chatContainer.style.background = val;
    chatContainer.style.backgroundSize = 'cover';
  } else {
    chatContainer.style.background = val;
  }
});

pageBgPicker.addEventListener('change', (e) => {
  const val = e.target.value;
  if (val.startsWith('url')) {
    pageBody.style.backgroundImage = val;
    pageBody.style.backgroundSize = 'cover';
  } else {
    pageBody.style.background = val;
    pageBody.style.backgroundImage = '';
  }
});