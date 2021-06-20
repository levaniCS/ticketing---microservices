import request from 'supertest'
import { app } from '../../app'

const createTicket = () =>
	request(app)
		.post('/api/tickets')
		.set('Cookie', global.getCookie())
		.send({ title: 'Radiohead concert', price: 200 })

it('can fetch a list of tickets', async () => {
	await createTicket()
	await createTicket()
	await createTicket()

	const res = await request(app).get('/api/tickets').expect(200)

	expect(res.body.length).toEqual(3)
})
