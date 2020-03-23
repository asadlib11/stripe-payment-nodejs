const express = require('express');
const stripe = require('stripe')('yourSecretKey')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set static folder for images and stylesheets
app.use(express.static(`${__dirname}/public`));

//index route
app.get('/', (req,res) => {
    res.render('index');
})

//success route
app.get('/success', (req,res) => {
    res.render('success');
})

//charge route
app.post('/charge', (req,res)=>{
    const amount = 2500;
    
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then( customer => stripe.charges.create({
        amount,
        description: 'Zlatan Ibrahimovic Ebook',
        currency: 'usd',
        customer: customer.id
    }))
    .then(charge => res.render('success'));
})

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});