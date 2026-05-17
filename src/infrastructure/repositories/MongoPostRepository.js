const PostRepository = require('../../domain/post/PostRepository');
const PostModel = require('./PostModel');
const Post = require('../../domain/post/Post');

class MongoPostRepository extends PostRepository {
    async create(postData) {
        const createdPost = await PostModel.create({
            title: postData.title,
            content: postData.content,
            author: postData.author,
        });
        return new Post(
            createdPost._id,
            createdPost.title,
            createdPost.content,
            createdPost.author,
            createdPost.createdAt,
            createdPost.updatedAt
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