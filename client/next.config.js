// This file will load automatically when nextjs project starts up
module.exports = {
	// Pull all files once every 300seconds
	webpackDevMiddleware: (config) => {
		config.watchOptions.poll = 300
		return config
	}
}
