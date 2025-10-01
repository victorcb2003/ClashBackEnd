const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const iniDb = require('./app/db/init');
iniDb();

const routes =  require("./app/routes/index");
routes(app);

app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});
