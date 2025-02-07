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

module.exports = {dummy, totalLikes, favoriteBlog};
