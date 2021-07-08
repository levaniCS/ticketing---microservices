import mongoose from 'mongoose'
import { OrderCancelledEvent } from '@levanisarishvili/common'

import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	// Create an instance of a listener
	const listener = new OrderCancelledListener(natsWrapper.client)
	// Create a fake data event

	const orderId = mongoose.Types.ObjectId().toHexString()
	const ticket = Ticket.build({
		title: 'titlee',
		price: 20,
		userId: 'dadadad'
	})
	await ticket.save()

	// Create the fake data event
	const data: OrderCancelledEvent['data'] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id
		}
	}

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, ticket, data, msg }
}

it('updates the ticket, publishes an event, and acks the message', async () => {
	const { listener, data, ticket, msg } = await setup()

	// Call the onMessage function with the data and message object
	await listener.onMessage(data, msg)

	// Write assertions to make sure a ticket was created!
	const updatedTicket = await Ticket.findById(ticket.id)

	expect(updatedTicket).toBeDefined()
	expect(updatedTicket!.orderId).not.toBeDefined()
	expect(msg.ack).toHaveBeenCalled()
	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
