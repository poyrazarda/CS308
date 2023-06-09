import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    product_id: {type: String, required: true, unique: true},
    product_name: { type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    color: {type: String, required: true},
    imageUrl: {type: String, required: true},
    size: {type: String, required: true},
    stock: {type: Number, required:true},
    comments: [],
    ratings: 
    [    
          {
             type: Number
          } 
    ],
    rating_sum: {type:Number, default: 0},
    rating_result: {type:Number, default: 0},
    warranty: {type: Number, required: false},
    userOwner: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
    discount: {type: Boolean},
    discount_rate: {type: Number, default: 0},
    old_price: {type: Number, default: 0},
    wishlist_users: 
    [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "users", required: false 
        }
    ]
    
},{ timestamps: true });

export const ProductModel = mongoose.model("products", ProductSchema);