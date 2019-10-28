require('dotenv').config();
const express=require('express');
const session=require('express-session');
const massive=require('massive');
const {CONNECTION_STRING, SESSION_SECRET} = process.env;
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const port = 4000;

const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('database connected')
})

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
}))

////header endpoints////
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);
////treasure endpoints////
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);


app.listen(port, () => console.log(`running on ${port}.`));

