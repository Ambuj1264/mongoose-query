const mongoose = require("mongoose")

const mySchema = new mongoose.Schema({
    productId: {
        type : mongoose.Schema.Types.ObjectId,
        ref:"productmodels",
        require:true
    },
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
   price:{
    type : String,
    require:true
   } 

});

const ProductPrechages= mongoose.model("ProductPrechages", mySchema);
module.exports=ProductPrechages;
