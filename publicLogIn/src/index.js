const express = require('express');
const app = express();
const router = require('./routesIndex');
const corsOptions = require('./corsOptions.js');
const response = require('./utils/responses');
const cookieParser = require('cookie-parser');
const dailyTasks = require('./databaseUtils/dailyTasks.js');
const httpsServer = require('./httpsServer.js');

app.use(express.json());
app.use(cookieParser());
app.use(corsOptions);

app.use(router);

app.all('*', (req,res,next)=>{
    response.error(req,res,`No se encuentra ${req.method} ${req.originalUrl} en el servidor`,404);
});

dailyTasks();

let App = app;

if(process.env.NODE_ENV === 'vps')
{
    App = httpsServer(app);
}

const port = process.env.PORT || 3000;
App.listen(port, () => console.log(`Escuchando puerto ${port}...`));