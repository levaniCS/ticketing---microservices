import Router from 'next/router'
import { useEffect } from 'react'
import { useRequest } from '../../hooks/useRequest'

const Signout = () => {
	const { doRequest } = useRequest({
		url: '/api/users/signout',
		onSuccess: () => Router.push('/')
	})

	useEffect(() => {
		doRequest && doRequest()
	}, [])

	return <div>Signing you out...</div>
}

export default Signout
