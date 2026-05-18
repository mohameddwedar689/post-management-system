const { Kafka } = require('kafkajs');
require("dotenv").config();

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'post-group' });

async function connectConsumer() {
    await consumer.connect();
    console.log("...Kafka Consumer Connected");

    console.log("Topics: ", process.env.KAFKA_TOPIC);


    await consumer.subscribe({
        topic: process.env.KAFKA_TOPIC,
        fromBeginning: true
    });

    console.log("Subscribed to topic", process.env.KAFKA_TOPIC);

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const event = JSON.parse(
                message.value.toString()
            );

            console.log("Event Received: ");
            console.log(event);

            if (event.event === 'POST_CREATED') {
                console.log(`Processing Post: ${event.data.title}`);
                console.log(`Author: ${event.data.author}`);
                console.log(`Content: ${event.data.content}`);
            }
        }
    });
}

module.exports = {
    connectConsumer
}
