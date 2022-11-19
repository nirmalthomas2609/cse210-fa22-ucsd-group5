const express = require('express')
const path = require('path');

const router = express.Router();

const app = express()

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/front-end/index.html'));
  //__dirname : It will resolve to your project folder.
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');



// https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
