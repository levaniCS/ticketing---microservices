import { Message } from 'node-nats-streaming'
import { Subjects, Listener, OrderCreatedEvent } from '@levanisarishvili/common'
import { queueGroupName } from './queue-group-name'

import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject: Subjects.OrderCreated = Subjects.OrderCreated
	queueGroupName = queueGroupName
	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		await expirationQueue.add({
      orderId: data.id,
    })

		msg.ack()
	}
}
