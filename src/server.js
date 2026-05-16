const express = require("express");
require("dotenv").config();
const connectMongo = require("./infrastructure/database/mongo");
const postRoutes = require('./api/routes/postRoutes');


const app = express();
app.use(express.json());


const PORT = process.env.PORT || 8000;


app.get("/", (req, res) => {
    res.send("API Running");
});

app.use('/api/posts', postRoutes);


async function startServer() {
    try {
        await connectMongo();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Database connected successfully`);

        })
    }
    catch (error) {
        console.log("Failed to start server: ", error);
    }
}

startServer();