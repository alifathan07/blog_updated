import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;
// app.use('view engine', 'ejs');
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
let posts = [
    
];
app.get('/', (req, res) =>{
    res.render('index.ejs', {posts: posts});
})
app.get('/create', (req, res) =>{
    res.render('create.ejs', {posts: posts});
});
app.post('/submit', (req, res) =>{
    const id =  posts.length + 1;
    const title = req.body.title;
    const content = req.body.content;
    var add = posts.push({id : id, title : title , content : content});
    res.redirect('/');
});
app.get('/view/:id', (req, res) =>{
    const post = posts.find(post => post.id === Number(req.params.id));
    res.render('view.ejs', {post: post});
});
app.get('/edit/:id', (req, res) =>{
    const post = posts.find(post => post.id === Number(req.params.id))
    res.render('edit.ejs', {post: post});
});

app.post('/submit/:id', (req, res) =>{
    const title = req.body.title;
    const content = req.body.content;
    posts = posts.map(post => 
        post.id === Number(req.params.id) ? { ...post, title: title, content: content } : post
      );
    res.redirect('/');
});
app.post('/delete/:id', (req, res) => {
    // katkhali ghire li makissawiwche lid dial lpost 
    posts = posts.filter(post => post.id !== Number(req.params.id));
    res.redirect('/');
});



// app.get('/edit/:id',(req, res) => {
//     const 
// });
app.listen(port, (req, res) =>{
    console.log('Server is running on port 3000');
});

// const modifiedEmployees = employees_data.map(obj => {
//     if (obj.employee_id === 2) {
//         return { ...obj, employee_name: "rahul" };
//     }
//     return obj;
// });