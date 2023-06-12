import React, { useContext, useState } from "react";
import { Cart } from "../context/Context";
import { Link } from "react-router-dom";
import { Filters } from "./Filters";
import { SingleProduct } from "./singleProduct";

import { Fragment } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'

const getFilteredItems = (query, items) => {
  if (!query) {
    return items;
  }
  return items.filter(
    (product) =>
      product.product_name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
  );
};



export const Home = () => {
  const [query, setQuery] = useState("");

  const { state } = useContext(Cart);


  const {
    productState: { sort, searchQuery, clear_filters, cate, sort_rating},
    productDispatch,
  } = useContext(Cart);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  const filteredItems = getFilteredItems(query.toLowerCase(), state.products);

  const transformProducts = () => {
    let sortedProducts = state.products;

    if (sort) {
      sortedProducts = sortedProducts.sort((a, b) =>
        sort === "lowToHigh" ? a.price - b.price : b.price - a.price
      );
    }
    if (sort_rating) {
      sortedProducts = sortedProducts.sort((a, b) =>
        sort_rating === "lowToHigh"
          ? a.rating_result - b.rating_result
          : b.rating_result - a.rating_result
      );
    }
    if (searchQuery) {
      sortedProducts = sortedProducts.filter(
        (product) =>
          product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (cate) {
      sortedProducts = sortedProducts.filter((product) =>
        product.category.toLowerCase().includes(cate.toLowerCase())
      );
    }

    return sortedProducts;
  };



const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]
const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
]
const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: '2l', label: '2L', checked: false },
      { value: '6l', label: '6L', checked: false },
      { value: '12l', label: '12L', checked: false },
      { value: '18l', label: '18L', checked: false },
      { value: '20l', label: '20L', checked: false },
      { value: '40l', label: '40L', checked: true },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}






  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        


        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-1">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-20">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Welcome to Wave</h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <div className="mt-2 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search"
                className="border-b border-gray-300 rounded shadow"
                onChange={(e) => {
                  productDispatch({
                    type: "FILTER_BY_SEARCH",
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <Filters />

              {/* Product grid */}
              <div className="lg:col-span-3">
              <div className="bg-white">
     <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-1 lg:max-w-7xl lg:px-8">
       <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        
       {transformProducts().map((product) => (
                    <SingleProduct prod={product} key={product.product_id} />
                  ))}</div>
       </div>
     </div>
   </div>
                  
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};