import { Message } from 'node-nats-streaming'
import {
	Listener,
	OrderCancelledEvent,
	Subjects
} from '@levanisarishvili/common'

import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled
	queueGroupName = queueGroupName

	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		// Find the ticket that the order is reserving
		const ticket = await Ticket.findById(data.ticket.id)

		// If not ticket, throw err
		if (!ticket) {
			throw new Error('Ticket not found')
		}

		// Mark the ticket as being reserved by setting its orderId property
		ticket.set({ orderId: undefined })

		// Save the ticket
		await ticket.save()
		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			orderId: ticket.orderId,
			version: ticket.version
		})

		// Ack the message
		msg.ack()
	}
}
