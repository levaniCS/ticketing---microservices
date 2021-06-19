import { useState } from 'react'
import axios from 'axios'
import { useRequest } from '../../hooks/useRequest'

const Signup = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { doRequest, errors } = useRequest({
		url: '/api/users/signup',
		method: 'post',
		body: {
			email,
			password
		}
	})

	const handleSubmit = async (e) => {
		e.preventDefault()
		await doRequest()
	}

	return (
		<form
			className="form-horizontal d-flex justify-content-center align-items-center mt-5"
			onSubmit={handleSubmit}
		>
			<fieldset style={{ width: 500 }}>
				<div className="text-gray text-center">
					<legend>Sign Up</legend>
				</div>

				<div className="control-group my-2">
					<label className="control-label text-muted" htmlFor="email">
						Email
					</label>
					<div className="controls">
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="text"
							id="email"
							name="email"
							placeholder="test@test.com"
							className="input-xlarge p-2 w-100"
						/>
					</div>
				</div>

				<div className="control-group my-4">
					<label className="control-label text-muted" htmlFor="password">
						Password
					</label>
					<div className="controls">
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							id="password"
							name="password"
							className="input-xlarge p-2 w-100"
						/>
					</div>
				</div>

				{errors}

				<div className="control-group my-2 ">
					<div className="controls">
						<button className="btn btn-success">Sign Up</button>
					</div>
				</div>
			</fieldset>
		</form>
	)
}

export default Signup
