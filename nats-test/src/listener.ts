import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  const options = stan.subscriptionOptions();
  // This is used to manually acknowledge the messages
  options.setManualAckMode(true);
  // This is used to deliver all the messages that are available in the queue
  // This will make sure the very first time the listener starts,
  // it will deliver all the messages that are available in the queue
  options.setDeliverAllAvailable();
  // Keeps track of the messages that are delivered to the queue
  // If the listener is restarted, it will resume from the last message that was delivered
  // to the queue.
  options.setDurableName("orders-service-durable");

  // Queue group avoids redelivery when the listener is restarted
  const subscription = stan.subscribe("ticket:created", "orders-service-queue-group", options);

  subscription.on("message", (msg: nats.Message) => {
    const data = JSON.parse(msg.getData().toString());

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    } else {
      console.log(`Received event #${msg.getSequence()}, with data: ${JSON.stringify(data)}`);
    }

    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());