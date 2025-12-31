import { check } from 'k6'
import ws from 'k6/ws'

const iterations = 100
const message = `{"username":"${__VU}","text":"bão?"}`

export const options = {
	insecureSkipTLSVerify: true,
}

export default function () {
	const url = 'wss://chat.docker.localhost'
	// const url = 'ws://localhost:3000'
	const params = {}

	const res = ws.connect(url, params, (socket) => {
		socket.on('open', function open() {
			//console.log(`VU ${__VU}: connected`)

			// send multiple messages
			for (let i = 0; i < iterations; i++) {
				socket.send(message)
			}
		})

		let received = 0
		socket.on('message', (_data) => {
			received += 1
			if (received >= iterations) {
				socket.close()
			}
		})

		socket.on('close', () => {
			//console.log(`VU ${__VU}: disconnected`)
		})

		socket.on('error', (e) => {
			if (e.error() !== 'websocket: close sent') {
				//console.error('An unexpected error occurred: ', e.error())
			}
		})
	})

	check(res, { 'status is 101': (r) => r && r.status === 101 })
}
