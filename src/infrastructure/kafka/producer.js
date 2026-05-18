const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

async function connectProducer(retiries = 5) {
    while (retiries) {
        try {
            await producer.connect();
            console.log("...Kafka Producer Connected");
            return;
        }
        catch (error) {
            console.log("Kafka connection failed, retrying...");
            retiries--;
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
    throw new Error("Could not connect to Kafka");
}

async function publishPostCreatedEvent(postData) {
    const message = {
        event: "POST_CREATED",
        data: {
            postId: postData.id,
            title: postData.title,
            content: postData.content,
            author: postData.author,
            created_at: postData.createdAt,
            updated_at: postData.updatedAt
        }
    }

    await producer.send({
        topic: process.env.KAFKA_TOPIC,
        messages: [
            { value: JSON.stringify(message) }
        ]
    })
    console.log("Post event published", message);
}

module.exports = {
    connectProducer,
    publishPostCreatedEvent
};
