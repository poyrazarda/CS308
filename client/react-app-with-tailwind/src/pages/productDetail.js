import React, { useContext, useEffect, useState } from "react"
import {useParams} from "react-router-dom"
import axios from "axios"
import { GetUserID } from "../hooks/useGetuserID"
import { Cart } from "../context/Context"
import { getProdId } from "../hooks/getProdID"
import { Getprodid2 } from "../hooks/getprodid2"
import { GetUserName } from "../hooks/getusername"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ProductDetail(props) {

  const {state: {cart}, dispatch, } = useContext(Cart);
  const a = window.localStorage.getItem("prod_id")

  const userID = GetUserID();
  const [product, setProduct] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [ratedProducts, setRatedProducts] = useState([]);
  const [rating, setRating2] = useState(0);

  const handleRatingChange = (event) => {
    const value = parseInt(event.target.value);
    setRating2(value);
  };

  const { productId } = useParams();

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:3001/product/${productId}`);
      window.localStorage.setItem("prod_id", response.data._id);   
      window.localStorage.setItem("prod_real_id", response.data.product_id);  
      return response.data;

    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  useEffect(() => {
      const fetchProductData = async () => {
     
      const productData = await fetchProduct(productId);

      setProduct(productData);
    };


    const fetchSavedProduct = async () => {
     try
     {
         const response = await axios.get(`http://localhost:3001/product/savedProducts/ids/${userID}`);
         setSavedProducts(response.data.savedProducts);
     }
     catch (err)
     {
      console.error(err);
     }
    };


    const fetchRatedProduct = async () => {
      try
      {
          const response = await axios.get(`http://localhost:3001/product/ratedProducts/ids/${userID}`);
          setRatedProducts(response.data.ratedProducts);
      }
      catch (err)
      {
       console.error(err);
      }
     };
    fetchRatedProduct();
    fetchProductData();
    fetchSavedProduct();
  }, [productId]);

  const saveProduct = async (prodid) => {
    try 
    {
         const response = await axios.put("http://localhost:3001/product", 
         {
          prodid, 
          userID
        });
        setSavedProducts(response.data.savedProducts);
        
    }
    catch (err)
    {
      console.error(err);
    }
  };


  const pushUser = async (prodid) => {
    try 
    {
         const response = await axios.put("http://localhost:3001/product/wishlist_user", 
         {
          prodid, 
          userID
        });
        alert("Product Saved")
        refreshPage();
    }
    catch (err)
    {
      console.error(err);
    }
  };

  const refreshPage = () => {
    window.location.reload(true);
  }

  const rateProduct = async (rating2, prodid) => {
    try 
    {
         const response = await axios.put("http://localhost:3001/product/rate", {      
         prodid,
         userID,
         rating2
    });
        setRatedProducts(response.data.ratedProducts);
        alert("Product Rated")
    }
    catch (err)
    {
      console.error(err);
    }
  };

  console.log(ratedProducts)
  const isProductSaved = (id) => savedProducts?.includes(id);
  const isProductRated = (id) => ratedProducts?.includes(id);


  
  return (
    <div className="bg-gray-100">
      {product ? (
        <div className="container mx-auto flex flex-wrap py-6">
          {/* Product image */}

          <div className="md:w-1/2 md:p-5 py-5">
            <div className="flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.imageAlt}
                className="w-2/4 rounded-lg shadow-lg"
              />
            </div>
          </div>
          {/* Product details */}
          <div className="md:p-12 flex flex-col my-16 items-center">
            <div className="w-full">
              <h1 className="text-gray-700 font-bold text-2xl">{product.product_name}</h1>
              <p className="text-gray-700 mt-2">{product.category}</p>
              <p className="text-gray-700 mt-2">{product.description}</p>
            </div>
            <div className="flex items-center mb-6">
              <h3 className="text-lg font-bold mr-2">Rating:</h3>
              <p className="text-sm text-gray-900">{product.rating_result}</p>
            </div>
  
            {product.discount ? (
              <div className="flex items-center mb-6">
                <h1 className="text-xl font-bold mr-1 line-through">
                  {product.old_price} TL
                </h1>
                
                <h1 className="text-xl font-bold ml-2">{product.price} TL </h1>
                <h1 className="text-xl font-italic text-red-500 ml-4">-%{product.discount_rate}  </h1>
              </div>
            ) : (
              <div className="mb-6">
                <h1 className="text-xl font-bold">{product.price} TL</h1>
              </div>
            )}
  
            {!isProductSaved(product._id) && userID !== null ? (
              <button
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => {
                  saveProduct(product._id);
                  pushUser(product._id);
                }}
              >
                Add to Wishlist
              </button>
            ) : userID === null ? (
              <button className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full mb-4 opacity-50 cursor-not-allowed">
                Can't save without login
              </button>
            ) : (
              <button className="bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-full cursor-not-allowed mr-4 mt-4" disabled>
                Already saved
              </button>
            )}

            {cart.some((p) => p.product_id === product.product_id) ? (
              <button
                onClick={() => {
                  dispatch({
                    type: "REMOVE_FROM_CART",
                    payload: product,
                  });
                }}
                className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Remove From Cart
              </button>
            ) : product.stock <= 0 ? (
              <button className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full cursor-not-allowed opacity-50 mb-4 mt-2">
                No Stock
              </button>
            ) : product.stock === 1 ? (
              <div className="flex items-center mb-4">
                <p className="text-sm mr-2">Only 1 left!</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <button
                  onClick={() => {
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: product,
                    });
                  }}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  dispatch({
                    type: "ADD_TO_CART",
                    payload: product,
                  });
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Add to Cart
              </button>
            )}

          </div>

          <div className="container mx-auto flex py-6 flex-wrap justify-center">
            <div className="w-3/4 px-20 bg-white p-6 rounded-lg shadow-md mt-6 justify-center">
              <h1 className="text-lg font-bold mb-4">Comments</h1>
              <div className="overflow-y-auto max-h-60">
                {product.comments.map((com, index) => (
                  <div key={index} className="flex items-start mb-4">
                    <p className="font-bold text-gray-900">{com.user_name}</p>
                    <div>
                      <h3 className="text-lg font-semibold">{com.userName}</h3>
                      <p className="text-gray-700">: {com.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        
      ) : (
        <p>Wave is coming!</p>
      )}
    </div>
  );
  


}
  const CommentSection = () => {
  const prod_id = getProdId();
  const userID = GetUserID();
  const prod_id_real = Getprodid2();
  const username = GetUserName();
  const [comment2, setComment] = useState({
    comment: "",
    user: userID,
    prod_id: prod_id,
    product_id_real: prod_id_real,
    user_name: username,
  });

  const handleChange = (event) => {
    const {name, value} = event.target;
    setComment({ ...comment2, [name]: value});
  };

  }

export default ProductDetail