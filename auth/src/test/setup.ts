import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'

declare global {
	namespace NodeJS {
		interface Global {
			getCookie(): Promise<string[]>
		}
	}
}

let mongo: any

// Before first test runs
beforeAll(async () => {
	process.env.JWT_KEY = 'thisisjwtsecretkey'
	mongo = new MongoMemoryServer()
	const mongoUri = await mongo.getUri()

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
})

// Before each test runs
beforeEach(async () => {
	// Delete all the data in memory server
	// Before each test runs
	const collections = await mongoose.connection.db.collections()

	for (let collection of collections) {
		await collection.deleteMany({})
	}
})

// after all tests runs
afterAll(async () => {
	await mongo.stop()
	await mongoose.connection.close()
})

global.getCookie = async () => {
	const email = 'test@test.com'
	const password = 'password'

	const response = await request(app)
		.post('/api/users/signup')
		.send({ email, password })
		.expect(201)

	return response.get('Set-Cookie')
}
