import {
	Publisher,
	Subjects,
	OrderCreatedEvent
} from '@levanisarishvili/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject: Subjects.OrderCreated = Subjects.OrderCreated
}
