'use client'
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Sregister() {
 const router = useRouter();
 const [formData, setFormData] = React.useState({
    last_name: '',
    first_name: '',
    s_id: '',
    prog_id: '',
    email: '',
    password: ''
 });

 // Function to handle form submission
 const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:6969/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log(data);
      
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
    }
 };

 // Function to handle input changes
 const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
 };

 return (
    <form onSubmit={handleSubmit} className="form-box mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Student Registration</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your information to register for the program</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" placeholder="John Doe" required onChange={handleChange} value={formData.last_name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" placeholder="John Doe" required onChange={handleChange} value={formData.first_name} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="s_id">Student ID</Label>
          <Input id="s_id" placeholder="123456789" required onChange={handleChange} value={formData.s_id} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prog_id">Program</Label>
          <Input id="prog_id" placeholder="CPE" required onChange={handleChange} value={formData.prog_id} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="johndoe@example.com" required type="email" onChange={handleChange} value={formData.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" required type="password" onChange={handleChange} value={formData.password} />
        </div>
        <Button className="w-full" type="submit">
          Register
        </Button>
      </div>
    </form>
 );
}
