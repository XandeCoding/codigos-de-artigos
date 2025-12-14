class InvalidTicketError extends Error {
	public ticket: string

	constructor(ticket: string) {
		super(`Invalid ticket was received: ${ticket}`)
		this.ticket = ticket
	}
}

export { InvalidTicketError }
