async function getPost(postRepository, id) {
    const post = await postRepository.findById(id);
    if (!post) {
        throw new Error("Post not found");
    }
    return post;
}

module.exports = getPost;