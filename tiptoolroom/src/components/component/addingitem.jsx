import React, { useState, useEffect } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Addingitem() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [iId, setIId] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState(null);
  const [ctId, setctId] = useState('');

  const handleDelete = (iIdToRemove) => {
    setItems(prevItems => prevItems.filter(item => item.i_id !== iIdToRemove));
  };
  

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:6969/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('i_id', iId);
    formData.append('name', name);

    formData.append('quantity', quantity);
    formData.append('ct_id', ctId);
    if (images) {
      formData.append('images', images);
    }

    try {
      const response = await fetch('http://localhost:6969/insert/items', {
        method: 'POST',
        body: formData   
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data && data.message === 'Item inserted successfully') {
        window.alert('Item added successfully');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteItemFromServer = (i_id) => {
    fetch(`http://localhost:6969/admin/items/${i_id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
          <CardDescription>Enter the details of the new item.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="" onChange={(e) => setName(e.target.value)} value={name} name="name" type="text" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" placeholder="" onChange={(e) => setQuantity(e.target.value)} value={quantity} name="quantity" type="text" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="i_id">Item ID</Label>
              <Input id="i_id" placeholder="" onChange={(e) => setIId(e.target.value)} value={iId} name="i_id" type="text" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={(e) => setImages(e.target.files[0])} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" value={ctId} onChange={(e) => setctId(e.target.value)}>
                <option value="">Select Category</option>
                <option value="1">Computer Engineering - toolroom 1</option>
                <option value="2">Electrical Engineering - toolroom 2</option>
                {/* Add more categories as needed */}
              </select>
            </div>
            <div className="grid gap-2">
             
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Items List</CardTitle>
          <CardDescription>Click on Remove to delete an item.</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Item ID</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) => (
                <tr key={item.i_id}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">{item.i_id}</td>
                  <td className="border px-4 py-2">{item.category}</td>
                  <td className="border px-4 py-2">
                    <img
                      alt={`${item.name} Image`}
                      src={`http://localhost:6969/public/photos/${item.imagePath}`}
                      style={{
                        aspectRatio: "50/50",
                        objectFit: "cover",
                      }}
                      width="50"
                      height="50"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <Button onClick={() => deleteItemFromServer(item.i_id)} type="button">
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
