import express from 'express';
import mongoose from 'mongoose';
import { ProductModel } from "../models/Product.js";
import { UserModel } from '../models/Users.js';
import { CommentModel } from '../models/Comment.js';
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);



router.get("/find", async (req, res) => { 
    try 
    {
         const response = await ProductModel.find({}); 
         res.json(response);        
    }
    catch (err) 
    {
         res.json(err);
    }
});

router.get("/:product_id", async (req, res) => { 
    const {product_id} = req.params;
    try 
    {
         console.log("product_id");
         const response = await ProductModel.findOne({product_id: product_id })
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

router.post("/save", async (req, res) => {
    const product = new ProductModel(req.body);
        try 
        {
             const response = await product.save();
             res.json(response);
        }
        catch (err) 
        {
             res.json(err);
        }   
});


router.post("/discount/prod", async (req, res) => {
  console.log("here")
   try
   {
    const product = await ProductModel.findById(req.body.prodid);
    product.discount = true;
    product.discount_rate = req.body.discount;
    product.old_price = product.price;
    product.price = product.price * (1 - (req.body.discount / 100));
    await product.save();
    
    try {
      for(let i = 0; i < product.wishlist_users.length; i++)
      {
      const user = await UserModel.findById(product.wishlist_users[i]);
      console.log(user.email)

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Discount!!!",
        html: `
          <h1>Hi ${user.username}, </span></h1>
          <p>Product: ${product.product_name} that you added to your wishlist has ${product.discount_rate} discount right now!!!</span></p>
        `,
        
      };

      await sgMail.send(emailData);
      console.log("Email sent successfully");
      //console.log(response);
      res.json(user);
      }

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to send email" });
    }
   }
   catch (err)
   {
    res.json(err);

   }
})

router.put("/discount/reset", async (req, res) => {
  console.log("here")
   try
   {
    
    const product = await ProductModel.findById(req.body.prodid);
    product.discount = false;
    product.price = product.old_price;
    product.old_price = 0;
    product.discount_rate = 0;
    await product.save();
    res.json(product);
   }
   catch (err)
   {
    res.json(err);

   }
})

router.put("/change_price/prod", async (req, res) => {
  console.log("here")
   try
   {
    
    const product = await ProductModel.findById(req.body.prodid);
    product.price = req.body.price;
    await product.save();
    res.json(product);
   }
   catch (err)
   {
    res.json(err);
   }
});

router.put("/change_stock/prod", async (req, res) => {
  console.log("heredasdasda")
   try
   {
    
    const product = await ProductModel.findById(req.body.prodid);
    product.stock = product.stock + req.body.stock;
    console.log(req.body.stock)
    await product.save();
    res.json(product);
   }
   catch (err)
   {
    res.json(err);
   }
})


router.put("/", async (req, res) => {
     const product = await ProductModel.findById(req.body.prodid);
     const user = await UserModel.findById(req.body.userID);
    try 
    {
      user.savedProducts.push(product); 
      await user.save();
      res.json({ savedProducts: user.savedProducts });
    } 
    catch (err) 
    {
      res.json(err);
    }
  });

  router.delete('/delete/:id', (req, res) => {
    console.log("iamhere");
    const productId = req.params.id;
  
    ProductModel.findOneAndDelete({ _id: productId })
      .then((deletedProd) => {
        if (deletedProd) {
          res.status(200).json({
            message: 'Product deleted successfully.',
            deletedProd: deletedProd
          });
        } else {
          res.status(404).json({
            message: 'Product not found.'
          });
        }
      })
      .catch((error) => {
        console.error('Error occurred while deleting Product:', error);
        res.status(500).json({
          message: 'Internal server error.'
        });
      });
  });
  

  router.put("/wishlist_user", async (req, res) => {
    const product = await ProductModel.findById(req.body.prodid);
   try 
   {
     product.wishlist_users.push(req.body.userID); 
     await product.save();
     res.json({ wishlist_users: user.wishlist_users });
   } 
   catch (err) 
   {
     res.json(err);
   }
 });

  router.put("/rate", async (req, res) => {
   
    try 
    {
     const product = await ProductModel.findById(req.body.prodid);
     const user = await UserModel.findById(req.body.userID);
     const rating = await req.body.rating2;
      user.ratedProducts.push(product);
      await user.save();
      product.ratings.push(rating);
      await product.save();
      console.log("come", product.ratings.length)
     
     if(product.ratings.length == 1)
     {
       product.rating_sum = rating;
       await product.save();
     }
     else
     {
      console.log("old", product.rating_sum) 
      product.rating_sum += rating;
      console.log("new", product.rating_sum)
      await product.save();
      console.log(product.rating_sum)
      console.log(product.ratings.length)
     }
 
     if(product.ratings.length >= 1)
     {
       console.log("hello")   
       product.rating_result = product.rating_sum / product.ratings.length;
       await product.save();
     }
 
     res.json({ ratedProducts: user.ratedProducts });
    } 
    catch (err) 
    {
      res.json(err);
    }
  });


 router.get("/get_result/:prodid", async (req, res) => {
    try 
    {
       const product = await ProductModel.findById({_id: req.params.prodid})
       console.log("getresult prod_id")
       res.json(product);
    }
    catch (err)
    {
        res.json(err);
    }
 });


router.get("/savedProducts/ids/:userID", async (req, res) => {
    try 
    {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedProducts: user?.savedProducts });
    }
    catch (err)
    {
      res.json(err);
    }
});

router.get("/ratedProducts/ids/:userID", async (req, res) => {
  try 
  {
      const user = await UserModel.findById(req.params.userID);
      res.json({ ratedProducts: user?.ratedProducts });
  }
  catch (err)
  {
    res.json(err);
  }
});

router.get("/savedProducts/:userID", async (req, res) => {
    try 
    {
        const user = await UserModel.findById(req.params.userID);
        const savedProducts = await ProductModel.find({
            _id: { $in: user.savedProducts },
        });

        res.json({ savedProducts });
    }
    catch (err)
    {
      res.json(err);
    }
});

router.get("/ratedProducts/:userID", async (req, res) => {
  try 
  {

      const user = await UserModel.findById(req.params.userID);
      const ratedProducts = await ProductModel.find({
          _id: { $in: user.ratedProducts },
      });
      console.log("ratedproducts")
      res.json({ ratedProducts });
                                                                                                           
  }
  catch (err)
  {
    res.json(err);
  }
});



export {router as productRouter};