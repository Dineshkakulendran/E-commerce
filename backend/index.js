const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { log, error } = require("console");
const { request } = require("http");

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for the frontend
app.use(cors());

// Construct MongoDB URI from environment variables
const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const cluster = process.env.MONGODB_CLUSTER;
const database = process.env.MONGODB_DATABASE;

//database connection with MongoDB
const dbURI = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;

// Initialize database connection
mongoose.connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// API creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});



//1st API TESTING FOR UPLOAD IMAGE
//creating express login for our login endpoint
// get all product , multiple end-point also can create 
// Image storage engine, config diskstorage

const storage = multer.diskStorage({
  destination: './upload/images',
  filename:(req,file,cb)=>{
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({storage:storage})
//config disk storage end


//creating upload endpoint for images using post method 
//endpoint, statical end point
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
  res.json({
    success:1,
    image_url:`http://localhost:${port}/images/${req.file.filename}`
  })
})   
//upload image endpoint end


//2ND API TESTING FOR ADD PRODUCT 
//we can add the product to mongodb atles db, before create schema 
//schema for creating products
//use to store our products
const Product = mongoose.model("Product",{
  id:{
    type: Number,
    required:true,
  },
  name:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
  new_price:{
    type:Number,
    required:true,
  },
  old_price:{
    type:Number,
    required:true,
  },
  date:{
    type:Date,
    default:Date.now,
  },
  available:{
    type:Boolean,
    default:true,
  },
})

//for schema we creating here a endpoint with the name of addproduct 
app.post('/addproduct',async (req,res)=>{
  //find all the products 
  let products = await Product.find({});
  let id;
  if(products.length>0)
  {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id+1;
  }
  else{
    id=1;
  }
  //find all the products end
  const newProduct = new Product({
    id:id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,
  });
  //display these products in console
  console.log(newProduct);
  //save the products in database 
  await newProduct.save();
  console.log("saved");
  //get response in frontend
  res.json({
    success:true,
    name:req.body.name,
  })
})
//add product end code



//3) remove the product form database 
//creating api for delete products
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name
  })
})
//remove the product end code 



//4) get all the product available in database, using this can display the product in frontend
//creating API for getting all products
app.get('/allproducts', async(req,res)=>{
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
})
//end of the code allproducts 



//5) creating user id 
//user schema for user model
const Users = mongoose.model('Users', {
  name: {
    type:String,
  },
  email:{
    type:String,
    unique:true,
  },
  password:{
    type:String,
  },
  cartData:{
    type:Object,
  },
  date:{
    type:Date,
    default:Date.now,
  }
})

    //API end point for registering the user
app.post('/signup', async (req, res)=> {
  //check already using or not 
  let check = await Users.findOne({email:req.body.email});
  if (check) {
    return res.status(400).json({success:false, errors:"existing user found with same email id"}) //sucess:false bez already someone is there with the same email id, so this is an error
  }
  //if there is no users we creating empty cart data
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  //user using the user model, using this cart data we creating users 
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    // we using cart object to this cartData cart[i]
    cartData: cart,
  })

  //save the user in db
  await user.save();

  //creating token using this object
  const data = {
    //with user key, we have one object called with id that is user.is
    user: {
      id:user.id
    }
  }

  //create token using jwt.sign  method 
  const token = jwt.sign(data, 'secret_ecom');
  res.json({success:true, token})
})    



//6) creating end point for user login 
app.post('/login', async (req, res) => {
  let user = await Users.findOne({email:req.body.email});
  //if user availabe 
  if (user) {
    //comparing passowrd 
    const passCompare = req.body.password === user.password;
    // password is correct
    if (passCompare) {
      const data = {
        user: {
          id:user.id
        }
      }
      const token = jwt.sign(data, 'secret_ecom');
      res.json({success:true, token});
    }
    //password wrong
    else {
      res.json({success:false , errors: "Wrong password"});
    }
  }

  //if there is no user with that mail id
  else {
    res.json({success:false, errors: "Wrong Email id"})
  }
})



//7) creating endpoints for new collection data 
app.get('/newcollections', async (req, res)=>{
  //save all the products in one array form the mongodb database
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newcollection);
})



// 8) creating end point for popular in women section 
app.get('/popularinwomen', async (req, res) => {
  let products = await Product.find({category: "women"});
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});

//creating middelware to fetch user, using that we can convert the token to userId
const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  } else {
    try {
      const data = jwt.verify(token, 'secret_ecom');
      req.user = data.user; 
      next(); 
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
  }
};



/*//9)creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async(req, res)=>{
  /*
  console.log(req.body, req.user); 
  res.json({
    success: true,
    user: req.user,
    itemId: req.body.itemId,
    //
    console.log("added", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Added")
});*/

/*
// 10) creating endpoint to remove product from cart data
app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
  // Fetch user data from the database
  let userData = await Users.findOne({_id: req.user.id});
  if (userData.cartData[req.body.itemId] > 0)
  userData.cartData[req.body.itemId] -= 1
  await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
  res.send("Removed")
})*/

//9) creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
  console.log("added", req.body.itemId);
  try {
    let userData = await Users.findOne({_id: req.user.id});
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send("Added");
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 10) creating endpoint to remove product from cart data
app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
  try {
    let userData = await Users.findOne({_id: req.user.id});
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send("Removed");
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


/*
//11) creating endpoint to get cartdata After login we can see the previous thing that we added  
app.post('/getcart', fetchUser , async (req, res)=> {
  console.log("GetCart");
  let userData = await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
})
  */

//11) creating endpoint to get cartdata After login we can see the previous thing that we added  
app.post('/getcart', fetchUser, async (req, res) => {
  console.log("GetCart");
  try {
    let userData = await Users.findOne({_id: req.user.id});
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json(userData.cartData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
