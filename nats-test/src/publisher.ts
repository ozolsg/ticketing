import nats from 'node-nats-streaming';

console.clear();

// What they like to call it client
const stan = nats.connect('ticketing', 'abc123', {
  url: 'http://localhost:4222'
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 10,
  });

  stan.publish('ticket:created', data, () => {
    console.log("Event published to ticket:created");
  });

});
