async function listPosts(postRepository) {
    const posts = await postRepository.findAll();

    if (posts.length === 0) {
        throw new Error("No posts found");
    }

    return posts;
}

module.exports = listPosts;