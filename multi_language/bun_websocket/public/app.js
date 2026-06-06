const loginScreen = document.getElementById('login-screen')
const joinBtn = document.getElementById('join-btn')
const usernameInput = document.getElementById('username-input')

const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const sendBtn = document.getElementById('send-btn')
const messagesContainer = document.getElementById('messages-container')

const statusIndicator = document.getElementById('connection-status')
const statusText = document.getElementById('status-text')

let ws = null
let currentUsername = ''

// The protocol is dynamically determined based on the page's protocol
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
// Connect to the same host that serves the frontend
const wsHost = window.location.host

function connectWebSocket() {
	// Explicitly add an Upgrade header? Actually we can't from browser WS API,
	// but browser sends it automatically. We'll connect to the root URL or /ws
	// The server is updated to handle WS on any route if the Upgrade header is present.
	ws = new WebSocket(`${wsProtocol}//${wsHost}/`)

	ws.onopen = () => {
		console.log('Connected to WebSocket server')
		statusIndicator.className = 'status-indicator connected'
		statusText.textContent = 'Connected'

		// Enable inputs
		messageInput.disabled = false
		sendBtn.disabled = false

		// Hide login, show chat (if not already done)
		loginScreen.classList.remove('active')

		// Focus chat input
		setTimeout(() => messageInput.focus(), 100)

		addSystemMessage('Connected to the chat server')
	}

	ws.onmessage = (event) => {
		try {
			// Server might send raw strings or JSON. The backend parseMessage expects JSON.
			// Let's see what the server sends. It likely broadcasts JSON or text.
			let data
			try {
				data = JSON.parse(event.data)
			} catch (_e) {
				// Not JSON, handle as raw text
				addMessage({ text: event.data, username: 'Server' }, 'other')
				return
			}

			// If it's the expected format { username, text }
			if (data?.text) {
				const isOwnMessage = data.username === currentUsername
				addMessage(data, isOwnMessage ? 'own' : 'other')
			}
		} catch (error) {
			console.error('Error handling message:', error)
		}
	}

	ws.onclose = () => {
		console.log('Disconnected from WebSocket server')
		statusIndicator.className = 'status-indicator disconnected'
		statusText.textContent = 'Disconnected'

		// Disable inputs
		messageInput.disabled = true
		sendBtn.disabled = true

		addSystemMessage('Disconnected. Reconnecting in 5 seconds...')

		// Auto reconnect
		setTimeout(connectWebSocket, 5000)
	}

	ws.onerror = (error) => {
		console.error('WebSocket error:', error)
		addSystemMessage('Connection error occurred')
	}
}

function handleJoin() {
	const username = usernameInput.value.trim()
	if (!username) return

	currentUsername = username

	// Connect to WS
	connectWebSocket()
}

function sendMessage(e) {
	e.preventDefault()

	if (!ws || ws.readyState !== WebSocket.OPEN) return

	const text = messageInput.value.trim()
	if (!text) return

	const messageObj = {
		username: currentUsername,
		text: text,
	}

	// Send to server
	ws.send(JSON.stringify(messageObj))

	// Clear input
	messageInput.value = ''
	messageInput.focus()
}

function addMessage(message, type) {
	const wrapper = document.createElement('div')
	wrapper.className = `message-wrapper ${type}`

	const sender = document.createElement('div')
	sender.className = 'message-sender'
	sender.textContent = message.username || 'Anonymous'

	const bubble = document.createElement('div')
	bubble.className = 'message-bubble'
	bubble.textContent = message.text

	wrapper.appendChild(sender)
	wrapper.appendChild(bubble)

	messagesContainer.appendChild(wrapper)
	scrollToBottom()
}

function addSystemMessage(text) {
	const el = document.createElement('div')
	el.className = 'system-message'
	el.textContent = text
	messagesContainer.appendChild(el)
	scrollToBottom()
}

function scrollToBottom() {
	messagesContainer.scrollTop = messagesContainer.scrollHeight
}

// Event Listeners
joinBtn.addEventListener('click', handleJoin)
usernameInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') handleJoin()
})
messageForm.addEventListener('submit', sendMessage)

// Initial focus
usernameInput.focus()
