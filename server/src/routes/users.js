import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);

const router = express.Router()


router.post("/register", async (req, res) => {
     const { email, username, password } = req.body;
     const user = await UserModel.findOne({ username });
     const email1 = await UserModel.findOne({ email });
     if (email1) 
     {
        return res.json({message: "Email already exists!"});
     }
     if (user) 
     {
        return res.json({message: "Username already exists!"});
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     const newUser = new UserModel({email, username, password: hashedPassword});
     await newUser.save();

     res.json({message: "User registered successfully!"});
});

router.post("/paymentinfo", async (req, res) => {
   const {userID, city, address, cardNumber } = req.body;
  
   const user = await UserModel.findById({ _id: userID });
   /*const emailData = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Order status",
      html: `
        <h1>Hi ${user.username}, Your order's status is: Accepted/Processing</span></h1>
       
        <p>Visit <a href="${process.env.CLIENT_URL}/order_history">your order historyd</a> for more details</p>
      `,
    };

    try {
      await sgMail.send(emailData);

    } catch (err) {
      console.log(err);
    }*/
   if (!user)  
   {
       return res.json({message: "User does not exist!"});     
   }
   const hashednumber = await bcrypt.hash(cardNumber, 10);
   

   user.address = address;
   user.city = city;
   user.cardNumber = hashednumber;
   user.save();
   console.log("User payment Info")
   res.json({message: "User infos saved!"});
});

router.get("/get_user/:userid", async (req, res) => {
  const { userid } = req.params;
  try {
    const user = await UserModel.findOne({ _id: mongoose.Types.ObjectId(userid) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/getpdf/:userID", async (req, res) => {
   const {userID} = req.params;
   try 
   {
        const response = await UserModel.findOne({_id: req.params.userID})
        res.json(response);
       

    } 
    catch (err) 
    {
      res.json(err);
    }
});


router.post("/login", async (req, res) => {
     
    const {username, password} = req.body;
    const user = await UserModel.findOne({ username });
    if (!user)  
    {
        return res.json({message: "User does not exist!"});
       
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) 
    {
       return res.json({message: "Username or Password is Incorrect!"})
    }
    
    const token = jwt.sign({id: user._id}, "secret");
    const user1 = username;
    res.json({token, user1, userID: user._id});
});


router.get("/mail/:userid", async (req, res) => {
   try {
     const response = await UserModel.findById(req.params.userid);

     const lastOrder = response.ordered[response.ordered.length - 1];


     // Extract the product names from the last order
     const productDetails = lastOrder.order.map(orderItem => ({
      name: orderItem.product_name,
      price: orderItem.price
    }));

    // Generate the product details HTML string
    const productDetailsHTML = productDetails.map(
      product => `<p>${product.name}: ${product.price}$</p>`
    ).join("");

    // Send the email
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: response.email,
      subject: "Order status",
      html: `
        <h1>Hi ${response.username}, Your order status is: ${lastOrder.status}</span></h1>
        <p>Your order delivery address: ${response.address}</span></p>
        <p>Total cost of  your order: ${lastOrder.total}$, Here is your oder list:</span></p>
        ${productDetailsHTML}
        <p>Visit <a href="${process.env.CLIENT_URL}/order_history">your order history</a> for more details</p>
      `,
    };

 
     try {
       await sgMail.send(emailData);
       console.log("Email sent successfully");
       //console.log(response);
       res.json(response);

     } catch (err) {
       console.log(err);
       res.status(500).json({ error: "Failed to send email" });
     }
     
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: "Internal server error" });
   }
 });


router.get("/order_history/:userid", async (req, res) => {
   try {
     const response = await UserModel.findById(req.params.userid);

     res.json(response)
     
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: "Internal server error" });
   }
 });
 

 router.get("get_user/:userid", async (req, res) => { 
  const {userid} = req.params;
  console.log(iamhere)
  try 
  {
       console.log(product_id);
       const response = await UserModel.findOne({_id: userid })
       //console.log(response)
       if(!response){
        res.sendStatus(404);
               }
       res.json(response);        
  }
  catch (err) 
  {
       res.json(err);
  }
});

 export { router as userRouter };
 


 /*order[order.length-1].order.forEach((o)=> {
          `
         <h1>Product Name: ${o.product_name},  Price:  ${o.price}$</span></h1>
       `
       }) */ 