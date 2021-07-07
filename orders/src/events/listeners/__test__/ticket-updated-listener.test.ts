import mongoose from 'mongoose'
import { TicketUpdatedEvent } from '@levanisarishvili/common'

import { TicketUpdatedListener } from '../index'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	// Create an instance of a listener
	const listener = new TicketUpdatedListener(natsWrapper.client)

	// Create and save a ticket
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20
	})
	await ticket.save()

	// Create a fake data event
	const data: TicketUpdatedEvent['data'] = {
		id: ticket.id,
		version: ticket.version + 1,
		userId: 'p',
		title: 'titlee',
		price: 20
	}
	// Create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, data, msg, ticket }
}

it('finds, updates, and saves a ticekt', async () => {
	const { listener, data, msg, ticket } = await setup()

	// Call the onMessage function with the data and message object
	await listener.onMessage(data, msg)

	const updatedTicket = await Ticket.findById(ticket.id)

	expect(updatedTicket).toBeDefined()
	expect(updatedTicket!.title).toEqual(data.title)
	expect(updatedTicket!.price).toEqual(data.price)
	expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
	const { listener, data, msg } = await setup()
	data.version = 10

	try {
		await listener.onMessage(data, msg)
	} catch (err) {}

	expect(msg.ack).not.toHaveBeenCalled()
})
