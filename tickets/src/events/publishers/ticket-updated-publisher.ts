import {
	Publisher,
	Subjects,
	TicketUpdatedEvent
} from '@levanisarishvili/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
