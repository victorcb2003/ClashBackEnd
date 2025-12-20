const express = require('express');
const cors = require('cors');
require("dotenv")

const app = express();

app.use(cors({
  credentials: true,
  origin : true  
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const iniDb = require('./app/db/init');
iniDb();

const routes =  require("./app/routes/index");
routes(app);

app.listen(process.env.PORT, () => {
  // console.log(`Server is running on port ${process.env.PORT}`);
});
