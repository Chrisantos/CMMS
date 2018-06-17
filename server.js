const express         = require('express');
const mongoose        = require('mongoose');
const exphbs          = require('express-handlebars');

// const chatRoute       = require('./routes/chatRoute');
const hrRoute         = require('./routes/hrRoute');
const inventoryRoute  = require('./routes/inventoryRoute');
const logbookRoute    = require('./routes/logbookRoute');
const scheduleRoute   = require('./routes/scheduleRoute');

const app = express();
const mongoUri = "mongodb://127.0.0.1/cmms";
mongoose.connect(mongoUri);

app.use(express.static(__dirname + "/public"));

require('./routes/route')(app);
app.use('/hr', hrRoute);
app.use('/inventory', inventoryRoute);
app.use('/logbook', logbookRoute);
app.use('/maintenance', scheduleRoute);


app.set('port', process.env.PORT || 5050);
app.set('view engine', '.hbs');
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));

app.get('/aschedule', (req, res) =>{
    res.render('schedule/aschedule');
});

app.listen(app.get('port'), () =>{
    console.log(`Server up and running at http://localhost/${app.get('port')}`);
});