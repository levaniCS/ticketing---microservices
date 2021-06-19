import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/buildClient'
import Header from '../components/header'

const AppRoot = ({ Component, pageProps, currentUser }) => {
	return (
		<div style={{ padding: '0 20%' }}>
			<Header currentUser={currentUser} />
			<Component {...pageProps} />
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
		pageProps = await appContext.Component.getInitialProps(appContext.ctx)
	}

	return { currentUser: res?.data, pageProps }
}

export default AppRoot
