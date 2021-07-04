import { Ticket } from '../ticket'

// it('Implements optimistic concurrency control', async (done) => {
// 	// Create an instance of a ticket
// 	const ticket = Ticket.build({
// 		title: 'Test',
// 		price: 20,
// 		userId: '23232f'
// 	})

// 	// Save it to the DB
// 	await ticket.save()

// 	// Fetch the ticket twice
// 	const firstInstance = await Ticket.findById(ticket.id)
// 	const secondInstance = await Ticket.findById(ticket.id)

// 	// Make two separate changes to the ticket we ferched
// 	firstInstance!.set({ price: 10 })
// 	secondInstance!.set({ price: 50 })

// 	// Save the first ticket
// 	await firstInstance!.save()

// 	// Save the second fetched ticket and expect an error
// 	try {
// 		await secondInstance!.save()
// 	} catch (err) {
// 		expect(err).toBeTruthy()
// 	}
// })

it('Increments the version number on multiple saves', async () => {
	// Create an instance of a ticket
	const ticket = Ticket.build({
		title: 'Test',
		price: 20,
		userId: '23232f'
	})

	// Save it to the DB
	await ticket.save()
	expect(ticket.version).toEqual(0)
	await ticket.save()
	expect(ticket.version).toEqual(1)
	await ticket.save()

	expect(ticket.version).toEqual(2)
})
