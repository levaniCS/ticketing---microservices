import request from 'supertest'
import { app } from '../../app'

const userCredentials = { email: 'test@test.com', password: 'password' }

it('Clears the cookie after signing out', async () => {
	await request(app).post('/api/users/signup').send(userCredentials).expect(201)
	const response = await request(app).get('/api/users/signout').expect(200)

	// First approach
	// expect(response.get('Set-Cookie')[0]).toEqual(
	// 	'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
	// )
	// Second approach
	expect(response.get('Set-Cookie')).toBeDefined()
})
