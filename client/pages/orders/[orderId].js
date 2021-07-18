import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'
import { useRequest } from '../../hooks/useRequest'

const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0)
	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			orderId: order.id
		},
		onSuccess: () => Router.push('/')
	})

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date()
			setTimeLeft(Math.round(msLeft / 1000))
		}

		// First call and then setInterval will call every 1sec
		findTimeLeft()
		// Call once every second
		const timerId = setInterval(findTimeLeft, 1000)

		return () => {
			clearInterval(timerId)
		}
	}, [order])

	if (timeLeft < 0) {
		return <div>Order Expired</div>
	}

	return (
		<div className="border-bottom-2">
			<p>Time left to pay: {timeLeft} seconds</p>
			<StripeCheckout
				token={({ id }) => doRequest({ token: id })}
				stripeKey={
					'pk_test_51JEBR2BsDezS4VpfbBB8wexxmU8p36kaQcF4ry9LCCsK9TmdJFrquz6qZo72NZRD3zYFioUAEouGNFAxMlC4I7b100ZJa9TFD3'
				}
				amount={order.ticket.price * 100}
				email={currentUser.email}
			/>
			{errors}
		</div>
	)
}

OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query

	const { data } = await client.get(`/api/orders/${orderId}`)
	return {
		order: data
	}
}

export default OrderShow
