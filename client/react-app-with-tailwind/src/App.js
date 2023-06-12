
import "./App.css"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Home} from "./pages/home";
import {CreateProduct} from "./pages/createproduct";
import {Wishlist} from "./pages/wishlist";
import {LoginPage} from "./pages/login";
import {SignUpPage} from "./pages/sign_up";
import {Navbar} from "./components/new_navbar.js";
import { Products } from "./pages/product";
import ProductDetail from "./pages/productDetail";
import { CartShop } from "./pages/cart";
import { Purchase } from "./pages/purchase";
import { Adminpage } from "./pages/adminpage";
import { Cart } from "./context/Context";
import { useContext } from "react";
import { OrderHistory } from "./pages/orderhistory";
import { Cargopage } from "./pages/cargopage";
import { PaymentDone } from "./pages/payment_done";
import { PaymentProcess } from "./pages/payment_process";
import { AdminProducts } from "./pages/admin_products";
import ProductDetailAdmin from "./pages/admin_p_detail";
import { CargoProducts } from "./pages/cargo_product";
import ProductDetailCargo from "./pages/cargo_p_details";
import Personal_Info from "./pages/personal_info";


function App() {


  return (
    <div className="App"> 
    
    <Router>
      <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/wishlist" element={<Wishlist/>} />
      <Route path="/createproduct" element={<CreateProduct/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/sign_up" element={<SignUpPage/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/adminpanel" element={<Adminpage/>} />
      <Route path="/cargopanel" element={<Cargopage/>} />
      <Route path="/cart" element={<CartShop/>} />
      <Route path="/purchase" element={<Purchase/>} />
      <Route path="/order_history" element={<OrderHistory/>} />
      <Route path="/payment_success" element={<PaymentDone/>} />
      <Route path="/admin_products" element={<AdminProducts/>} />
      <Route path="/cargo_products" element={<CargoProducts/>} />
      <Route path="/payment_process" element={<PaymentProcess/>} />
      <Route path="/products/:productId" element={<ProductDetail/>} />
      <Route path="/admin_products/:productId" element={<ProductDetailAdmin/>} />
      <Route path="/cargo_products/:productId" element={<ProductDetailCargo/>} />
      <Route path="/personal_info" element={<Personal_Info/>} />
    </Routes>     
    </Router> 
      
    </div>

  );
}

export default App;

