const dummy = (blogs) => 1
const totalLikes = (blogs) =>  blogs.reduce((acc, val) => acc + val.likes, 0);
module.exports = {dummy, totalLikes};
