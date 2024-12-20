const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require("uuid")
const HttpError = require('../models/errorModel')
const { mongoose } = require('mongoose')



//============================== CREATE NEW POST
// POST : api/posts/
// PROTECTED
const createPost = async (req, res, next) => {
    try {
        let {title, category, description} = req.body;
        if(!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422))
        }
        
        const {thumbnail} = req.files;
        // sprawdzenie rozmiaru pliku
        if(thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail too big. File size should be less than 2mb"))
        }
        
        let fileName;
        fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]
        thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if(err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({title, category, description, thumbnail: newFilename, creator: req.user.id});
                if(!newPost) {
                    return next(new HttpError("Something went wrong.", 422))
                }
                // zwiekszenie liczby postów dla danego usera
                const currentUser = await User.findById(req.user.id)
                const userPostCount = currentUser?.posts + 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})

                res.status(201).json(newPost)
            }
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}




//============================== GET ALL POSTS
// GET : api/posts/
// UNPROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({updatedAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error))
    }
}




//============================== GET SINGLE POSTS
// GET : api/posts/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
    try {
        const postID = req.params.id;
        const post = await Post.findById(postID);
        if(!post) {
            return next(new HttpError("Post not found.", 404))
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error));
    }
}


//============================== GET POSTS BY CATEGORY
// GET : api/posts/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) => {
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//============================== GET POSTS BY AUTHOR
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
    const {id} = req.params;
    try {
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        res.json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}





//============================== EDIT POST
// PATCH : api/posts/:id
// PROTECTED
const editPost = async (req, res, next) => {
    let fileName;
    let newFilename;
    let updatedPost
    try {
        const postID = req.params.id;
        let {title, category, description} = req.body;
        //12 znaków bo <br> pomiedzy
        if(!title || !category || description.length < 12) {
            return next(new HttpError("Fill all fields", 422))
        }
        
        // stary post z bazy
        const oldPost = await Post.findById(postID);

        if(req.user.id == oldPost.creator) {
            // aktualizacja postu bez miniaturki
            if(!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postID, {title, category, description}, {new: true})
            } else {
                // usuniecie miniaturki z przesłanych
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                }})
                
                // przesłąnie nowej miniaturki
                const {thumbnail} = req.files;
                // sprawdzenie rozmiaru pliku
                if(thumbnail.size > 2000000) {
                    return next(new HttpError("Thumbnail too big. Should be less than 2mb"))
                }
                fileName = thumbnail.name;
                let splittedFilename = fileName.split('.')
                newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                    if(err) {
                        return next(new HttpError(err))
                    }
                })
        
                updatedPost = await Post.findByIdAndUpdate(postID, {title, category, description, thumbnail: newFilename}, {new: true})
            }
        } else {
            return next(new HttpError("Couldn't update post.", 403))
        }

        if(!updatedPost) {
            return next(new HttpError("Couldn't update post", 400))
        }
        res.json(updatedPost)

    } catch (error) {
        return next(new HttpError(error))
    }
}





//============================== DELETE POST
// DELETE : api/posts/:id
// PROTECTED
const removePost = async (req, res, next) => {
    const postID = req.params.id;
    if(!postID) {
        return next(new HttpError("Post unavailable"))
    }
    const post = await Post.findById(postID);
    const fileName = post?.thumbnail;
    if(req.user.id == post.creator) {
        // usuniecie thumbnail'a z uploudów
    fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
        if (err) {
            return next(err)
        } else {
            await Post.findByIdAndDelete(postID)
            // znajdz usera i zmniejsz liczbe postow o 1
            const currentUser = await User.findById(req.user.id)
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
            res.json("Post deleted")
        }
        })
    } else {
        return next(new HttpError("Couldn't delete post.", 403))
    }
}

module.exports = {getPosts, getPost, getCatPosts, getUserPosts, createPost, editPost, removePost}