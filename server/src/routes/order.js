import { OrderModel } from '../models/Order.js';
import express from 'express';
import { ProductModel } from '../models/Product.js'
import { UserModel } from '../models/Users.js';
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);




router.post("/save_order", async (req, res) => {
  const order = new OrderModel(req.body);
  let a = []
  a = req.body.order;
  order.total = req.body.total;
  order.delivery_address = req.body.delivery_address;
  order.date1 = (Date(order.createdAt))
  console.log(order.date1)
  //order.date1 = new Date(order.createdAt).getTime();

  await order.save();
      try 
      {
        console.log("aa")
           for (let i = 0; i < a.length; i++) {
             const product = await ProductModel.findById(a[i]._id)
             console.log("aa")
             product.stock--;
             product.save();
           }
           const user = await UserModel.findById(req.body.userID)
           console.log("aa2")
           user.ordered.push(order);
           user.save();
           const response = await order.save();
           console.log(response)
           res.json(response);
      }
        
      catch (err) 
      {
           res.json(err);
      }   
});


router.get("/find", async(req, res) => {
     try 
     {
         const response = await OrderModel.find();
         res.json(response);
     }
     catch (err)
     {
         res.json(err);
     }

});

router.put("/waitingrefund/:order_id/:userid", async(req, res) => {
  const { order_id, userid } = req.params;
  try 
  {
      const response = await OrderModel.findById({_id: order_id});      
      const user = await UserModel.findById({_id: userid});

      const refundablePeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      console.log(refundablePeriod)
      const currentTime = new Date().getTime();
      console.log(currentTime)
      const orderCreationTime = response.date1;
      console.log(orderCreationTime)
      const elapsedTime = currentTime - orderCreationTime;
      console.log(elapsedTime)
      if (elapsedTime > refundablePeriod) {


          return res.status(400).json({ error: "Refund period has expired" });
      }

      response.status = "Waiting For Refund";
      await response.save();

      for (let i = 0; i < user.ordered.length; i++) {
        console.log(user.ordered[i]._id)

         if ((user.ordered[i]._id).equals(response._id)) {
           console.log("Old status:", user.ordered[i].status);
           console.log("Order ID:", user.ordered[i]._id);
           console.log("Total value:", user.ordered[i].total);
           console.log("Order ID from params:", order_id);
           user.ordered[i].status = "Waiting For Refund";
           user.save();
           console.log("New status:", user.ordered[i].status);
           console.log("Status changed");
         }
     }

     await user.save();
     console.log("Order refunded successfully");

     res.json(response);
  }
  catch (err)
  {
      res.json(err);
  }
});


router.put("/waitingcancel/:order_id/:userid", async(req, res) => {
  const { order_id, userid } = req.params;
  try 
  {
      const response = await OrderModel.findById({_id: order_id});      
      const user = await UserModel.findById({_id: userid});

      response.status = "Waiting For Cancel";
      await response.save();

      for (let i = 0; i < user.ordered.length; i++) {
        console.log(user.ordered[i]._id)

         if ((user.ordered[i]._id).equals(response._id)) {
           console.log("Old status:", user.ordered[i].status);
           console.log("Order ID:", user.ordered[i]._id);
           console.log("Total value:", user.ordered[i].total);
           console.log("Order ID from params:", order_id);
           user.ordered[i].status = "Waiting For Cancel";
           user.save();
           console.log("New status:", user.ordered[i].status);
           console.log("Status changed");
         }
     }

     await user.save();
     console.log("Order canceled successfully");

     res.json(response);
  }
  catch (err)
  {
      res.json(err);
  }
});


router.put("/cancel/:order_id/:userid", async(req, res) => {
  const { order_id, userid } = req.params;
  try 
  {
      const response = await OrderModel.findById({_id: order_id});      
      const user = await UserModel.findById({_id: userid});
      let a = []
      a = response.order;
      response.status = "Canceled";
      console.log(a.length)
      for (let i = 0; i < a.length; i++) {
        
        const product = await ProductModel.findById(a[i]._id)
        console.log("aa")
        product.stock++;
        product.save();
      }
      await response.save();

      for (let i = 0; i < user.ordered.length; i++) {
        console.log(user.ordered[i]._id)

         if ((user.ordered[i]._id).equals(response._id)) {
           console.log("Old status:", user.ordered[i].status);
           console.log("Order ID:", user.ordered[i]._id);
           console.log("Total value:", user.ordered[i].total);
           console.log("Order ID from params:", order_id);
           user.ordered[i].status = "Canceled";
           user.save();
           console.log("New status:", user.ordered[i].status);
           console.log("Status changed");
         }
     }

     await user.save();
     console.log("Order refunded successfully");

     res.json(response);
  }
  catch (err)
  {
      res.json(err);
  }
});
 
 
 


