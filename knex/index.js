const db = require('./db');
const conn = db.getPoolConnection();

async function getAuthorbyId(id) {
    const authors = await conn('authors').where({ id }).select();
    console.log(authors);
}

async function getAuthorAndPosts(idAuthor) {
    const authors = await conn('authors').where({ id: idAuthor }).select('id', 'first_name');
    const authorsPromise = authors.map(async (author) => {
        const posts = await conn('posts')
        .whereRaw(`author_id = ${author.id}`)
        .select();
        author.posts = posts;
        return author;
    });

    Promise.all(authorsPromise)
    .then((authors) => {
        console.log('authors', authors);
    });
}

async function getAuthorAndPosts2() {
    let authorsAndPosts = await conn.from('authors')
        .column('authors.id as author_id', 'first_name', 'last_name', 'email', 'birthdate', 'added',
        'posts.id', 'title', 'description', 'content')
        .innerJoin('posts', 'authors.id', 'posts.author_id')
        .orderBy('authors.id')
        .limit(10);
    authorsAndPosts = authorsAndPosts.reduce((authors, authorPost) => {
        const { author_id, first_name, last_name, email, birthdate, added, ...post } = authorPost;
        let authorIndex = authors.findIndex(author => author.id == author_id);
        if(authorIndex === -1) {
            authorIndex = authors.push({
                id: author_id, first_name, last_name, email, birthdate, added,
                posts: []
            });
            authorIndex--;
        }

        authors[authorIndex].posts.push(post);

        return authors;
    }, []);
    console.log('authorsAndPosts', authorsAndPosts);
}

//getAuthorbyId(1);

//getAuthorAndPosts(1);

getAuthorAndPosts2();