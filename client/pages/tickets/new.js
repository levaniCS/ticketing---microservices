import { useState } from 'react'
import Router from 'next/router'
import { useRequest } from '../../hooks/useRequest'

const NewTicket = () => {
	const [title, setTitle] = useState('')
	const [price, setPrice] = useState('')
	const { doRequest, errors } = useRequest({
		url: '/api/tickets',
		method: 'post',
		body: { title, price },
		onSuccess: () => Router.push('/')
	})

	const onBlur = () => {
		const value = parseFloat(price)

		if (isNaN(value)) return
		setPrice(value.toFixed(2))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		doRequest()
	}

	return (
		<div>
			<h1>Create a ticket</h1>

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Title</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="form-control"
						type="text"
					/>
				</div>
				<div className="form-group">
					<label>Price</label>
					<input
						value={price}
						onBlur={onBlur}
						onChange={(e) => setPrice(e.target.value)}
						className="form-control"
						type="text"
					/>
				</div>
				{errors}
				<button className="mt-2 btn btn-primary">Submit</button>
			</form>
		</div>
	)
}

export default NewTicket
