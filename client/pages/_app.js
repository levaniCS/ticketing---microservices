import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/buildClient'
import Header from '../components/header'

const AppRoot = ({ Component, pageProps, currentUser }) => {
	return (
		<div style={{ padding: '0 20%' }}>
			<Header currentUser={currentUser} />
			<div className="container mt-5">
				<Component {...pageProps} currentUser={currentUser} />
			</div>
		</div>
	)
}

AppRoot.getInitialProps = async (appContext) => {
	const client = await buildClient(appContext.ctx)
	const res = await client.get('/api/users/currentuser').catch((err) => {
		console.log(err)
	})

	let pageProps = {}
	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(
			appContext.ctx,
			client,
			res?.data.currentUser
		)
	}

	return { currentUser: res?.data.currentUser, pageProps }
}

export default AppRoot
