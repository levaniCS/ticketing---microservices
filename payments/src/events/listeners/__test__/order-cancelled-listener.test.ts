import mongoose from 'mongoose'
import { OrderCancelledEvent, OrderStatus } from '@levanisarishvili/common'

import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
	// Create an instance of a listener
	const listener = new OrderCancelledListener(natsWrapper.client)

	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price: 20,
		userId: 'dadadad',
		version: 0,
		status: OrderStatus.Created
	})
	await order.save()

	// Create the fake data event
	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		version: 1,
		ticket: {
			id: 'tess'
		}
	}

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, order, data, msg }
}

it('updates the status of the order', async () => {
	const { listener, data, order, msg } = await setup()

	// Call the onMessage function with the data and message object
	await listener.onMessage(data, msg)

	// Write assertions to make sure a ticket was created!
	const updatedTicket = await Order.findById(order.id)

	expect(updatedTicket).toBeDefined()
	expect(updatedTicket!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
	const { listener, data, msg } = await setup()
	// Call the onMessage function with the data and message object
	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
})
