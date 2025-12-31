import Logger from '../infrastructure/log/logger'
import type SessionOperator from '../operators/sessionOperator'

export function setShutdownCycle(sessionOperator: SessionOperator) {
	process.on('SIGINT', () => {
		Logger.warn`Ctrl-C was pressed (SIGINT received) - Closing all connections`
		sessionOperator.removeAllSessions().then(() => process.exit())
	})
}
