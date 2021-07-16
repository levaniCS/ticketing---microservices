import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@levanisarishvili/common'

// An interface that describes the properties
// that are required to create a single order
interface OrderAttrs {
	id: string
	price: number
	userId: string
	version: number
	status: OrderStatus
}

// An interface that describes the properties
// that a Order Doc has ( we dont need id here it is already default)
interface OrderDoc extends mongoose.Document {
	price: number
	userId: string
	version: number
	status: OrderStatus
}

// An interface that describes the properties
// that the Order model has
interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
	{
		price: {
			type: Number,
			required: true
		},
		userId: {
			type: String,
			required: true
		},
		status: {
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

// Use 'version' instead of '__v'
orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order({
		_id: attrs.id,
		version: attrs.version,
		price: attrs.price,
		userId: attrs.userId,
		status: attrs.status
	})
}

// Generic: model will take
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
