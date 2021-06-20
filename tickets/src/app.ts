import express from 'express'
require('express-async-errors')
import cookieSession from 'cookie-session'
import {
	NotFoundError,
	errorHandler,
	currentUser
} from '@levanisarishvili/common'

// Routes
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { updateTicketRouter } from './routes/update'
import { indexTicketRouter } from './routes/index'

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

app.use(createTicketRouter)
app.use(indexTicketRouter)
app.use(showTicketRouter)
app.use(updateTicketRouter)

app.all('*', async (req, res) => {
	throw new NotFoundError()
})
app.use(errorHandler)

export { app }
