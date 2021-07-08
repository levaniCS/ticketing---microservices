import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from '@levanisarishvili/common'

import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	// Create an instance of a listener
	const listener = new OrderCreatedListener(natsWrapper.client)
	// Create a fake data event
	const ticket = Ticket.build({
		title: 'titlee',
		price: 20,
		userId: 'dadadad'
	})
	await ticket.save()

	// Create the fake data event
	const data: OrderCreatedEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: 'dadadawda',
		expiresAt: 'dadadawda',
		ticket: {
			id: ticket.id,
			price: ticket.price
		}
	}

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, ticket, data, msg }
}

it('sets the userId of the ticket', async () => {
	const { listener, data, ticket, msg } = await setup()

	// Call the onMessage function with the data and message object
	await listener.onMessage(data, msg)

	// Write assertions to make sure a ticket was created!
	const updatedTicket = await Ticket.findById(ticket.id)

	expect(updatedTicket).toBeDefined()
	expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
})

it('published a ticket updated event', async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg)

	expect(natsWrapper.client.publish).toHaveBeenCalled()

	// Get mock function detail
	const ticketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[2][1]
	)

	expect(data.id).toEqual(ticketUpdatedData.orderId)
})
