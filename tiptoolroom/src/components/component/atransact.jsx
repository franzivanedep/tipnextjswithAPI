'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from '@/components/ui/dropdown-menu';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from '@/components/ui/table';
import { useEffect, useState } from 'react';

export function Atransact() {
  
  const [itemData, setItemData] = useState([]); // Initialize with an empty array
  const a_id = localStorage.getItem('A_ID');

  useEffect(() => {
    fetch(`http://localhost:6969/admin/transactions?a_id=${a_id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setItemData(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching items data: ', error);
      });
  }, []);

  const handleConfirm = async (t_ids) => {
    try {
      const response = await fetch(`http://localhost:6969/c/updatestatus?newStatus=3`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionIds: t_ids }), // Pass an array of transaction IDs
      });
  
      if (!response.ok) {
        switch (response.status) {
          case  404:
            throw new Error('Transaction not found');
          case  500:
            throw new Error('Server error occurred');
          default:
            throw new Error('Failed to update transaction status');
        }
      }
  
      // Assuming the server returns the updated transaction data
      const updatedTransactions = await response.json();
  
      // Update the state with the new transaction data
      setItemData(prevData => {
        return prevData.map(tx => {
          // Check if the current transaction's t_id is in the updated transactions array
          if (updatedTransactions.some(updatedTx => updatedTx.t_id === tx.t_id)) {
            // If yes, return the updated transaction, otherwise return the original one
            return updatedTransactions.find(updatedTx => updatedTx.t_id === tx.t_id) || tx;
          } else {
            return tx;
          }
        });
      });
    } catch (error) {
      console.error('Error updating transaction status: ', error);
      // Display an error message to the user
    }
  };
  
  const handlePrepare = async (t_ids) => {
    try {
      const response = await fetch(`http://localhost:6969/p/updatestatus?newStatus=4`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionIds: t_ids }), // Pass an array of transaction IDs
      });
  
      if (!response.ok) {
        switch (response.status) {
          case  404:
            throw new Error('Transaction not found');
          case  500:
            throw new Error('Server error occurred');
          default:
            throw new Error('Failed to update transaction status');
        }
      }
  
      // Assuming the server returns the updated transaction data
      const updatedTransactions = await response.json();
  
      // Update the state with the new transaction data
      setItemData(prevData => {
        return prevData.map(tx => {
          // Check if the current transaction's t_id is in the updated transactions array
          if (updatedTransactions.some(updatedTx => updatedTx.t_id === tx.t_id)) {
            // If yes, return the updated transaction, otherwise return the original one
            return updatedTransactions.find(updatedTx => updatedTx.t_id === tx.t_id) || tx;
          } else {
            return tx;
          }
        });
      });
    } catch (error) {
      console.error('Error updating transaction status: ', error);
      // Display an error message to the user
    }
  };
  const handleReject = async (t_ids) => {
    try {
      const response = await fetch(`http://localhost:6969/r/updatestatus?newStatus=5`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionIds: t_ids }), // Pass an array of transaction IDs
      });
  
      if (!response.ok) {
        switch (response.status) {
          case  404:
            throw new Error('Transaction not found');
          case  500:
            throw new Error('Server error occurred');
          default:
            throw new Error('Failed to update transaction status');
        }
      }
  
      // Assuming the server returns the updated transaction data
      const updatedTransactions = await response.json();
  
      // Update the state with the new transaction data
      setItemData(prevData => {
        return prevData.map(tx => {
          // Check if the current transaction's t_id is in the updated transactions array
          if (updatedTransactions.some(updatedTx => updatedTx.t_id === tx.t_id)) {
            // If yes, return the updated transaction, otherwise return the original one
            return updatedTransactions.find(updatedTx => updatedTx.t_id === tx.t_id) || tx;
          } else {
            return tx;
          }
        });
      });
    } catch (error) {
      console.error('Error updating transaction status: ', error);
      // Display an error message to the user
    }
  };
  const handleReturned = async (t_ids) => {
    try {
      const response = await fetch(`http://localhost:6969/ret/updatestatus?newStatus=7`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionIds: t_ids }), // Pass an array of transaction IDs
      });
  
      if (!response.ok) {
        switch (response.status) {
          case  404:
            throw new Error('Transaction not found');
          case  500:
            throw new Error('Server error occurred');
          default:
            throw new Error('Failed to update transaction status');
        }
      }
  
      // Assuming the server returns the updated transaction data
      const updatedTransactions = await response.json();
  
      // Update the state with the new transaction data
      setItemData(prevData => {
        return prevData.map(tx => {
          // Check if the current transaction's t_id is in the updated transactions array
          if (updatedTransactions.some(updatedTx => updatedTx.t_id === tx.t_id)) {
            // If yes, return the updated transaction, otherwise return the original one
            return updatedTransactions.find(updatedTx => updatedTx.t_id === tx.t_id) || tx;
          } else {
            return tx;
          }
        });
      });
    } catch (error) {
      console.error('Error updating transaction status: ', error);
      // Display an error message to the user
    }
  };
  const handleReady = async (t_ids) => {
    try {
      const response = await fetch(`http://localhost:6969/ready/updatestatus?newStatus=6`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionIds: t_ids }), // Pass an array of transaction IDs
      });
  
      if (!response.ok) {
        switch (response.status) {
          case  404:
            throw new Error('Transaction not found');
          case  500:
            throw new Error('Server error occurred');
          default:
            throw new Error('Failed to update transaction status');
        }
      }
  
      // Assuming the server returns the updated transaction data
      const updatedTransactions = await response.json();
  
      // Update the state with the new transaction data
      setItemData(prevData => {
        return prevData.map(tx => {
          // Check if the current transaction's t_id is in the updated transactions array
          if (updatedTransactions.some(updatedTx => updatedTx.t_id === tx.t_id)) {
            // If yes, return the updated transaction, otherwise return the original one
            return updatedTransactions.find(updatedTx => updatedTx.t_id === tx.t_id) || tx;
          } else {
            return tx;
          }
        });
      });
    } catch (error) {
      console.error('Error updating transaction status: ', error);
      // Display an error message to the user
    }
  };
  const statusMessages = {
    1: 'added to Toolbox',
    2: 'Approved by your instructor',
    3: 'approved by Admin',
    4: 'Preparing',
    5: 'reject',
    6: 'Ready to Pick up'
 };
  
  

  const renderRows = () => {
    // First, sort the transactions by date, time, and student name
    const sortedTransactions = [...itemData].sort((a, b) => {
      const dateComparison = a.sdate.localeCompare(b.sdate);
      if (dateComparison !==  0) return dateComparison;

      const timeComparison = a.stime.localeCompare(b.stime);
      if (timeComparison !==  0) return timeComparison;
      
      const nameComparison = a.name.localeCompare(b.name);
      if (nameComparison !==  0) return timeComparison;

      return a.studentname.localeCompare(b.studentname);
    });

    // Then, group the sorted transactions
    const groupedTransactions = [];
    let currentGroup = null;

    sortedTransactions.forEach(transaction => {
      if (currentGroup &&
          currentGroup[0].sdate === transaction.sdate &&
          currentGroup[0].stime === transaction.stime &&
          currentGroup[0].studentname === transaction.studentname) {
        // If the current transaction belongs to the same group, add it to the group
        currentGroup.push(transaction);
      } else {
        // Otherwise, start a new group
        currentGroup = [transaction];
        groupedTransactions.push(currentGroup);
      }
    });

    // Finally, render each group of transactions as a single row in the table
    return groupedTransactions.map((group, groupIndex) => {
      // Determine if all s_id values are the same within the group
      const uniqueSIds = new Set(group.map(transaction => transaction.s_id));
      const allSameSId = uniqueSIds.size ===  1;

      // Determine if all course names are the same within the group
      const uniqueCourses = new Set(group.map(transaction => transaction.course));
      const allSameCourse = uniqueCourses.size ===  1;

      // Render the Confirm button only once per group
      const confirmButton = (
        <TableCell>
<Button className="mr-2" variant="outline" onClick={() => {
  const t_ids = group.map(transaction => transaction.t_id); // Get an array of t_ids from the group
  console.log('Passing t_ids to handleConfirm:', t_ids); // Log the t_ids
  handleConfirm(t_ids);
}}>Confirm</Button>
<Button className="mr-2" variant="outline" onClick={() => {
  const t_ids = group.map(transaction => transaction.t_id); // Get an array of t_ids from the group
  console.log('Passing t_ids to handleConfirm:', t_ids); // Log the t_ids
  handleReject(t_ids);
}}>Rekect</Button>         <Button className="mr-2" variant="outline" onClick={() => {
  const t_ids = group.map(transaction => transaction.t_id); // Get an array of t_ids from the group
  console.log('Passing t_ids to handleConfirm:', t_ids); // Log the t_ids
  handlePrepare(t_ids);
}}>Prepare</Button> 
<Button className="mr-2" variant="outline" onClick={() => {
  const t_ids = group.map(transaction => transaction.t_id); // Get an array of t_ids from the group
  console.log('Passing t_ids to handleConfirm:', t_ids); // Log the t_ids
  handleReturned(t_ids);
}}>Returned</Button>
<Button className="mr-2" variant="outline" onClick={() => {
  const t_ids = group.map(transaction => transaction.t_id); // Get an array of t_ids from the group
  console.log('Passing t_ids to handleConfirm:', t_ids); // Log the t_ids
  handleReady(t_ids);
}}>Ready</Button>      


        </TableCell>
      );

      return (
        <TableRow key={groupIndex}>
          <TableCell>{group[0].sdate}</TableCell>
          <TableCell>{group[0].stime}</TableCell>
          <TableCell>{group[0].student_name}</TableCell>


          


          <TableCell>
            {allSameSId ? group[0].s_id : group.map((transaction, index) => (
              <div key={index}>
                {transaction.s_id}
              </div>
            ))}
          </TableCell>
          <TableCell>
            {allSameCourse ? group[0].course : group.map((transaction, index) => (
              <div key={index}>
                {transaction.course}
              </div>
            ))}
          </TableCell>
          <TableCell>
            {allSameCourse ? group[0].professorname : group.map((transaction, index) => (
              <div key={index}>
                {transaction.professorname}
              </div>
            ))}
          </TableCell>
        
          <TableCell>
          {group.map((transactionGroup, index) => {
  return (
    <div key={index}>
      <h3>{transactionGroup.name}</h3>
      <ul>
        {transactionGroup.transactions?.map((transaction, i) => (
          <li key={i}>{transaction.name}: {transaction.quantity}</li>
        ))}
      </ul>
    </div>
  );
})}
        
     

          </TableCell>
          <TableCell>
          {statusMessages[group[0].st_id] || 'Status not found'}
          </TableCell>
          <TableCell>
            {confirmButton}
          </TableCell>
        </TableRow>
      );
    });
  };

 return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900">
    
      <main className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Confirmed by</TableHead>

                <TableHead>Item List</TableHead>
                <TableHead>Status</TableHead>

                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderRows()}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
 );
}

function BellIcon(props) {
 return (
    <svg
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
    </svg>
 );
}
