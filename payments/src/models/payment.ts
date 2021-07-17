import mongoose from 'mongoose'

// An interface that describes the properties
// that are required to create a single order
interface PaymentAttrs {
	orderId: string
	stripeId: string
}

// An interface that describes the properties
// that a Payment Doc has ( we dont need id here it is already default)
interface PaymentDoc extends mongoose.Document {
	orderId: string
	stripeId: string
}

// An interface that describes the properties
// that the Payment model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
	build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema(
	{
		orderId: {
			type: String,
			required: true
		},
		stripeId: {
			type: String,
			required: true
		}
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
			}
		}
	}
)

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
	return new Payment(attrs)
}

// Generic: model will take
const Payment = mongoose.model<PaymentDoc, PaymentModel>(
	'Payment',
	paymentSchema
)

export { Payment }
