import axios from 'axios'

const buildClient = ({ req }) => {
	// Window object is only defined in client side
	// So if its undefined that means we are in server-side rendering

	// Find namespace: kubectl get services -n ingress-nginx
	// Find service: kubectl get services
	// http://[Namespace].[Service]

	if (typeof window === 'undefined') {
		// We are on the server
		return axios.create({
			baseURL:
				'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
			headers: req.headers
		})
	} else {
		// We are on the browser
		return axios.create({ baseURL: '' })
	}
}

export default buildClient
