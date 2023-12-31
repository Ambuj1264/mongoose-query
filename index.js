const express=require("express")
const app=express();
const db=require("./connection/connection")
const port=process.env.PORT || 4500
const cors=require("cors")
const router=require("./routes/router")
const fileUpload = require('express-fileupload');



app.use(cors())
app.use(fileUpload({
    useTempFiles : true,
}));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(router)

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
}
)

