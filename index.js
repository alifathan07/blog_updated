import express from 'express';
import bodyParser from 'body-parser';
import { render } from 'ejs';
import session from 'express-session'; // Import express-session

const app = express();
const port = 3000;
// app.use('view engine', 'ejs');
app.use(express.static('public'));
// Session configuration
app.use(session({
    secret: 'ali dev', // Use a strong secret in production
    resave: false,
    saveUninitialized: true,
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let posts = [
    {
        id: 1,
        title: 'Node.js Tutorial',
        content: 'Node.js is a runtime environment for JavaScript',
        category : 'programing',
        likedBy: [],
        dislikedBy: [],
        comments: [],
            
        
    },
    {
        id: 2,
        title: 'Express.js Tutorial',
        content: 'Express.js is a web application framework for Node.js',
        category : 'programing',
        likedBy: [],
        dislikedBy: [],
        comments: [],

    },
    {
        id: 3,
        title: 'MongoDB Tutorial',
        content: 'MongoDB is a NoSQL database',
        category : 'database',
        likedBy: [],
        dislikedBy: [],
        comments: [],

    },
    {
        id: 4,
        title: 'Angular Tutorial',
        content: 'Angular is a JavaScript framework for building user interfaces',
        category : 'programing',
        likedBy: [],
        dislikedBy: [],
        comments: [],

    }
  ];
let comments = [

];
  

let categories = [
    
   ];
let users = [

    
];

// all posts //
app.get('/', (req, res) =>{
    res.render('index.ejs', {posts: posts, categories: categories, user: req.session.user});
});

// {*categories crud *}//
app.get('/categories', (req,res) => {
    res.render('categories/index.ejs',{categories : categories, user: req.session.user});
});

app.get('/create/categories', (req,res) => {
    res.render('categories/create.ejs',{categories : categories, user: req.session.user});
});

app.post('/submit/categories', (req,res) => {
    const id =  categories.length + 1;
    const title = req.body.title;
    var add = categories.push({id : id, title : title});
    res.redirect(req.headers.referer);
});
app.get('/posts/categories/:name', (req,res) => {
    const fimtrepost = posts.filter(post => post.category === req.params.name);
    
    res.render('categories/postscat.ejs', {posts: fimtrepost, post : req.params.name , categories: categories});
});
app.get('/edit/categories/:id', (req, res) => {
    let editcat = categories.find(c => c.id === Number(req.params.id));
    res.render('categories/edit.ejs', {editcat: editcat, user: req.session.user})
});

app.post('/submit/edit/categories/:id', (req,res) => {
    const title = req.body.title;
    categories = categories.map(cat => 
    cat.id === Number(req.params.id) ? { ...cat, title :title} : cat );
    res.redirect(req.headers.referer);

});
app.post('/delete/categories/:id', (req, res) => {
    categories = categories.filter(cat => cat.id !== Number(req.params.id));

    res.redirect(req.headers.referer);

})
// {*posts crud *}//

app.get('/search', (req, res) => {
    let search = req.query.search;
  
    // Exact match search
    let fondpost = posts.find((element) => {
        const elementtitle = element.title.toLowerCase();
        const searchLower = search.toLowerCase();
      
        // Get the length of the search input
        const searchLength = searchLower.length;
      
        // Check if the title includes the search string
        return elementtitle.includes(searchLower) || 
               (searchLength >= 3 && elementtitle.startsWith(searchLower)) || 
               (searchLength >= 4 && elementtitle.substring(0, 10).includes(searchLower.substring(0, 10))) || 
               (searchLength >= 5 && elementtitle.endsWith(searchLower));
      });
  
    // Partial match search (first 4 characters)
    let fondposti = posts.find((element) => {
        const elementcontent = element.content.toLowerCase();
        const searchLower = search.toLowerCase();
    
        // Get the length of the search input
        const searchLength = searchLower.length;
    
        // Check if the content includes the search string
        return elementcontent.includes(searchLower) || 
               (searchLength >= 3 && elementcontent.startsWith(searchLower)) || 
               (searchLength >= 4 && elementcontent.substring(0, 10).includes(searchLower.substring(0, 10))) || 
               (searchLength >= 5 && elementcontent.endsWith(searchLower));
    });
    
    if(search === ""){
        // If no match is found, show an "undefined" template
        res.render('posts/undefind.ejs', { search: search });
    }    // If an exact match is found, render it
    else if (fondpost) {
        res.render('posts/show.ejs', { post: fondpost, search: search });
    }
    // Otherwise, if a partial match is found, render the partial match
    else if (fondposti) {
        res.render('posts/show.ejs', { post: fondposti, search: search });
    }
    // If no match is found, show an "undefined" template
    else {
        res.render('posts/undefind.ejs', { search: search });
    }
  });


app.get('/posts', (req, res) =>{
    res.render('posts/index.ejs', {posts: posts, categories: categories, user: req.session.user});
})
app.get('/create/post', (req, res) =>{
    res.render('posts/create.ejs', {posts: posts, categories: categories,user: req.session.user});
});

app.post('/submit/post', (req, res) =>{
    const id =  posts.length + 1;
    const category = req.body.category;
    const username = req.session.user.username;
    const datenox = new Date();
    const day = datenox.getDate();
    const month = datenox.getMonth() + 1;
    const year = datenox.getFullYear();
    const comments = [];

// This arrangement can be altered based on how we want the date's format to appear.
    const date = `${day}-${month}-${year}`;

    const title = req.body.title;
    const content = req.body.content;
    var add = posts.push({id : id,username : username, title : title , content : content, category : category, date : date, comment: comments});
    res.redirect('/posts');
});

app.post('/submit/post/view/:id', (req, res) =>{
    const like = req.body.view;
    posts = posts.map(post => 
        post.id === Number(req.params.id) ? { ...post, view : (post.view || 0 ) + 1 } : post
      );
    res.redirect(`/view/post/${req.params.id}`);
});
app.get('/view/post/:id', (req, res) =>{
    const post = posts.find(post => post.id === Number(req.params.id));
    res.render('posts/view.ejs', {post: post, user: req.session.user});
});
app.get('/edit/post/:id', (req, res) =>{
    const post = posts.find(post => post.id === Number(req.params.id))
    res.render('posts/edit.ejs', {post: post, categories: categories, user: req.session.user});
});

app.post('/submit/post/:id', (req, res) =>{
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    posts = posts.map(post => 
        post.id === Number(req.params.id) ? { ...post, title: title, content: content, category : category} : post
      );
    res.redirect('/posts');
});
app.post('/delete/post/:id', (req, res) => {
    // katkhali ghire li makissawiwche lid dial lpost 
    posts = posts.filter(post => post.id !== Number(req.params.id));
    res.redirect('/posts');
});
// {{{/// like and dislike }}} 
app.post('/submit/post/like/:id', (req, res) => {
    const postid = Number(req.params.id);
    const userid = Number(req.session.user.id);
    let post = posts.find(post => post.id === postid);
    if (post) {
        post.likedBy = post.likedBy || [] ;
        post.dislikedBy = post.dislikedBy || [] ;
        if (!post.likedBy.includes(userid)) {
            post.like = (post.like || 0) + 1 ;
            if (post.dislikedBy.includes(userid)) {
                post.dislike = (post.dislike || 0) - 1 ;
                post.dislikedBy=post.dislikedBy.filter(user => user !== userid);
            }
            post.likedBy.push(userid);
        }
        
    }
    res.redirect(req.headers.referer);
});
app.post('/submit/post/dislike/:id', (req, res) => {
    const postid = Number(req.params.id);
    const userid = Number(req.session.user.id);
    let post = posts.find(post => post.id === postid);

    if (post) {
        post.likedBy = post.likedBy || [] ;
        post.dislikedBy = post.dislikedBy || [] ;
        if (!post.dislikedBy.includes(userid)) {
            post.dislike = (post.dislike || 0) + 1 ;
            if (post.likedBy.includes(userid)) {
                post.like = (post.like || 0) - 1 ;
                post.likedBy = post.likedBy.filter(user => user !== userid);
            }
            post.dislikedBy.push(userid);
        }
    } 


    
    res.redirect(req.headers.referer);
});



// {{{{{{{{{{User Login / Register / logout}}}}}}}}}}
const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        // User is logged in, redirect to home
        return res.redirect('/');
    }
    next(); // User is not logged in, proceed to the login route
};
app.get('/register', (req, res) => {
    res.render('users/register.ejs', {user: req.session.user});
});
app.post('/register', (req, res) =>{
    const id = users.length + 1;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    users.push({ id : id , username: username, email: email, password : password });
    res.redirect('/login');
    console.log(users)
})

app.get('/login', isLoggedIn, (req, res) => {
    res.render('users/login.ejs', {user: req.session.user});
});


app.post('/submit/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let user  = users.find(user  => user.email === email);
    if (user && user.password === password) {
        req.session.user = user;
        res.redirect('/profile/' + user.id);
    } else {
        res.redirect('/login');
    }
});
app.get('/logout', (req,res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
})
// Redirect logged-in user to their profile
app.get('/profile/:id', (req, res) => {
    const user = users.find(user => user.id === Number(req.params.id));
    if (req.session.user.id === user.id) {
        res.render('users/profile.ejs', { user: user , check : req.session.user.id});

    }else{
        res.redirect('/login');
    }
    
});
app.get('/edit/profile/:id', (req, res) => {
    const user = users.find(user => user.id === Number(req.session.user.id));
    res.render('users/edit.ejs', { user: user });
});
app.post('/submit/edit/profile/:id', (req, res) =>{
    const user = req.session.user;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    users = users.map(user => 
        user.id === Number(req.params.id) ? { ...user, username :username, email: email, password : password} : user );
    res.redirect('/profile/' + user.id);
})
//{{{{{{ users can see ther posts in there private place}}}}}}/
app.get('/post/user/:id', (req, res) => {
    const userid = req.session.user?.id; // Optional chaining for safety
    if (!userid) {
        return res.status(401).send('User not authenticated'); // Handle unauthenticated users
    }
    const userpost = posts.filter(post => post.userId === userid); // Ensure you compare the right properties
    res.render('users/postuser.ejs', { userpost, user: req.session.user });
});

// {{{{{{{{{{{{{{{user post comment }}}}}}}}}}}}}}}
// Comments on posts

// Render post view and display comments

app.post('/submit/comment/:id', (req, res) => {
    const postId = Number(req.params.id);
    const post = posts.find(post => post.id === postId);
    const comment = req.body.comment;
    const id = comments.length + 1;
    const username = req.session.user.username;
    if (post) {
        if (!post.comments) {
            post.comments = [];  // Initialize the comments array if it doesn't exist
        }
    
        // Now it's safe to push the comment
        post.comments.push({
            id : id ,
            username: username,  // Save the comment with the username of the logged-in user
            content: comment,
        });
    } else {
        console.log("Post not found");
    }
    
    res.redirect(req.headers.referer);

    
    
});



// {{{{{running Server}}}}}
app.listen(port, (req, res) =>{
    console.log('Server is running on port 3000');
});
