import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { GetUserID } from '../hooks/useGetuserID';
import jsPDF from 'jspdf';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


export const Adminpage = () => {

  const userID = GetUserID();
  
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [product, setProduct] = useState("");
  const [order, setOrder] = useState([])
  const [cate, setCategory] = useState({
    category: "",
  });

  const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
      try 
      {
           const response = await axios.get("http://localhost:3001/category/find");
           setCategories(response.data);
           
      }
      catch (err)
      {
        console.error(err);
      }
    };

   



      const [startDate, setStartDate] = useState('');
      const [endDate, setEndDate] = useState('');
      const [filteredOrders, setFilteredOrders] = useState([]);
    
      const handleFilter = () => {
        axios.get('http://localhost:3001/order/orders', {
          params: {
            startDate,
            endDate,
          },
        })
          .then((response) => {
            setFilteredOrders(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      const fetchOrders = async () => {
        try
        {
           const response = await axios.get("http://localhost:3001/order/find");
           setOrder(response.data);
           setFilteredOrders(response.data);
        }
        catch (err)
        {
          console.error(err);
        }
      };

  
  useEffect(() => {
    const fetchComments = async () => {
      try 
      {
           const response = await axios.get("http://localhost:3001/comment/find");
           setComments(response.data);
           setUsername(response.data.user_name);
           setProduct(response.data.product_id_real);
      }
      catch (err)
      {
        console.error(err);
      }
    };

    fetchOrders();
    fetchComments();
    fetchCategories();
 }, []);


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


  const handleSubmitPost = async (comment) => {
    try 
    {
         await axios.post("http://localhost:3001/comment/post_comment", comment);
         alert("your comment sent to product");
         return await axios.delete(`http://localhost:3001/comment/${comment._id}`)
      .then((response) => {
        console.log(response.data);
        refreshPage();
      })
      .catch((error) => {
        console.error(error);
      });
    }
    catch (err)
    {
      console.error(err);
    }
  };


const deleteUser = async (userId) => {
  return await axios.delete(`http://localhost:3001/comment/${userId}`)
    .then((response) => {
      //console.log(response.data);
      alert("Deleted")
      refreshPage();
    })
    .catch((error) => {
      console.error(error);
    });
};


const deleteCategory = async (category) => {
  return await axios.delete(`http://localhost:3001/category/${category}`)
    .then((response) => {
      //console.log(response.data);
      alert("Deleted")
      refreshPage();
    })
    .catch((error) => {
      console.error(error);
    });
};



const statusChange =  async (prodid, userid) => {


  return await axios.put(`http://localhost:3001/order/in_transit/${prodid}/${userid}`)
  .then((response) => {
    //console.log(response.data);
    refreshPage();
  })
  .catch((error) => {
    console.error(error);
  });
}

const Refund =  async (prodid, userid) => {


  return await axios.put(`http://localhost:3001/order/refund/${prodid}/${userid}`)
  .then((response) => {
    //console.log(response.data);
    sendEmail(userid)
    refreshPage();
  })
  .catch((error) => {
    console.error(error);
  });
  
}

const refreshPage = () => {
  window.location.reload(true);
}

 
const Cancel =  async (prodid, userid) => {


  return await axios.put(`http://localhost:3001/order/cancel/${prodid}/${userid}`)
  .then((response) => {
    //console.log(response.data);
    sendEmail(userid)
    refreshPage();
  })
  .catch((error) => {
    console.error(error);
  });
  
}

const handleCategory = (event) => {
  const {name, value} = event.target;
  setCategory({ ...cate, [name]: value});
};

const handleChange = (event) => {
  setCategories(event.target.value);
};

const addCategory = async (event) => {
  event.preventDefault();
  try 
  {
       await axios.post("http://localhost:3001/category/save", cate);
       alert("Category added!");
       refreshPage();
  }
  catch (error)
  {
      console.error(error);
  }
};

let totalPrice = 0;

for (let i = 0; i < filteredOrders.length; i++) {
  totalPrice += filteredOrders[i].total;
}

const statusChangeDeliver =  async (prodid, userid) => {
  return await axios.put(`http://localhost:3001/order/deliver/${prodid}/${userid}`)
  .then((response) => {
    console.log(response.data);
    refreshPage();
  })
  .catch((error) => {
    console.error(error);
  });
}


  return (
    <div className="container mx-auto">
  <div className="mt-10">
    <a href="./admin_products" className="bg-dark-blue hover:bg-button-blue text-white font-bold py-2 px-4 rounded-full">
      PRODUCTS
    </a>
  </div>

  <div className="mt-10 flex justify-center">
  <form onSubmit={addCategory} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-md">
    <div className="sm:col-span-2">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        New Category Name
      </label>
      <div className="mt-2 flex rounded-md shadow-sm">
        <input
          type="text"
          name="category"
          id="category"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter category name"
          onChange={handleCategory}
        />
      </div>
      <p className="mt-3 text-sm text-gray-500">Provide a name for the new category.</p>
    </div>

    <button
      type="submit"
      className="rounded-md bg-dark-blue px-6 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-button-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Add Category
    </button>
  </form>
</div>
  
  <div className="mt-4">
  <h2 className="mt-8 text-xl font-semibold mb-4">CATEGORIES</h2>
    {categories.map((option) => (
      <form>
      <div key={option.category} className="flex items-center justify-between bg-gray-100 rounded-md p-4 mt-4">
        <p className="text-gray-800">{option.category}</p>
        <button
          onClick={() => deleteCategory(option.category)}
          type="submit"
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Delete
        </button>
      </div>
      </form>
    ))}
  </div>
  
  
  <div className="bg-gray-800 container mx-auto my-10">
    <div className="bg-white shadow rounded-lg p-6">
      <label>
        Start Date:
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <label className="mr-2">
        End Date:
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>
      <button onClick={() => {handleFilter()}} className="bg-dark-blue hover:bg-button-blue text-white font-bold py-2 px-4 rounded-md mr-2">
  Filter Orders
</button>

<button onClick={fetchOrders} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">
  Clear Dates
</button>


      <h2 className="mt-8 text-xl font-semibold mb-4">ORDERS</h2>
      <ul className="divide-y divide-gray-200">
      <p className="mt-8 bg-dark-blue text-white font-bold py-2 px-4 rounded-md mr-2">Total Revenue: {totalPrice} TL</p>
      
        {filteredOrders.map((order2) => (
          <li key={order2._id} className="py-4">
            <div className="flex justify-between items-center">
              
              <div>
                <p className="text-sm font-semibold text-gray-700">{order2.userID}</p>
               
                <button onClick={() => downloadPDF(order2)}> 
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>      
                  </button>
                {order2.order.map((product) => (
                  <div key={product._id} className="mt-1">
                    <p className="text-sm font-semibold text-gray-700">{product.product_name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                   
                  </div>
                ))}
              
              </div>
              <p className="text-xs text-gray-500">Address: {order2.delivery_address}</p>
              <p className="text-xs text-gray-500">Total Price: {order2.total} TL</p>
              <p className="text-xs text-gray-500">User ID:{order2.userID}</p>
              <p className="text-xs text-gray-500">Quantity: {order2.order.length}</p>
              {order2.status === "Processing" && (
                <button
                  onClick={() => statusChange(order2._id, order2.userID)}
                  className="bg-dark-blue rounded-md text-white font-semibold px-4 py-2 hover:bg-button-blue focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  In-Transit
                </button>
              )}
              {order2.status === "Waiting For Cancel" && (
                <button
                  onClick={() => Cancel(order2._id, order2.userID)}
                  className="bg-red-600 rounded-md text-white font-semibold px-4 py-2 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                >
                  {order2.status}
                </button>
              )}
              {order2.status === "Waiting For Refund" && (
                <button className="bg-gray-400 rounded-md text-white font-semibold px-4 py-2 cursor-not-allowed" disabled>
                Completed
                </button>
              )}
              {order2.status === "In-Transit" && (
                <button 
                onClick={() => statusChangeDeliver(order2._id, order2.userID)}
                className="bg-gray-800 rounded-md text-white font-semibold px-4 py-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
                  Deliver
                </button>
              )}
              {order2.status !== "Processing" && order2.status !== "In-Transit" && order2.status !== "Waiting For Cancel" && order2.status !== "Waiting For Refund" && (
                <button className="bg-gray-400 rounded-md text-white font-semibold px-4 py-2 cursor-not-allowed" disabled>
                  Completed
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">COMMENTS</h2>
      <ul className="divide-y divide-gray-200">
        {comments.map((comment) => (
          <li key={comment.user} className="py-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">{comment.user_name}</p>
                <p className="text-xs text-gray-500">{comment.product_id_real}</p>
                <p className="text-sm text-gray-700">{comment.comment}</p>
              </div>
              <div>
                <button
                  onClick={() => handleSubmitPost(comment)}
                  className="rounded-md bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  SEND
                </button>
                <button
                  onClick={() => deleteUser(comment._id)}
                  className="rounded-md bg-red-600 text-white font-semibold px-4 py-2 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                >
                  DELETE
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
  )
}

export function downloadPDF(order2) {
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
  doc.text(`Delivery Address: ${order2.delivery_address}`, 10, 55);
  doc.text(`Order ID: ${order2._id}`, 10, 65);
  doc.text(`Date: ${order2.date1}`, 10, 45);

  // Set the font and styles for the order details
  doc.setFont('New York Times Roman', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(51, 51, 51);

  // Calculate the initial y-position for the order items
  let yPos = 80;

  // Iterate over the order items and add them to the PDF
  order2.order.forEach((o, index) => {
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

  // Add the total amount
  doc.text(`Total Amount: ${order2.total}$`, 10, yPos + 20);
  doc.text("Wave Shopping hopes to see you again!", 60, yPos + 30);

  // Save the PDF
  const pdfName = 'invoice.pdf';
  doc.save(pdfName);

  // Convert the PDF to data URL
  const pdfData = doc.output('datauristring');

  // Open the print page with the PDF data URL
  const printWindow = window.open();
  printWindow.document.open();
  printWindow.document.write('<html><head><title>Print</title></head><body>');
  printWindow.document.write('<iframe src="' + pdfData + '" width="100%" height="100%" frameborder="0""></iframe>');
  printWindow.document.write('</body></html>');
  printWindow.document.close();
}




