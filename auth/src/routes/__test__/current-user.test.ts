import request from 'supertest'
import { app } from '../../app'

it('Responds with details about the current user', async () => {
	const cookie = await global.getCookie()
	const response = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.expect(200)

	expect(response.body.currentUser).toBeDefined()
})

it('Responds with null if not authenticated', async () => {
	const response = await request(app).get('/api/users/currentuser').expect(401)

	expect(response.body.errors).toBeDefined()
})
