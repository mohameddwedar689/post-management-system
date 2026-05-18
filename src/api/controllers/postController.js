const MongoPostRepository = require("../../infrastructure/repositories/MongoPostRepository");
const createPost = require("../../application/post/createPost");
const getPost = require("../../application/post/getPost");
const listPosts = require("../../application/post/listPosts");
const { publishPostCreatedEvent } = require("../../infrastructure/kafka/producer");

const postRepository = new MongoPostRepository();


async function createPostController(req, res) {
    try {
        const post = await createPost(postRepository, publishPostCreatedEvent, req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPostController(req, res) {
    try {
        const post = await getPost(postRepository, req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function listPostsController(req, res) {
    try {
        const posts = await listPosts(postRepository);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createPostController,
    getPostController,
    listPostsController
};
