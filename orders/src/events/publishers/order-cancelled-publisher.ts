import {
	Publisher,
	Subjects,
	OrderCancelledEvent
} from '@levanisarishvili/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
