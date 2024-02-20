'use client'
import React from 'react';
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card, CardFooter } from "@/components/ui/card"


const BorrowButton = ({ }) => {
 const showlog = () => console.log("pressed");

 return (
 
 <Button style={{backgroundColor: 'black', color: 'white', textAlign: 'right' , marginLeft: 150}} className={"ml-auto"} variant={"secondary"} onClick={showlog}>
    Borrow
 </Button>

   
 );
};

export default BorrowButton;
