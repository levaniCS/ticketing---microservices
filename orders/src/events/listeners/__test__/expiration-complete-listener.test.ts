import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderStatus, ExpirationCompleteEvent,  } from '@levanisarishvili/common'

import { ExpirationCompleteListener } from '../index'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'

const setup = async () => {
	// Create an instance of a listener
	const listener = new ExpirationCompleteListener(natsWrapper.client)
	// Create a ticket
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 20,
		title: 'titlee',
	})
  await ticket.save()
  // Create a order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'dadwd',
    expiresAt: new Date(),
    ticket
  })
  await order.save()
  
	// Create a fake message object
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, data, msg, order, ticket }
}

it('updates the order status to cancelled', async () => {
	const { listener, data, msg, order } = await setup()

	// Call the onMessage function with the data and message object
	await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

	expect(updatedOrder).toBeDefined()
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})


it('emit an Order cancelled event', async () => {
  const { listener, data, msg, order } = await setup()

	// Call the onMessage function with the data and message object
	await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[1][1]
  )
  expect(eventData.id).toEqual(order.id)
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()

	// Call the onMessage function with the data and message object
	await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})