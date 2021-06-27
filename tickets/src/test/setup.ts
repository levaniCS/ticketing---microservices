import request from 'supertest'
import jwt from 'jsonwebtoken'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'

declare global {
	namespace NodeJS {
		interface Global {
			getCookie(): string[]
		}
	}
}

let mongo: any

// Fake Nats connection
jest.mock('../nats-wrapper')

// Before first test runs
beforeAll(async () => {
	jest.clearAllMocks()
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

global.getCookie = () => {
	// Build a JWT payload. { id, email }
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com'
	}

	// Create the JWT!
	const token = jwt.sign(payload, process.env.JWT_KEY!)

	// Build session object. { jwt: MY_JWT }
	const session = { jwt: token }

	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session)

	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString('base64')

	// Return a string thats the cookie with encoded data
	return [`express:sess=${base64}`]
}
