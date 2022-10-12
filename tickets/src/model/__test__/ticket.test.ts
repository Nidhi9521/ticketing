import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {

    // create an instance of a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 5,
        userId: '123'
    })

    // save the ticket to the database
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secoundInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the ticket we fetched
    firstInstance?.set({ price: 10 })
    secoundInstance?.set({ price: 15 })

    // sace the first feteched ticket
    await firstInstance?.save();

    // save the secound feteched ticket and expect an error
    try { 
        await secoundInstance?.save(); 
    } catch (err) {
        console.log(err);
        return ;
    }
    throw new Error('Should not rech this point')

})

it('increments the version number on multiple saves',async()=>{
    const ticket=Ticket.build({
        title:'concert',
        price: 20,
        userId: '1230'
    })

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
    
})