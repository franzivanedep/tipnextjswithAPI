/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/XfhWStybQuP
 */
import React, { useState, useEffect } from 'react';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { Assigning, assigning } from "./assigning";
import { useRouter } from "next/navigation";
export function Adminassign() {
  const [jwt, setJwt] = useState('');
  
  const router = useRouter(); // Make sure to import useRouter from 'next/router'
  const [errorMessage, setErrorMessage] = useState(null);

  // Define getJwtFromSession in the component scope
  const getJwtFromSession = () => {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      setJwt(token);
    }
  };

  useEffect(() => {
    // Now you can call getJwtFromSession within this useEffect
    getJwtFromSession();

    const verifyRole = async () => {
      try {
        const response = await fetch('http://localhost:6969/admin/verify', {
          method: 'POST',
          headers: {
            'Authorization': `bearer ${sessionStorage.getItem('jwt')}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'An error occurred');
        }

        console.log('Success: Role is   1');
      } catch (error) {
        setErrorMessage(error.message);
        if (error.message.includes('Role is not   1')) {
          router.push('/Admin/login');
        } else {
          router.push('/');
        }
      }
    };

    verifyRole();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      alert(`unauthorized user `);
    }
  }, [errorMessage]);

  const handleLogout = () => {
    sessionStorage.removeItem('jwt');
    localStorage.removeItem('A_ID');
    localStorage.removeItem('ID');

    router.push('/Admin/login');
  };
  return (
    (<div className="flex w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md min-h-screen">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Menu</h2>
          <nav className="mt-6">
          <Link
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-400 hover:text-white"
              href="/Admin/Assigning">
              Assigning
            </Link>
            <Link
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-400 hover:text-white"
              href="/Admin">
              Transactions
            </Link>
            <Link
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-400 hover:text-white"
              href="/Admin/Assigning/Adding">
              Reports
            </Link>
            <Link
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-400 hover:text-white"
              href="/Admin/courses">
              Assigning Course
            </Link>
          </nav>
        </div>
      </aside>
      <div className="flex-1">
        <header
          className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Transaction Management</h1>
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="outline">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                  size="icon"
                  variant="ghost">
                  <img
                    alt="Avatar"
                    className="rounded-full"
                    height="32"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: "32/32",
                      objectFit: "cover",
                    }}
                    width="32" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} >Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-6">
          <div className="overflow-x-auto">
           <Assigning/>
          </div>
        </main>
      </div>
    </div>)
  );
}


function BellIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>)
  );
}
