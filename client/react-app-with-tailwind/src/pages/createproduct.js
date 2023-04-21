import axios from "axios";
import { useState } from "react";
import { GetUserID } from "../hooks/useGetuserID";
import { useNavigate } from "react-router-dom";


export const CreateProduct = () => {

    return ( 
        <div>
          <Createp/>
        </div>
        );
}


const Createp = () => {

    const userID = GetUserID();

    const [product, setProduct] = useState({
      product_id: "",
      product_name: "", 
      description: "", 
      category: "T-Shirt",
      price: 0, 
      color: "Red",
      imageUrl: "",
      x_small_size: 0,
      small_size: 0,
      medium_size: 0,
      large_size: 0,
      x_large_size: 0,
      xx_large_size: 0,
      warranty: 1, 
      userOwner: userID,
    });
    
    const navigate = useNavigate();

      const handleChange = (event) => {
         const {name, value} = event.target;
         setProduct({ ...product, [name]: value});
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try 
        {
             await axios.post("http://localhost:3001/product/save", product);
             alert("Product added!");
             navigate("/");
        }
        catch (error)
        {
            console.error(error);
        }
    };

    return ( 
        <div className="grid place-items-center bg-white px-16 py-50 sm:py-1 lg:px-8">    

        <div className="mt-1 grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-1">
        <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg mt-3 sm:max-w-md">

          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-md">
              
          <h1 className="text-4xl font-semibold leading-7 text-gray-900">Sell Product</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Fill the blanks completely before listing your product.
          </p>


          </div>


          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <label htmlFor="product_id" className="block text-sm font-medium leading-6 text-gray-900">
                Product ID
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    type="text"
                    name="product_id"
                    id="product_id"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Product ID"
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Give the ID of your product.</p>
              </div>
            </div>
          </div>

          

          
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <label htmlFor="product_name" className="block text-sm font-medium leading-6 text-gray-900">
                Product Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    type="text"
                    name="product_name"
                    id="product_name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="T-Shirt"
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Give the name of your product.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <textarea
                    type="text"
                    name="description"
                    id="description"
                    rows={3}
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    defaultValue={''}
                    placeholder="Very good tshirt"
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about the product.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                Price
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">TL</span>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Price"
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Price of the product that you want to sell</p>
              </div>
            </div>
          </div>
          
          <label htmlFor="price" className=" mt-10 block text-sm font-medium leading-6 text-gray-900">
                Stocks
              </label>

          <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">XS</span>
                  <input
                    htmlFor = "x_small_size"
                    type="number"
                    name="x_small_size"
                    id="x_small_size"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Stock"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">S</span>
                  <input
                    htmlFor = "small_size"
                    type="number"
                    name="small_size"
                    id="small_size"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Stock"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">M</span>
                  <input
                    htmlFor = "medium_size"
                    type="number"
                    name="medium_size"
                    id="medium_size"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Stock"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">L</span>
                  <input
                    htmlFor = "large_size"
                    type="number"
                    name="large_size"
                    id="large_size"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Stock"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">XL</span>
                  <input
                    htmlFor= "x_large_size"
                    type="number"
                    name="x_large_size"
                    id="x_large_size"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Stock"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
            <div className="sm:col-span-2">
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">XXL</span>
                  <input
                    htmlFor = "xx_large_size"
                    type="number"
                    name="xx_large_size"
                    id="xx_large_size"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Stock"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          

          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-1 sm:max-w-md">
          <div className="sm:col-span-2">
          <label for="category" class="block text-sm font-medium leading-7 text-gray-900">Category</label>
          <div class="mt-2">
            <select onChange={handleChange} id="category" name="category" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-7">
              <option>T-Shirt</option>
              <option>Sweatshirt</option>
              <option>Pants</option>
            </select>
           </div>
           <p className="mt-3 text-sm leading-6 text-gray-600">Choose one of the categories from above list.</p>
           </div>
          </div>

          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-1 sm:max-w-md">
          <div className="sm:col-span-2">
          <label for="color" class="block text-sm font-medium leading-7 text-gray-900">Color</label>
          <div class="mt-2">
            <select onChange={handleChange} id="color" name="color" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-7">
              <option>Red</option>
              <option>Green</option>
              <option>Yellow</option>
              <option>Black</option>
              <option>White</option>
              <option>Blue</option>
              <option>Pink</option>
              <option>Purple</option>
            </select>
           </div>
           <p className="mt-3 text-sm leading-6 text-gray-600">Choose one of the colors from above list.</p>
           </div>
          </div>
          
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-md">
              <label htmlFor="imageUrl" className="block text-sm font-medium leading-6 text-gray-900">
                Product's Image Url
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    type="text"
                    name="imageUrl"
                    id="imageUrl"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Image Url for Product's Image"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Please provide image for your product.</p>
            </div>
          </div>
      

      <div className="mt-6 flex items-center justify-center gap-x-6 sm:max-w-md">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add
        </button>
      </div>
    </form>
    </div>
    </div> 
    )
}