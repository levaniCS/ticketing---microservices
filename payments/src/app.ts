import express from 'express'
require('express-async-errors')
import cookieSession from 'cookie-session'
import {
	NotFoundError,
	errorHandler,
	currentUser
} from '@levanisarishvili/common'

// Routes
import { CreateChargeRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
	cookieSession({
		signed: false,
		secure: false
	})
)

// Set current user
app.use(currentUser)

app.use(CreateChargeRouter)

app.all('*', async (req, res) => {
	throw new NotFoundError()
})
app.use(errorHandler)

export { app }
