const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const https = require('https')


dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=> {
    res.sendFile(__dirname + "/signup.html")
})
app.post('/',(req,res)=> {
   
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email
    

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_field: {
                FNAME: firstname,
                LNAME: lastname
            }
            
        }]
        
    }
   
    const jsonData = JSON.stringify(data)
    const url = process.env.URL
    const options = {
        method: "POST",
        auth: process.env.AUTH,
        
    }
   const request =  https.request(url, options, (resp)=> {
        resp.on("data",(d)=> {
            console.log(JSON.parse(d));
            if(resp.statusCode == 200){
               
                res.sendFile(__dirname + "/success.html")
                
            }else{
                res.sendFile(__dirname + "/failure.html")
            }

        })
    })

request.write(jsonData)
request.end();

})
app.post('/failure', (req, res)=> {
    res.redirect('/')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening from port 3000')
})

// Mailchimp api key: 808873b8b63b705198564dc144e13cf2-us18
// list id c6dbf3f0f7