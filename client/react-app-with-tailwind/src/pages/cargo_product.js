import { Fragment } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



const sortOptions = [
  { name: 'Most Popular', href: '#', current: false },
  { name: 'Best Rating', href: '#', current: true },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]
const Categories = [
  { name: 'T-Shirts', href: '#' },
  { name: 'Sweatshirts', href: '#' },
  { name: 'Pants', href: '#' },

]



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export const CargoProducts = () => {  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try 
    {
         const response = await axios.get("http://localhost:3001/product/find");
         setProducts(response.data);
         
    }
    catch (err)
    {
      console.error(err);
    }
  };
  const fetchCategoryProduct = async (category) => {
    try {
      const response = await axios.get(`http://localhost:3001/product/${category}`);
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (category !== null) {
      fetchCategoryProduct(category);
    } else {
      fetchProducts();
    }
  }, [category]);

  const handleCategoryClick = (category) => {
    setCategory(category);
  };


  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}


                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Products</h1>
            
            <div className="flex items-center">
             
              <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

           <div className="grid grid-cols-2 gap-x-9 gap-y-9 lg:grid-cols-4">
         
           
           

              {/* Product grid */}
              <div className="lg:col-span-3">
              <div className="bg-white">
     <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-1 lg:max-w-7xl lg:px-8">
       <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        
         {products.map((product) => (
    
           <div key={product.id} className="group relative">
             <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
               <img
                 src={product.imageUrl}
                 alt={product.imageAlt}
                 className="h-full w-full object-cover object-center lg:h-full lg:w-full"
               />
             </div>
             <div className="mt-4 flex justify-between">
               <div>
                 <h3 className="text-left font-medium text-gray-700">
                   <Link to={`/cargo_products/${product.product_id}`}>{product.product_name}
                   <a>
                   <span aria-hidden="true" className="absolute inset-0" />
                     
                   </a>                
                   </Link>
                 </h3>
                 <p className="text-left mt-1 text-sm text-gray-500">{product.category}</p>
               </div>
               {product.discount == true ? 
                (
                <div>
                    
                    <p 
                      style={{textDecoration: 'line-through'}}
                      cclass="text-right font-medium text-gray-900"
                      >
                      {product.old_price} TL
                    </p>
                  <div className="flex-justify-between">
                    
                    <p class="text-right font-medium text-gray-900">{product.price} TL</p>
                    
                  </div>
                </div>
                )
                :
                (
                    
                    <div className="space-y-6">
                      <p class="text-right font-medium text-gray-900">{product.price} TL</p>
                    </div>
                
                )
                }
                
             </div>
           </div>
         ))}
       </div>
     </div>
   </div>
                </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}