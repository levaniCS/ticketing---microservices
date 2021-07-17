import {
	Subjects,
	Publisher,
	PaymentCreatedEvent
} from '@levanisarishvili/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
