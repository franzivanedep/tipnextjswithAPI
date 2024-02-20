'use client'
import React, { useEffect, useState } from "react";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";


export function Assigning() {
  const [studentInstructorPairs, setstudentInstructorPairs] = useState([]);
  function safeStringify(obj) {
    const cache = [];
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.includes(value)) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
  }
  
  // Then use safeStringify in your fetch call
  body: safeStringify(studentInstructorPairs)
 const [students, setStudents] = useState([]);

 useEffect(() => {
      fetch(`http://localhost:6969/student`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          setStudents(data);
          console.log('Students:', data);
         })
         
        .catch(error => {
          console.error("Error fetching student data: ", error);
        });
 }, []);
 const [professors, setProfessors] = useState([]);
 useEffect(() => {
  fetch('http://localhost:6969/professors')
    .then(response => response.json())
    .then(data => {
      setProfessors(data);
      console.log(data); // Corrected to lowercase 'data'
    })
    .catch(error => console.error(error));
}, []);


 const [selectedStudentIds, setSelectedStudentIds] = useState([]);
 const [selectedProfessorId, setSelectedProfessorId] = useState(null);

  // Function to handle checkbox change for selecting a student
  const handleStudentSelection = (studentId) => {
    setSelectedStudentIds(prevSelectedIds => {
      if (prevSelectedIds.includes(studentId)) {
        console.log(studentId)
        return prevSelectedIds.filter(id => id !== studentId);
      } else {
        return [...prevSelectedIds, studentId];
      }
    });
  };
  
  const handleProfessorSelection = (event) => {
    // Extract the value from the event object
    const selectedValue = event.target.value;
    console.log('Selected Professor ID:', selectedValue); // Log the selected p_id
    setSelectedProfessorId(selectedValue);
  };
  
  
  
  
  
  
  
  const assignInstructor = () => {
    if (selectedStudentIds.length >  0 && selectedProfessorId !== null) {
      // Create an object with s_ids and p_id properties
      const assignmentPayload = {
        s_ids: selectedStudentIds,
        p_id: selectedProfessorId
      };
  
      // Debugging statements to inspect the payload before stringifying
      console.log('Before stringifying:', assignmentPayload);
  
      // Stringify the object to send as the request body
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentPayload) // No need for safeStringify since we're not dealing with circular references
      };
  
      // Debugging statement to inspect the stringified payload
      console.log('After stringifying:', requestOptions.body);
  
      fetch('http://localhost:6969/studentinstructors', requestOptions)
        .then(response => response.json())
        .then(data => console.log('Data:', data))
        .catch(error => console.error('Error:', error));
    } else {
      console.error('Please select both a student and an instructor.');
      console.log(selectedStudentIds);
      console.log(selectedProfessorId);
    }
  };
  
  
  



 return (
    <main
    
      >
        
      <Card >
        <CardHeader>
          <CardTitle>Assign Tasks</CardTitle>
          <CardDescription>Select Student to assign the Instructor.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {students.map((students, index) => (
                <div key={index} className="flex items-center space-x-2">
                 <Avatar className="h-9 w-9">
 <AvatarImage alt={`${students.first_name} ${students.last_name}`} src="/placeholder-avatar.jpg" />
 <AvatarFallback>{students.first_name ? students.first_name[0] : ''}{students.last_name ? students.last_name[0] : ''}</AvatarFallback>
</Avatar>

                 <div>
                   <div className="font-medium">{students.first_name} {students.last_name}</div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">{students.prog_id}</div>
                 </div>
                 <input
  type="checkbox"
  className="ml-auto"
  id={`students-${students.s_id}`}
  checked={selectedStudentIds.includes(students.s_id)}
  
  onChange={() => handleStudentSelection(students.s_id)}
/>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task">Assign Instructor</Label>
              <select id="professors-select" onChange={handleProfessorSelection}>
  <option value="" disabled selected>Select a Instructor</option>
  {professors.map(professor => (
    <option key={professor.p_id} value={professor.p_id}>
      {professor.first_name} {professor.last_name}
    </option>
   ))}
</select>





            </div>
            <Button className="w-full" onClick={assignInstructor}>
              Assign Instructor
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
 );
}
