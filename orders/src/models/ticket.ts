import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Order, OrderStatus } from './order'

// An interface that describes the properties
// that are required to create a new user
interface TicketAttrs {
	id: string
	title: string
	price: number
}

// An interface that describes the properties
// that a Ticket Doc has
interface TicketDoc extends mongoose.Document {
	title: string
	price: number
	version: number
	isReserved(): Promise<boolean>
}

// An interface that describes the properties
// that the Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
	findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true,
			min: 0
		}
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.__v
			}
		}
	}
)

// Use 'version' instead of '__v'
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

// statics are the methods defined on the Model.
ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket({
		_id: attrs.id,
		title: attrs.title,
		price: attrs.price
	})
}
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
	return Ticket.findOne({ _id: event.id, version: event.version - 1 })
}

// 1) Run query and look at all the orders
// 2) Find an order where the ticket is the ticket we just found *and* the
// order's status is not cancelled

// methods are defined on the document (instance).
ticketSchema.methods.isReserved = async function () {
	// this. === the ticket document that we just called 'isReserved' on
	const existingOrder = await Order.findOne({
		ticket: this as any,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete
			]
		}
	})

	return !!existingOrder
}

// Generic: model will take
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket, TicketDoc }
