import mongoose from 'mongoose'

// An interface that describes the properties
// that are required to create a single ticket
interface TicketAttrs {
	title: string
	price: number
	userId: string
}

// An interface that describes the properties
// that a Ticket Doc has
interface TicketDoc extends mongoose.Document {
	title: string
	price: number
	userId: string
}

// An interface that describes the properties
// that the ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		userId: {
			type: String,
			required: true
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs)
}

// Generic: model will take
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
