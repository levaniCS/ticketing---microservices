import { Subjects, Publisher, ExpirationCompleteEvent } from '@levanisarishvili/common'

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}

export { ExpirationCompletePublisher }