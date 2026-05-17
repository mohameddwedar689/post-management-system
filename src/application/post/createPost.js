const { randomUUID } = require('crypto')
const Post = require('../../domain/post/Post');

async function createPost(postRepository, postData) {
    const { title, content, author } = postData;

    if (!title || !content || !author) {
        throw new Error("Invalid post data");
    }

    const post = new Post(randomUUID(), title, content, author, new Date(), new Date());

    return await postRepository.create(post);
}

module.exports = createPost;