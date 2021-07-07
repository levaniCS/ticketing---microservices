import mongoose from 'mongoose'
import { TicketCreatedEvent } from '@levanisarishvili/common'

import { TicketCreatedListener } from '../index'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	// Create an instance of a listener
	const listener = new TicketCreatedListener(natsWrapper.client)
	// Create a fake data event
	const data: TicketCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 20,
		version: 0,
		title: 'titlee',
		userId: new mongoose.Types.ObjectId().toHexString()
	}
	// Create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
	const { listener, data, msg } = await setup()

	// Call the onMessage function with the data and message object
	await listener.onMessage(data, msg)

	// Write assertions to make sure a ticket was created!
	const ticket = await Ticket.findById(data.id)

	expect(ticket).toBeDefined()
	expect(ticket!.title).toEqual(data.title)
	expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
	// Write assertions to make sure a ticket was created!
	// Write assertions to make sure ack function was called!
})
