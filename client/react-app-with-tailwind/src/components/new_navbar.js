import { Fragment, useContext } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {Link} from 'react-router-dom';
import { useCookies } from "react-cookie"
import {useNavigate} from 'react-router-dom'
import { CartShop } from '../pages/cart';
import { Cart } from '../context/Context';



export const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Products', href: '/products', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const Navbar = () => {

  const {
    state: {cart},
  } = useContext(Cart);

  const [cookies, setCookies, removeCookie] = useCookies(["access_token"]);
      let user2 = window.localStorage.getItem("username");
      const navigate = useNavigate()
       

      const logout = () => {
        removeCookie("access_token")
        window.localStorage.removeItem("userID");
        navigate("/");
      }

  return (
    <Disclosure as="nav" className=" bg-dark-blue">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://static.thenounproject.com/png/1842098-200.png"
                    alt="E-Commerce"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://static.thenounproject.com/png/1842098-200.png"
                    alt="E-Commerce"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {!cookies.access_token ? (<div className="flow-root">
                    <a href="/login" className="text-sm font-medium leading-6 text-white">
                      &nbsp;Login <span aria-hidden="true">&rarr;</span>&nbsp;&nbsp;&nbsp;
                    </a>
                  </div>) 
                  :
                  <div></div>
                  }
                  {!cookies.access_token ? (<div className="flow-root">
                    <a href="/sign_up" className="text-sm font-medium leading-6 text-white">
                    &nbsp;Create account&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </a>
                  </div>) 
                  : 
                  <div className="flow-root">
                    <p className="text-sm font-medium leading-6 text-white">
                      &nbsp;Welcome, {user2}&nbsp;&nbsp;&nbsp;
                    </p>
                  </div>
                  }
                  {!cookies.access_token ?
                  (
                    <div>
                    &nbsp;&nbsp;
                  <CartShop />
                  </div>
                  )
                  :
                  <div></div>
                  }
                {/* Profile dropdown */}
                {!cookies.access_token ? (<Link to="/"></Link>) 
                  :
                  
                  <form action="/wishlist" method="get">
                  <button type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                  </form>
                  
                  }
                {!cookies.access_token ? (<Link to="/"></Link>) 
                 :
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        
                        className="h-8 w-8 rounded-full"
                        src="https://img.a.transfermarkt.technology/portrait/big/28003-1671435885.jpg?lm=1"
                        alt=""
                      />
                      &nbsp;&nbsp;
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                       {user2 == "product_manager" ? 
                       (<Menu.Item>
                        {({ active }) => (
                          <a
                            href="/adminpanel"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Product Manager Panel
                          </a>
                        )}
                       </Menu.Item>) 
                       :
                       console.log("asd")
                       }
                       {user2 == "sales_manager" ? 
                       (<Menu.Item>
                        {({ active }) => (
                          <a
                            href="/cargopanel"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sales Manager Panel
                          </a>
                        )}
                       </Menu.Item>) 
                       :
                       console.log("asd")
                       }

                      {user2 == "product_manager" ? 
                      (
                        <Menu.Item>
                        {({ active }) => (
                          <form action="/createproduct" method="get" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                          <button type="submit">
                            <a>
                              Sell Product
                            </a>
                          </button>
                          </form>
                        )}
                       </Menu.Item>
                      )
                      :
                      console.log("asd")
                      }

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/order_history"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Order History
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            onClick={logout}
                          >
                            Sign out 
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
               }
               {!cookies.access_token ? (<Link to="/"></Link>) 
                  :
                  
                  (
                    <div>
                      &nbsp;&nbsp;
                    <CartShop />
                    </div>
                  )
                  
                  }
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
  
}