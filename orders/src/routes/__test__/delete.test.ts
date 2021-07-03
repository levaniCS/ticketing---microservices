import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
// Fake nats wrapper
import { natsWrapper } from '../../nats-wrapper'

it('marks an order as cancelled', async () => {
	//  Create a ticket with Ticket model
	const ticket = Ticket.build({
		title: 'Concert 392',
		price: 20
	})
	await ticket.save()

	const user = global.getCookie()
	// Make a request to create an order
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201)

	// Make a request to cancell an order
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(204)

	// Expectation to make sure the thing is cancelled
	const updatedOrder = await Order.findById(order.id)
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
	//  Create a ticket with Ticket model
	const ticket = Ticket.build({
		title: 'Concert 392',
		price: 20
	})
	await ticket.save()

	const user = global.getCookie()
	// Make a request to create an order
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201)

	// Make a request to cancell an order
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(204)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
