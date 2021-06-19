import request from 'supertest'
import { app } from '../../app'

const userCredentials = { email: 'test@test.com', password: 'password' }

it('Falls when a email that does not exist is supplied', async () => {
	await request(app).post('/api/users/signin').send(userCredentials).expect(400)
})

it('Falls when a incorrect password is supplied', async () => {
	await request(app).post('/api/users/signup').send(userCredentials).expect(201)

	await request(app)
		.post('/api/users/signin')
		.send({ email: 'test@test.com', password: 'passwordnotcorrect' })
		.expect(400)
})

it('Responds with a cookie when given valid credentials', async () => {
	await request(app).post('/api/users/signup').send(userCredentials).expect(201)

	const response = await request(app)
		.post('/api/users/signin')
		.send(userCredentials)
		.expect(200)

	expect(response.get('Set-Cookie')).toBeDefined()
})
