import Router from 'next/router'
import { useRequest } from '../../hooks/useRequest'

const TicketShow = ({ ticket }) => {
	const { doRequest, errors } = useRequest({
		url: '/api/orders',
		method: 'post',
		body: { ticketId: ticket.id },
		onSuccess: (order) =>
			Router.push('/orders/[orderId]', `/orders/${order.id}`)
	})

	return (
		<div className="border-2">
			<h5>{ticket.title}</h5>
			<p>Price: {ticket.price}</p>
			{errors}
			<button onClick={() => doRequest()} className="btn btn-primary">
				Purchase
			</button>
		</div>
	)
}

TicketShow.getInitialProps = async (context, client) => {
	const { ticketId } = context.query

	const { data } = await client.get(`/api/tickets/${ticketId}`)
	return {
		ticket: data
	}
}

export default TicketShow
