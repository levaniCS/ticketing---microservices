import axios from 'axios'
import { useState } from 'react'

export const useRequest = ({ url, method, body }) => {
	const [errors, setErrors] = useState(null)

	const doRequest = async () => {
		try {
			setErrors(null)
			const response = await axios[method || 'get'](url, body)
			return response.data
		} catch (err) {
			setErrors(
				<div className="alert alert-danger my-3" role="alert">
					<ul className="my-1">
						{err.response.data.errors.map((error) => (
							<li key={error.message}>{error.message}</li>
						))}
					</ul>
				</div>
			)
		}
	}

	return { doRequest, errors }
}
