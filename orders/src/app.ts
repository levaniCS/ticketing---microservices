import express from 'express'
require('express-async-errors')
import cookieSession from 'cookie-session'
import {
	NotFoundError,
	errorHandler,
	currentUser
} from '@levanisarishvili/common'

import { deleteOrderRouter } from './routes/delete'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes/index'

// Routes

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


app.use(deleteOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)

app.all('*', async (req, res) => {
	throw new NotFoundError()
})
app.use(errorHandler)

export { app }
