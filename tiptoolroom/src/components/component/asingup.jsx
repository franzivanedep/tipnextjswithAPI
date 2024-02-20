'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link';

import { useState } from "react";
import { useRouter } from "next/navigation";

export function Asignup() {

 const [email, setEmail] = useState("");
 const [userPass, setUserPass] = useState(""); // renamed 'a' to 'setUserPass'
 const router = useRouter();
 const handleSubmit = async (email, userPass) => {
  const existingToken = sessionStorage.getItem('jwt');
     
  if (existingToken) {
    alert('Another user is already logged in.');
    return; 
  }
  try {
      const response = await fetch('http://localhost:6969/a/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: email,
              password: userPass,
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      localStorage.setItem('ID', result.ID);
      sessionStorage.setItem('jwt', result.token);


      localStorage.setItem('A_ID', result.a_id); 
      
      console.log("USER LOGIN WITH ID : ", localStorage.getItem('ID'));
      console.log("Admin ID : ", localStorage.getItem('A_ID'));
      
      router.push('/Admin');
  } catch (e) {
      console.error('There has been a problem with your fetch operation: ', e);
  }
};

  
 return (
    <div className="mx-auto max-w-[350px] space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Log In</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your email to get started</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="m@tip.edu.ph" required type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="Password">Password</Label>
          <Input id="password" placeholder="password" required type="password" value={userPass} onChange={e => setUserPass(e.target.value)} />
        </div>
        <Button onClick={() => handleSubmit(email, userPass)} className="w-full" type="submit">Continue</Button>
      </div>


<p className="text-gray-500 dark:text-gray-400">
 <Link href="/Admin/register">Not Register yet?</Link>
</p>

    </div>
    
 );
}
