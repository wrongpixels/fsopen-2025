const {log, error} = require("../utils/logger")
const dummy = (blogs) => 1
const totalLikes = (blogs) =>  blogs.reduce((acc, val) => acc + val.likes, 0);

const favoriteBlog = (blogs) => {
    let mostLiked = null;
    blogs.forEach(b => {
        if (!mostLiked || b.likes > mostLiked.likes)
        {
            mostLiked = { title: b.title, author: b.author, likes: b.likes };
        }
    })
    return mostLiked;
}

const mostBlogs = (blogs) => {
    let authors = [];
    blogs.forEach(b => {
        let existing = authors.find(blog => blog.author === b.author);
        if (existing)
        {
            log("updating", authors)
        }
        else
        {
            authors.push({author: b.author, blogs: 1})
        }
    } )
    let mostBlogged = null;
    if (authors)
    {
        authors.forEach(author => {
            if (!mostBlogged || author.blogs > mostBlogged.blogs)
            {
                mostBlogged = author;
            }
        })
    }
    return mostBlogged;
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs};
