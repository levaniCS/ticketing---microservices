import buildClient from '../api/buildClient'
import Link from 'next/link'

const LandingPage = ({ currentUser }) => {
	return currentUser ? (
		<>
			<h1>You are signed in</h1>
		</>
	) : (
		<>
			<h1>You are not signed in</h1>
			<Link href="/auth/signup">Sign up</Link>
			<Link href="/auth/signin">Sign In</Link>
		</>
	)
}

LandingPage.getInitialProps = async (context) => {
	const res = await buildClient(context)
		.get('/api/users/currentuser')
		.catch((err) => {
			console.log(err)
		})

	return { currentUser: res?.data }
}

export default LandingPage
