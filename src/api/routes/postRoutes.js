const express = require('express');
const router = express.Router();
const {
    createPostController,
    getPostController,
    listPostsController
} = require('../controllers/postController');


router.post('/', createPostController);
router.get('/:id', getPostController);
router.get('/', listPostsController);


module.exports = router;