const bookshelf = require('./db');

const Author = bookshelf.Model.extend({
    tableName: 'authors',
    posts: function() {
        return this.hasMany(Post);
    }
});

const Post = bookshelf.Model.extend({
    tableName: 'posts',
    author: function() {
        return this.belongsTo(Author);
    }
});

async function getAuthorById(id) {
    const author = await Author.where({id}).fetch();
    console.log('getAuthorById', author.toJSON());
}

async function getAuthorAndPosts(idAuthor) {
    const author = await Author.where({id: idAuthor}).fetch({
        columns: ['id', 'first_name', 'last_name', 'email'],
        withRelated: [ 'posts' ]
    });
    console.log('getAuthorAndPosts', author.toJSON());
}


async function getAuthorAndPosts2(idAuthor) {
    const author = await Author.where({id: idAuthor}).fetch({
        columns: ['id', 'first_name', 'last_name', 'email'],
        withRelated: [ {
            posts: function(query) {
                //Siempre se debe incluir la columna de foranea de la tabla padre
                query.column('id', 'title', 'author_id');
            }
        } ]
    });
    console.log('getAuthorAndPosts', author.toJSON());
}

async function saveAuthorWithPosts(data) {
    try{

        let { posts, ...author } = data;
        author = await bookshelf.transaction(function(t) {
            return new Author(author)
            .save(null, { transacting: t })
            .tap(function(authorModel) {
                return Promise.all(posts.map(function(post) {
                    return new Post(post).save({author_id: authorModel.id}, {transacting: t});
                }));
            });
        });
        console.log('saveAuthorWithPosts', author);
    } catch(error){
        console.error('saveAuthorWithPosts', error)
    }
    
}

getAuthorById(1);

getAuthorAndPosts(1);

getAuthorAndPosts2(1);

saveAuthorWithPosts({
    first_name: 'Fabián',
    last_name: 'Salazar',
    email: 'fasj90@hotmail.com',
    birthdate: new Date(),
    added: new Date(),
    posts: [
        { title: 'Node Js', description: 'Un post sobre Node Js', content: '', date: new Date() },
        { title: 'Android', description: 'Un post sobre Android', content: '', date: new Date() }
    ]
});