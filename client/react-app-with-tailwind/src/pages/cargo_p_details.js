import React, { useContext, useEffect, useState } from "react"
import {useParams} from "react-router-dom"
import axios from "axios"
import { GetUserID } from "../hooks/useGetuserID"
import { Cart } from "../context/Context"
import { getProdId } from "../hooks/getProdID"
import { Getprodid2 } from "../hooks/getprodid2"
import { GetUserName } from "../hooks/getusername"


/*const ProductDetail = async () => {
    /const [products, setProducts] = useState([]);/
    //const {productId} = useParams();
    //const thisProduct = products.map(prod => prod.product_id === productId);

 /*
    useEffect(() => {
       const fetchProduct = async () => {
         try 
         {
              const response = await axios.get(`http://localhost:3001/product/${productId}`);
              console.log(response);
              setProducts(response.data);
         }
         catch (err)
         {
           console.error(err);
         }
       };
 
       fetchProduct();

    },  [productId]);

    

    return (
        <div>
            <h1>{thisProduct.product_name}</h1>
            <p>Price: ${thisProduct.price}</p>
            <p>{thisProduct.description}</p>
        </div>
    )
}*/

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ProductDetailCargo(props) {

  const userID = GetUserID();

  
  
  const [product, setProduct] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [ratedProducts, setRatedProducts] = useState([]);
  const [rating, setRating2] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
 





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


  const discountProduct = async (discount, prodid) => { 
    if(discount < 1)
    {alert("Give a discount rate bigger than 0")}
    else
    {
    try 
    {
         const response = await axios.post("http://localhost:3001/product/discount/prod", {      
         discount,
         prodid,
    });
         alert("Discount applied", response)

    }
    catch (err)
    {
      console.error(err);
    }
   }
  };

  const changePrice = async (price, prodid) => { 
    if(price < 1)
    {alert("Give a price bigger than 0")}
    else
    {
    try 
    {
         const response = await axios.put("http://localhost:3001/product/change_price/prod", {      
         price,
         prodid,
    });
         alert("Price Changed", response)

    }
    catch (err)
    {
      console.error(err);
    }
   }
  };

  const changeStock = async (stock, prodid) => { 
    if(stock == 0)
    {alert("Give a stock different than 0")}
    else
    {
    try 
    {
         const response = await axios.put("http://localhost:3001/product/change_stock/prod", {      
         stock,
         prodid,
    });
        alert("Stock changed")

    }
    catch (err)
    {
      console.error(err);
    }
   }
  };

  const discountReset = async (prodid2) => {
    console.log("here")
    try 
    {
         const response = await axios.put("http://localhost:3001/product/discount/reset", {prodid: prodid2});
         alert("Discount removed")

    }
    catch (err)
    {
      console.error(err);
    }
  };

  const handleDiscount = (event) => {
    const value = parseInt(event.target.value);
    setDiscount(value);
  };

  const handlePrice = (event) => {
    const value = parseInt(event.target.value);
    setPrice(value);
  };

  const handleStock = (event) => {
    const value = parseInt(event.target.value);
    setStock(value);
  };


  const deleteProd = async (prodid) => {
    try {
      const response = await axios.delete(`http://localhost:3001/product/delete/${prodid}`);
      console.log(response.data);
      alert("Deleted");
    } catch (error) {
      console.error(error);
    }
  };
  

  

  

  return (
    <div>
      {product ? (
        <div className="bg-white">
        <div className="pt-6">      
          {/* Image gallery */}
          <div className="border-green-500 mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-2 lg:px-2 lg:pb-12 lg:pt-16">
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
              src={product.imageUrl}
              alt={product.imageAlt}
              className="h-full w-full object-cover object-center"
            />
          </div> 
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-4">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl text-left">{product.product_name}</h1>
              <p className="mt-10 text-xl font-medium tracking-tight text-gray-600 sm:text-xl text-left">{product.category}</p>

              <div className="mt-12 py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pt-1">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>
  
                <div className="space-y-6">
                  <p className="text-2xl font-light text-gray-900 sm:text-lg text-left">Change Product Details</p>
                </div>
              </div>
            {product.discount_rate == 0 ? 
            (
                <form>
                <div className="mt-5 space-y-1">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                type="number"
                onChange={(event) => handleDiscount(event)}
                value={discount}
                className="block w-full px-4 py-2 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Discount Rate"
              />
            
             <button 
              type = "submit"
              className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
              onClick={() => discountProduct(discount, product._id)}
              >
                Apply Discount
             </button>
              </div>
              </form>
            )
            :
            (
                <div>
                <button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-semibold py-2 px-4 rounded opacity-50 cursor-not-allowed">
                    Already applied discount ( {product.discount_rate}% )
                </button>
                <form>
                <button 
                   className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                   type="submit"
                   onClick={() => discountReset(product._id)}
                   >
                    Reset Discount
                </button>
                </form>
                </div>
            )
            }
              <form>
                <div className="mt-5 space-y-1">
              <input
                type="number"
                onChange={(event) => handlePrice(event)}
                value={price}
                className="block w-full px-4 py-2 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="New Price"
              />
            
             <button 
              type = "submit"
              className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
              onClick={() => changePrice(price, product._id)}
              >
                Change Price
             </button>
              </div>
              </form>

             
             <button 
                onClick = {() => deleteProd(product._id)}
                className="mt-20 rounded-md bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
                  DELETE
             </button>
            
             </div>
             <div>
                <h3 className="sr-only">Color</h3>
  
                <div className="space-y-6">
                  <p className="mt-20text-base text-gray-900 text-left">{product.rating_result}</p>
                </div>
              </div>

              <div>
                <h3 className="sr-only">Color</h3>
  
                <div className="space-y-6">
                  <p className="text-base text-gray-900 text-left">{product.userOwner}</p>
                </div>
              </div>

              <div>
                <h3 className="sr-only">Color</h3>
  
                <div className="space-y-6">
                  <p className="text-base text-gray-900 text-left">Product's warranty lasts for 2 years.</p>
                </div>
              </div>
              <div className="">
                <h3 className="sr-only">Color</h3>
                {product.discount == true ? 
                (
                <div>
                    <h1 
                      style={{textDecoration: 'line-through'}}
                      className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl text-right"
                      >
                      {product.old_price} TL
                    </h1>
                  <div className="space-y-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl text-right">{product.price} TL</h1>
                  </div>
                </div>
                )
                :
                (
                   
                    <div className="space-y-6">
                      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl text-right">{product.price} TL</h1>
                    </div>
                
                )
                }
                
              </div>
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



export default ProductDetailCargo