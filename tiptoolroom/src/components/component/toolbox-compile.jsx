import React, { useState, useEffect, useContext } from "react";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ToolboxContext } from "./app";
import { useRouter } from "next/navigation";

export function ToolboxCompile() {
  const toolboxContext = useContext(ToolboxContext);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [itemNames, setItemNames] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
  const [selectedInstructorName, setSelectedInstructorName] = useState('Select an instructor');
  const [professorId, setProfessorId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantityValue, setQuantityValue] = useState(null);
  const [jwt , setJwt] = useState('');
  const router = useRouter()

 
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const getJwtFromSession = () => {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      setJwt(token);
    }
  };
  const [errorMessage, setErrorMessage] = useState(null);


  useEffect(() => {
    const verifyRole = async () => {
      try {
        // Replace 'your-token-here' with the actual token you want to verify
        const response = await fetch('http://localhost:6969/student/verify', {
          method: 'POST',
          headers: {
            'Authorization': `bearer ${sessionStorage.getItem('jwt')}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'An error occurred');
        }

        // If the role is  1 and the token is valid, proceed with your logic here
        console.log('Success: Role is  1');
      } catch (error) {
        setErrorMessage(error.message);
        router.push('/');
      }
    };

    verifyRole();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      alert(`unauthorized user`);
    }
  }, [errorMessage]);
  useEffect(() => {
    getJwtFromSession();
  }, []); 

  function fetchItemNames() {
    const userId = localStorage.getItem('S_ID');
    if (userId) {
      fetch(`http://localhost:6969/toolbox/${userId}`)
        .then(response => response.json())
        .then(data => {
          setItemNames(data);
          const itemNames = data.map(toolbox => toolbox.itemName);
          console.log('Item Names:', itemNames);
        })
        .catch(error => console.error('Error fetching item names:', error));
    }
  }

  useEffect(() => {
    const sId = localStorage.getItem('S_ID'); // Retrieve s_id from local storage
    if (sId) {
      // Construct the API URL using the s_id
      const apiUrl = `http://localhost:6969/studentInstructors/${sId}`;

      // Fetch data from the API
      setLoading(true);
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setInstructors(data); 
          console.log(data)
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch(error => {
          setError(error);
          // Set any error encountered
          setLoading(false); // Set loading to false if an error occurs
        });
    }
  }, []); 
  const [selectedCourse, setSelectedCourse] = useState('');


  const handleCourseChange = (event) => {
    const selectedCourse = event.target.value;
    setSelectedCourse(selectedCourse);
    alert(`Selected Instructor ID: ${selectedCourse}`);
  
    {
        console.error('Error fetching courses:', error);
    }  
  };
const [quantities, setQuantities] = useState({});

// Create an array of objects with i_id and quantity for each item
const handleQuantityChange = (i_id, event) => {
  const quantityValue = event.target.value;
  setQuantities(prevQuantities => ({
    ...prevQuantities,
    [i_id]: quantityValue
  }));
};
const [refreshKey, setRefreshKey] = useState(0);


const addToCart = async () => {
  event.preventDefault();

   const studentId = localStorage.getItem('S_ID');
  if (!studentId) {
    alert('Please select a student.');
    return;
  }

  // Check if instructor and course are selected
  if (!selectedPId || !selectedCourse) {
    alert('Please select an instructor and a course.');
    return;
  }

  // Check if any item has been selected
  if (!itemNames.some(item => item.i_id)) {
    alert('Please select an item.');
    return;
  }

  const selectedInstructorInfo = selectedPId;
  const selectedCourseInfo = selectedCourse;

  // Map over itemNames to create an array of objects with i_id and quantity
  const itemsWithQuantities = itemNames.map(item => ({
    i_id: item.i_id,
    quantity: quantities[item.i_id] ||  1 // Use the quantity from the quantities state, default to  1 if not found
  }));

  // Construct the payload with the correct structure for the backend
  const payload = itemsWithQuantities.map(item => ({
    t_id: '',
    i_id: item.i_id,
    quantity: item.quantity,
    studentname: '',
    s_id: studentId,
    ac_id: '',
    st_id:  1,
    professorname: selectedInstructorInfo,
    course: selectedCourseInfo // Combine Course Code and Section
  }));

  try {
    const response = await fetch('http://localhost:6969/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });


    const data = await response.text();
    
    fetchItemNames();
    console.log(data);
  

  } catch (error) {
    console.error('Error adding to cart:', error);
  }
  
};

useEffect(() => {
  fetchItemNames();
}, []);

  

  
  
  
  
  async function handleDeleteItem(i_id) {
    try {
      const response = await fetch(`http://localhost:6969/api/items/${i_id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
  
      setItemNames(prevItems => prevItems.filter(item => item.i_id !== i_id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
  const [selectedPId, setSelectedPId] = useState('');

  async function fetchCoursesByInstructorName(selectedPId) {
    // Use a template literal to construct the URL with the professor ID
    const url = `http://localhost:6969/api/courses/${selectedPId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

const handleSelectChange = async (event) => {
    const selectedPId = event.target.value;
    setSelectedPId(selectedPId);
    alert(`Selected Instructor ID: ${selectedPId}`);

    try {
        const coursesData = await fetchCoursesByInstructorName(selectedPId);
        setCourses(coursesData);  
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};

  

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <h1 className="font-semibold text-lg md:text-2xl">Toolbox</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="border shadow-sm rounded-lg">
            <Table key={refreshKey} >
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="max-w-[150px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemNames.map((itemName) => (
                  <TableRow key={itemName.i_id}>
                    <TableCell>
                    <button onClick={() => handleDeleteItem(itemName.i_id)}>Delete</button>

                      <img
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        width="64"
                        src={itemName.images}
                        alt={itemName.images}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{itemName.itemName}</TableCell>
                    <TableCell>
                      <Input
                        className="w-16"
                        defaultValue="1"
                        type="number"
                        onChange={(event) => handleQuantityChange(itemName.i_id, event)}
                        />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
      <div className="flex flex-col">
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Course</CardTitle>
            <CardDescription>Select an instructor and course to add to your cart.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:gap-6">
              <div className="grid gap-2">
                <Label className="text-base" htmlFor="instructor">Instructor</Label>
                <select onChange={handleSelectChange}>
      <option value="">Select an instructor</option>
      {instructors?.map((instructor) => (
        <option key={instructor.professor_p_id} value={instructor.professor_p_id}>
          {`${instructor?.professor_name}`}
        </option>
      ))}
    </select>



              </div>
              <div className="grid gap-2">
                <Label className="text-base" htmlFor="course">Course</Label>
                <select onChange={handleCourseChange}>
  <option value="">Select a course</option>
  {courses?.map((course) => (
    <option key={course.c_id} value={course.c_id}>
      {`${course.Course_Code} - ${course.Course_Section}`}
    </option>
   ))}
</select>

              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" onClick={addToCart}>Add to cart</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
