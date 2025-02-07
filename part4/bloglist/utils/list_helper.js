const {log, error} = require("../utils/logger")
const lodash = require("lodash");
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
    if (!blogs || blogs.length === 0)
    {
        return null;
    }
    const max = lodash.groupBy(blogs, 'author');

    let author = { author: null, blogs: 0 };

    lodash.forEach(max, (authorBlogs, _author) =>{
        const length = authorBlogs.length;
        if (author.blogs < length)
        {
            author = {author: _author, blogs: length};
        }
    })
    return author
}

const mostLikes = (blogs) => {
    if (!blogs || blogs.length === 0)
    {
        return null;
    }
    const authors = lodash.groupBy(blogs, 'author');
    let author = {author: null, likes:0};

    lodash.forEach(authors, (authorBlogs, _author) => {
        const sum = authorBlogs.reduce((acc, blog) => acc + blog.likes, 0);
        if (sum > author.likes)
        {
            author = { author:_author, likes: sum }
        }
    })
    return author;
}

const mostBlogsManual = (blogs) => {
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

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes};
