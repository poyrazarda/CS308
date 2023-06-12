import { useEffect, useState } from "react";
import { GetUserID } from "../hooks/useGetuserID";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import React from 'react';
import { getProdId } from "../hooks/getProdID";
import { GetUserName } from "../hooks/getusername";
import jsPDF from "jspdf";


const deleteUser = async (userId) => {
  return await axios.delete(`http://localhost:3001/comment/${userId}`)
    .then((response) => {
      //console.log(response.data);
      alert("Deleted")
    })
    .catch((error) => {
      console.error(error);
    });
};

const sendEmail = async (userID) => {
  try 
  {
      const response = await axios.get(`http://localhost:3001/auth/mail/${userID}`);
  }
  catch (err)
  {
      console.error(err);
  }
};


export const OrderHistory = () => {

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedComment, setSelectedComment] = useState('');
  const [prodReal, setprodReal] = useState(null);
  const [ratedProducts, setRatedProducts] = useState([]);

   const userID = GetUserID();



  const handleOpenDropdown = (orderId, productId) => {
    window.localStorage.setItem("prod_id", productId);    
    setSelectedOrderId(orderId === selectedOrderId ? null : orderId);
    setSelectedProductId(productId);
    setSelectedRating(0);
    setSelectedComment('');
  };

  const username = GetUserName();

  const prod_id = getProdId();

  const [comment2, setComment] = useState({
    comment: "",
    user: userID,
    prod_id: prod_id,
    user_name: username,
  });

  const handleRatingChange = (e) => {
    setSelectedRating(parseInt(e.target.value));
  };

  const handleCommentChange = (event) => {
    const {name, value} = event.target;
    setComment({ ...comment2, [name]: value});
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try 
    {
         await axios.post("http://localhost:3001/comment/save_comment", comment2);
         alert("Your comment sent to admin.");
         refreshPage();
    }
    catch (error)
    {
        console.error(error);
    }
   };

   /* asdsasa */

    const [order, setOrder] = useState([])
    const [date1, setDate1] = useState(null);
  /*const handleRatingChange = (event) => {
    const value = parseInt(event.target.value);
    setRating2(value);
  };*/



  

    useEffect(() => {


        const fetchData = async (userId) => {
            try 
            {
                const response = await axios.get(`http://localhost:3001/auth/order_history/${userId}`);
                setOrder(order => [...response.data.ordered]);

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
         fetchData(userID);
    }, [userID])

    //console.log(order)
     
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
        refreshPage();
    }
    catch (err)
    {
      console.error(err);
    }
  };

  const isProductRated = (id) => ratedProducts?.includes(id);


    const refreshPage = () => {
      window.location.reload(true);
    }
    const refund = async (prodid, userid) => {
            return await axios.put(`http://localhost:3001/order/waitingrefund/${prodid}/${userid}`)
            .then((response) => {
              //console.log(response.data);
              //alert("Refund request sended")
              sendEmail(userid)
              refreshPage();
            })
            .catch((error) => {
              console.error(error);
            });

    }

    const Cancel = async (prodid, userid) => {
      return await axios.put(`http://localhost:3001/order/waitingcancel/${prodid}/${userid}`)
      .then((response) => {
        //console.log(response.data);
        //alert("Refund request sended")
        sendEmail(userid)
        refreshPage();
      })
      .catch((error) => {
        console.error(error);
      });

}
    //console.log(order)

    const currentDate = new Date();

    return (
      <div className="bg-white">
      <div className="py-12 px-10">
  <div className="container mx-auto">
    <div className="py-4">
      <ul role="list" className="divide-y divide-gray-100">
        {order.map((o) => (
          <li key={o._id} className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-lg leading-6 text-gray-600">Order ID: {o._id}</p>
              <button onClick={() => downloadPDF(o.delivery_address, o.userID, o)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </button>
              
              <p className="text-sm text-gray-500">{o.status}</p>
              <p className="text-sm leading-6 text-gray-900">Address: {o.delivery_address}</p>
              
              <div>
                {o.status === "Delivered" && ((Math.floor(currentDate.getTime() - new Date(o.date1).getTime()) / (1000 * 3600 * 24)) >= 30) ? (
                  <button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-semibold py-2 px-4 rounded opacity-50 cursor-not-allowed">
                   Can't refund (+30 days)
                  </button>) : (o.status === "Delivered" && ((Math.floor(currentDate.getTime() - new Date(o.date1).getTime()) / (1000 * 3600 * 24)) < 30)) ? (
                  <button
                    onClick={() => refund(o._id, o.userID)}
                    className="bg-gray-800 rounded-md text-white font-semibold px-4 py-2 hover:bg-button-blue focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  >
                    Refund
                  </button>
                ) : o.status === "Refunded" ? (
                  <button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-semibold py-2 px-4 rounded opacity-50 cursor-not-allowed">
                    Already Refunded
                  </button>
                ) : o.status === "Waiting For Refund" ? (
                  <button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-semibold py-2 px-4 rounded opacity-50 cursor-not-allowed">
                    Waiting For Refund
                  </button>
                ) : o.status === "Waiting For Cancel" ? (
                  <button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-semibold py-2 px-4 rounded opacity-50 cursor-not-allowed">
                    Waiting For Cancel
                  </button>
                ) : o.status === "Canceled" ? (
                  <button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-semibold py-2 px-4 rounded opacity-50 cursor-not-allowed">
                    Already Cancelled
                  </button>
                )  : o.status === "Delivered 30+ days ago" ? (
                  null
                ): (
                  <button
                    onClick={() => Cancel(o._id, o.userID)}
                    className="bg-gray-800 rounded-md text-white font-semibold px-4 py-2 hover:bg-button-blue focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  >
                    Cancel the order
                  </button>
                )}
              </div>
            </div>
            <div>
              {o.status === "Delivered" ? (
                <div className="mt-4">
                  {o.order.map((o_list) => (
                    <div key={o_list._id} className="relative">
                      <div
                        className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
                        onClick={() => handleOpenDropdown(o._id, o_list._id)}
                      >
                        <div>
                          <p className="text-md font-medium text-gray-900">{o_list.product_name}</p>
                        </div>
                        {selectedOrderId === o._id && selectedProductId === o_list._id ? (
                          <svg
                            className="h-5 w-5 fill-current text-gray-500 transform rotate-180"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 14l6-6H4l6 6z" />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 fill-current text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 14l6-6H4l6 6z" />
                          </svg>
                        )}
                      </div>
                      {selectedOrderId === o._id && selectedProductId === o_list._id && o.status === "Delivered" && (
                       <div className="bg-gray-100">
                       <div className="container mx-auto p-4">
                         <div className="flex justify-between gap-x-6 py-5">
                           <div className="flex gap-x-4">
                             <img className="h-17 w-16 flex-none bg-gray-50" src={o_list.imageUrl} alt="" />
                             <div className="min-w-0 flex-auto">
                               <p className="text-sm font-semibold leading-6 text-gray-900">{o_list.product_name}</p>
                               <p className="mt-1 truncate text-xs leading-5 text-gray-500">{o_list.description}</p>
                             </div>
                           </div>
                           <div className="hidden sm:flex sm:flex-col sm:items-end">
                             <p className="text-sm leading-6 text-gray-900">{o_list.price} TL</p>
                             
                           </div>

                           <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                           {!isProductRated(o_list._id) && userID !== null ? (
  <div className="flex flex-col items-center gap-2">
    {[...Array(selectedRating)].map((_, index) => (
      <svg
        key={index}
        className="h-5 w-5 fill-current text-yellow-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M19.968,7.52a.872.872,0,0,0-.672-.595L13.445,5.729,10.87.712a.863.863,0,0,0-1.592,0L6.555,5.729.7,6.926A.862.862,0,0,0,.2,8.764l4.8,4.665L4.236,18.56a.864.864,0,0,0,1.265.912L10,15.479l4.5,2.993a.863.863,0,0,0,1.265-.912l-.965-5.968,4.8-4.665A.866.866,0,0,0,19.968,7.52Z" />
      </svg>
    ))}
    <div className="flex flex-col items-center mt-2">
      <select
        className="p-2 border border-gray-300 rounded p-1 text-sm text-gray-600 bg-white"
        value={selectedRating}
        onChange={handleRatingChange}
      >
        <option value={0}>Select rating</option>
        <option value={1}>1 star</option>
        <option value={2}>2 stars</option>
        <option value={3}>3 stars</option>
        <option value={4}>4 stars</option>
        <option value={5}>5 stars</option>
      </select>
      <button
        className="bg-dark-blue hover:bg-button-blue text-white text-sm font-semibold py-2 px-4 rounded mt-2"
        onClick={() => rateProduct(selectedRating, o_list._id)}
      >
        Rate
      </button>
    </div>
  </div>
): (
    <button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-semibold py-2 px-4 rounded opacity-50 cursor-not-allowed">
      Already Rated
    </button>
  )}

                              

                               <div className="flex flex-col items-center mt-2">
                                  <textarea
                                    className="p-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your comment"
                                    name="comment"
                                    id="comment"
                                    rows={3}
                                    onChange={handleCommentChange}
                                  />
                                  <div className="flex items-center mt-2">
                                    <button
                                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      onClick={handleCommentSubmit}
                                    >
                                      Send Comment
                                    </button>
                                  </div>
                                </div>


                           </div>
                         </div>
                       </div>
                     </div>
                     
                                       
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="mt-4">
                    {o.order.map((o_list) => (
                      <div key={o_list._id} className="relative">
                        <div
                          className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
                          onClick={() => handleOpenDropdown(o._id, o_list._id)}
                        >
                          <div>
                            <p className="text-md font-medium text-gray-900">{o_list.product_name}</p>
                          </div>
                          {selectedOrderId === o._id && selectedProductId === o_list._id ? (
                            <svg
                              className="h-5 w-5 fill-current text-gray-500 transform rotate-180"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 14l6-6H4l6 6z" />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5 fill-current text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 14l6-6H4l6 6z" />
                            </svg>
                          )}
                        </div>
                        {selectedOrderId === o._id && selectedProductId === o_list._id && (
                          <li className="flex justify-between gap-x-6 py-5">
                            <div className="flex gap-x-4">
                              <img
                                className="h-12 w-10 flex-none rounded-full bg-gray-50"
                                src={o_list.imageUrl}
                                alt=""
                              />
                              <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">{o_list.product_name}</p>
                                
                              </div>
                            </div>
                            <div>
                              <p className="text-sm leading-5 font-medium text-gray-900">{o_list.price}</p>
                            </div>
                          </li>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
</div>
    );
}
//{((Math.floor(currentDate.getTime() - new Date(o.date1).getTime()) / (1000 * 3600 * 24)) >= 30) ? (<p>YES</p>):(<p>NO</p>)}
export function downloadPDF(address, userid, order2) {
  // Create a new jsPDF instance
  const doc = new jsPDF();
  
  // Set the font and styles
  doc.setFont('New York Times Roman', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(51, 102, 204);
  
  // Add the invoice title
  doc.text(`Invoice`, 10, 20);
  
  // Set the font for the user details
  doc.setFont('New York Times Roman', 'normal');
  doc.setFontSize(14);
  
  // Add the user details
  doc.setTextColor(0, 0, 0);
  
  doc.text(`Customer Name: ${userid}`, 10, 35);
  doc.text(`Address: ${address}`, 10, 55);
  
  // Set the font and styles for the order details
  doc.setFont('New York Times Roman', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(51, 51, 51);
  
  // Calculate the initial y-position for the order items
  let yPos = 80;

  console.log(order2.total)
  
  // Iterate over the order items and add them to the PDF
  order2.order.forEach((o, index) => {
    console.log(o.total)

    const productName = o.product_name;
    const price = o.price;
    doc.setFont('New York Times Roman', 'bold');
    doc.text(`Product ${index + 1}:`, 10, yPos);
    doc.setFont('New York Times Roman', 'normal');
    doc.text(productName, 40, yPos);
    doc.text(`${price}$`, 150, yPos);
    
    yPos += 15;
  });
  
  // Set the font and styles for the total amount
  doc.setFont('New York Times Roman', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(51, 102, 204);
  
  // Calculate the total amount
  
  // Add the total amount
  doc.text(`Total Amount: ${order2.total}$`, 10, yPos + 20);
  doc.text("Wave Shopping hope to see you again!", 60, yPos + 30)
  
  // Save the PDF
  doc.save('invoice.pdf');
}