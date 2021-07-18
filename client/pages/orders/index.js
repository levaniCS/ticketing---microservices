import Link from 'next/link'

const OrdersShow = ({ currentUser, orders }) => {
	const ordersList = orders.map((order) => (
		<tr key={order.id}>
			<td>{order.ticket.title}</td>
			<td>{order.ticket.price}$</td>
			<td>{order.status}</td>
			<td>
				<Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
					<a>View</a>
				</Link>
			</td>
		</tr>
	))

	return (
		<div>
			<h1>Orders</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Order Status</th>
					</tr>
				</thead>
				<tbody>{ordersList}</tbody>
			</table>
		</div>
	)
}

OrdersShow.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get('/api/orders')

	return { orders: data }
}

export default OrdersShow
