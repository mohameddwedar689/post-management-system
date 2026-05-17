const PostRepository = require('../../domain/post/PostRepository');
const PostModel = require('./PostModel');
const Post = require('../../domain/post/Post');

class MongoPostRepository extends PostRepository {
    async create(post) {
        const post = await PostModel.create({
            title: post.title,
            content: post.content,
            author: post.author,
        });
        return new Post(
            post._id,
            post.title,
            post.content,
            post.author,
            post.createdAt,
            post.updatedAt
        );
    }

    async findById(id) {
        const post = await PostModel.findById(id);
        if (!post) {
            return null;
        }
        return new Post(
            post._id,
            post.title,
            post.content,
            post.author,
            post.createdAt,
            post.updatedAt
        );
    }

    async findAll() {
        const posts = await PostModel.find().sort({ createdAt: -1 });
        return posts.map(post => {
            return new Post(
                post._id,
                post.title,
                post.content,
                post.author,
                post.createdAt,
                post.updatedAt
            );
        });
    }
}

module.exports = MongoPostRepository;