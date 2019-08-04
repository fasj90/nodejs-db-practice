'use strict'

const db = require('./db');
const pool = db.getPoolConnection();

async function getAuthorById(id) {
    const [ results, fields ] = await pool.promise().query('select * from authors where id = ?', [ id ]);
    console.log('getAuthorById', results);
}

async function getAuthorAndPosts(idAuthor) {
    const pool = db.getPoolConnection();
    let [ authors, fields ] = await pool.promise().query('select * from authors where id = ?', [ idAuthor ]);

    const authorsPromise = authors.map(async (author) => {
        console.log('author', author);
        const [posts, fields] = await pool.promise().query('select * from posts where author_id = ?', [ author.id ]);
        //console.log('posts', posts);
        author.posts = posts;

        return author;
    });

    //console.log('authors', authors);
    return Promise.all(authorsPromise);
    // .then((authors) => {
    //     console.log('getAuthorAndPosts', authors);
    // });
}

getAuthorById(1)
.then(() => {
    return getAuthorAndPosts(1);
})
.then(() => {
    console.log('termino 1');
    pool.end(function (err) {
        // all connections in the pool have ended
    });
});