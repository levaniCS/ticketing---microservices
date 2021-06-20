import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'

it('returns 404 if provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()

	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.getCookie())
		.send({ title: 'heeello', price: 29 })
		.expect(404)
})

it('returns 401 if user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({ title: 'heeello', price: 29 })
		.expect(401)
})

it('returns 401 if the user does not own the ticket', async () => {
	const res = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', global.getCookie())
		.send({ title: 'heeello', price: 29 })

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', global.getCookie())
		.send({ title: 'heeello2', price: 229 })
		.expect(401)
})

it('returns 400 if the user provides an invalid title or price', async () => {
	const cookie = global.getCookie()
	const res = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({ title: 'heeello', price: 29 })

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({ title: '', price: 2000 })
		.expect(400)

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'heeello2', price: -10 })
		.expect(400)
})

it('updates the ticket provided valid inputs', async () => {
	const cookie = global.getCookie()
	const res = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({ title: 'heeello', price: 29 })

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'new ttitle', price: 900 })
		.expect(200)

	const ticketRes = await request(app).get(`/api/tickets/${res.body.id}`)

	expect(ticketRes.body.title).toEqual('new ttitle')
	expect(ticketRes.body.price).toEqual(900)
})
