import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './configs/viewEngine';
import webRoutes from './routes/web';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// viewEngineの設定
configViewEngine(app);

// webRoutesの設定
webRoutes(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('App is running at the port: ' + port);
});
