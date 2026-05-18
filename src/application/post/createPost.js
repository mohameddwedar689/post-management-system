const { randomUUID } = require('crypto')
const Post = require('../../domain/post/Post');

async function createPost(postRepository, eventPublisher, postData) {
    const { title, content, author } = postData;

    if (!title || !content || !author) {
        throw new Error("Invalid post data");
    }

    const post = new Post(randomUUID(), title, content, author, new Date(), new Date());

    const createdPost = await postRepository.create(post);

    await eventPublisher(createdPost);

    return createdPost;
}

module.exports = createPost;