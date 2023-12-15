const ProductPrechages = require("../model/productPerchages");
const ProductModel = require("../model/productSchema");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzepo3ahj",
  api_key: "361849511236691",
  api_secret: "mltoKlZetZWH5NiokGqLbYkkjtw",
});
const 
productMaster = {
  product: async (req, res) => {
    try {
      const file = req.files.image;
      console.log(file);
      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(result);
        }
      );
      console.log(result);

      const allClothes = new ProductModel({
        name: req.body.name,
        brand: req.body.brand,
        fakeprice: req.body.fakeprice,
        realprice: req.body.realprice,
        image: result.url,
        description: req.body.description,
        rating: req.body.rating,
        category: req.body.category,
      });
      const savedClothes = await allClothes.save();
      console.log(allClothes);
      res.status(202).json(savedClothes);
    } catch (error) {
      console.log(error);
      res.status(404).json({ msg: error.message });
    }
  },

  productAll: async (req, res, next) => {
    try {
      const fulldata = await ProductModel.find();
      console.log(fulldata);
      res.status(202).json(fulldata);
    } catch (error) {
      console.log(error);
      res.status(404).send(error.message);
    }
  },
  createProuductData: async (req, res) => {
    try {
      const { productId, userId, price } = req.body;
      console.log((productId && userId && price), !(productId && userId && price))
      if (!(productId && userId && price)) {
        return res
          .status(400)
          .json({ msg: "productId,userId,price should not be empty" });
      }

      const createData= await ProductPrechages.create({
        productId, userId, price
      })
      await createData.save()
      if(createData){
          return res
        .status(200)
        .json({ status:true,data: createData });
    
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
  findProuductData: async (req, res) => {
    try {
      const { _id } = req.body;
      if(!_id){
        return res
        .status(400)
        .json({success:false,data:[], msg: "_id is required" });
       
      }
      const findData= await ProductPrechages.findById(_id).populate({path:"productId", select:"image realprice"}).populate({path:'userId', select:"name email"})  //select which key you wanted 
      if(!findData){
        return res
        .status(400)
        .json({success:false,data:[], msg: "data not find" });
      }
      res.status(200).send({
        status:true,
        message:"data is found",
        data:findData
      })
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
  aggregation: async(req,res)=>{
    const {brand}= req.body;
    try {
      const findData= await ProductModel.aggregate([
        {
          $match: {//match is used  for the filter  
            brand
          },

        },{
          $group:{
            _id: '$fakeprice',  //id with group based on the key 
            data: {
              $push: '$$ROOT'  //get all data 
            }
          }
        },
        {
          $project:{  // which data you wanted, 
            _id:true,  // use true and false | 0 or 1
            'data.brand':true // use true and false | 0 or 1
          }
        }
      ])
      if(!findData){
        return res
        .status(400)
        .json({success:false,data:[], msg: "data not find" });
      }
      res.status(200).send({
        status:true,
        message:"data is found",
        data:findData
      })

    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
};
module.exports = productMaster;