router.put("/refund/:order_id/:userid", async(req, res) => {
  const { order_id, userid } = req.params;
  try 
  {
      const response = await OrderModel.findById({_id: order_id});      
      const user = await UserModel.findById({_id: userid});
      let a = []
      a = response.order;
      const refundablePeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      const currentTime = new Date().getTime();
      const orderCreationTime = response.date1;
      const elapsedTime = currentTime - orderCreationTime;
      if (elapsedTime > refundablePeriod) {
        for (let i = 0; i < user.ordered.length; i++) {
          console.log(user.ordered[i]._id)
          console.log(response._id)
           if ((user.ordered[i]._id).equals(response._id)) {
             console.log("Old status:", user.ordered[i].status);
             console.log("Order ID:", user.ordered[i]._id);
             console.log("Total value:", user.ordered[i].total);
             console.log("Order ID from params:", order_id);
             user.ordered[i].status = "Delivered 30+ days ago";
             user.save();
             console.log("New status:", user.ordered[i].status);
             console.log("Status changed");
           }
       }
          return res.status(400).json({ error: "Refund period has expired" });
      }

      response.status = "Refunded";
      console.log(a.length)
      for (let i = 0; i < a.length; i++) {
        
        const product = await ProductModel.findById(a[i]._id)
        console.log("aa")
        product.stock++;
        product.save();
      }
      response.total = 0;
      await response.save();

      for (let i = 0; i < user.ordered.length; i++) {
        console.log(user.ordered[i]._id)

         if ((user.ordered[i]._id).equals(response._id)) {
           console.log("Old status:", user.ordered[i].status);
           console.log("Order ID:", user.ordered[i]._id);
           console.log("Total value:", user.ordered[i].total);
           console.log("Order ID from params:", order_id);
           user.ordered[i].status = "Refunded";
           user.save();
           console.log("New status:", user.ordered[i].status);
           console.log("Status changed");
         }
     }


     await user.save();
     console.log("Order refunded successfully");

     try {
      
      {
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Refund",
        html: `
          <h1>Hi ${user.username}, </span></h1>
          <p>Order (${response._id}) Refunded.</span></p>
        `,
      };

      await sgMail.send(emailData);
      console.log("Email sent successfully");
      //console.log(response);
      }

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to send email" });
    }

     res.json(response);
  }
  catch (err)
  {
      res.json(err);
  }
});
 
 
 


router.put("/in_transit/:order_id/:userid", async(req, res) => {
  const { order_id, userid } = req.params;
  try 
  {
      const response = await OrderModel.findById({_id: order_id});      
      const user = await UserModel.findById({_id: userid});
      response.status = "In-Transit";
      await response.save();
      console.log("hi")
      console.log(response._id)
      for (let i = 0; i < user.ordered.length; i++) {
        console.log(user.ordered[i]._id)
        console.log(response._id)
         if ((user.ordered[i]._id).equals(response._id)) {
           console.log("Old status:", user.ordered[i].status);
           console.log("Order ID:", user.ordered[i]._id);
           console.log("Total value:", user.ordered[i].total);
           console.log("Order ID from params:", order_id);
           user.ordered[i].status = "In-Transit";
           user.save();
           console.log("New status:", user.ordered[i].status);
           console.log("Status changed");
         }
     }

     await user.save();
     console.log("User saved successfully");

     

     res.json(response);
  }
  catch (err)
  {
      res.json(err);
  }
});
 
 
 
router.put("/deliver/:order_id/:userid", async(req, res) => {
  const { order_id, userid } = req.params;
  try 
  {
      console.log(order_id);
      console.log(userid);
      const response = await OrderModel.findById({_id: order_id});  
      const user = await UserModel.findById({_id: userid});
      response.status = "Delivered";
      await response.save();
      console.log("hi")
      console.log(response.userID)
      console.log(order_id)
      console.log(response._id)
      for (let i = 0; i < user.ordered.length; i++) {
         if ((user.ordered[i]._id).equals(response._id)) {
          
           console.log("Old status:", user.ordered[i].status);
           console.log("Order ID:", user.ordered[i]._id);
           console.log("Total value:", user.ordered[i].total);
           console.log("Order ID from params:", order_id);
           user.ordered[i].status = "Delivered";
           await user.save();
           console.log("New status:", user.ordered[i].status);
           console.log("Status changed");
         }
     }

     await user.save();
     console.log("User saved successfully");

     try {
      
      {
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Delivered",
        html: `
          <h1>Hi ${user.username}, </span></h1>
          <p>Order (${response._id}) status: Delivered.</span></p>
        `,
      };

      await sgMail.send(emailData);
      console.log("Email sent successfully");
      //console.log(response);
      }

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to send email" });
    }

     res.json(response);
  }
  catch (err)
  {
      res.json(err);
  }
});


router.get('/orders', (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
  // Perform the filtering logic using the startDate and endDate values
  OrderModel.find({
    date1: {
      $gte: new Date(startDate),
      $lt: adjustedEndDate,
    },
  })
    .then((filteredOrders) => {
      res.json(filteredOrders);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while filtering orders.' });
    });
});

export {router as OrderRouter};