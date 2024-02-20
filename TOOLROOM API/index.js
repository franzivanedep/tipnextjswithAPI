const express = require('express')
const app = express()
const mysql = require('mysql');
const util = require('util');
const cors = require("cors");
app.use(express.json());
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser');
const multer = require('multer');
app.use(express.json());
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, './public/photos/');
    },
    filename: function (req, file, cb) {
       cb(null, `${Date.now()}.jpg`);
    }
   });
   console.log (process.env.JWT_SECRET)
   const upload = multer({ storage: storage });

   // CORS configuration
   app.use(cors({
    origin: "http://localhost:3000",
   }));

   app.post('/insert/items', upload.single('images'), async (req, res) => {
    try {
      const { i_id, name, ct_id, quantity } = req.body;
      let imagePath = null;
      if (req.file) {
        const imageUrl = `http://localhost:6969/public/photos/${req.file.filename}`;

        imagePath = imageUrl;
    } else {
        return res.status(400).json({ message: 'No image file was uploaded.' });
      }
  
      const result = await db.query('INSERT INTO items (i_id, name, ct_id, quantity, images) VALUES (?, ?, ?, ?, ?)', [i_id, name, ct_id, quantity, imagePath]);
  
      if (imagePath) {
        res.status(201).json({ message: 'Item inserted successfully', imagePath: imagePath });
      } else {
        res.status(500).json({ message: 'Failed to insert item' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  async function authToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error(err);
        return res.sendStatus(403);
      }
      try {
        req.user = {
          ID: decodedToken.ID,
          role: decodedToken.role,
          email: decodedToken.email

        };
        next();
        
      } catch (error) {
        console.error(error);
        return res.sendStatus(500);
      }
    });
  }

  app.post('/student/verify', authToken, (req, res) => {
    if (req.user.role ===  1) {
      res.status(200).send({ message: 'Success: Role is  1' });
    } else {
      res.status(403).send({ message: 'Error: Role is not  1' });
    }
  });
  
  app.post('/professor/verify', authToken, (req, res) => {
    res.status(200).send({ message: 'Success: Role is  2' });
  });
  app.post('/admin/verify', authToken, (req, res) => {
    res.status(200).send({ message: 'Success: Role is  3' });
  });


   

   
   const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'tiptoolroom22_db'
   });
   
   db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
   });
   
   // Sample route
   app.get('/', function (req, res) {
    res.send('Hello World');
   });


   app.get('/info', (req, res) => {
    // Assuming the JWT is stored in req.session.jwt
    const authToken = req.session.jwt;
  
    if (!authToken) {
      return res.status(401).send('No JWT found in session');
    }
  
    res.json({ authToken });
  });
   

app.get('/accounts', function (req, res) {
    db.query('SELECT * FROM accounts', function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
});
app.get('/toolbox/:s_id', function (req, res) {
    let s_id = req.params.s_id;
    db.query('SELECT * FROM toolbox WHERE s_id = ?', [s_id], function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
});


app.get('/prof/:p_id', function (req, res) {
    let p_id = req.params.p_id;
    db.query('SELECT * FROM professors WHERE p_id = ?', [p_id], function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
});
// get account by id
app.get('/accounts/:id', function (req, res) {
   const id = req.params.id;

   db.query('SELECT * FROM accounts WHERE ac_id = ?', [id], function (error, results, fields) {
       if (error) throw error;
       
       if (results.length > 0) {
           // Account found
           res.send(results[0]);
       } else {
           // No account found with provided ID
           res.status(404).send({ message: 'Account not found!' });
       }
   });
});
app.get('/p/accounts/:id', function (req, res) {
    const id = req.params.id;
 
    db.query('SELECT * FROM accounts WHERE ac_id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        
        if (results.length > 0) {
            // Account found
            res.send(results[0]);
        } else {
            // No account found with provided ID
            res.status(404).send({ message: 'Account not found!' });
        }
    });
 });
 app.get('/coursesrelation/:p_id', function (req, res) {
    const p_id = req.params.p_id;
   
    db.query(`
        SELECT courses.*, coursesrelation.p_id
        FROM courses
        JOIN coursesrelation ON courses.c_id = coursesrelation.c_id
        WHERE coursesrelation.p_id = ?`,
        [p_id], // Pass the p_id as a parameter to the query
        function(error, results, fields) {
            if (error) throw error;
            res.json(results); // Send the results as a JSON response
        }
    );
});



app.delete('/deletecourse/:c_id/:p_id', (req, res) => {
    const c_id = req.params.c_id;
    const p_id = req.params.p_id;
    console.log(`Selected c_id: ${c_id}, p_id: ${p_id}`);

    // SQL query to delete the course from the coursesrelation table
    const sqlCoursesRelation = 'DELETE FROM coursesrelation WHERE c_id = ? AND p_id = ?';
    // SQL query to delete the course from the courses table
    const sqlCourses = 'DELETE FROM courses WHERE c_id = ?';

    // Execute the query for coursesrelation
    db.query(sqlCoursesRelation, [c_id, p_id], (err, result) => {
      if (err) {
        console.error('Error deleting item from coursesrelation:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        // Execute the query for courses
        db.query(sqlCourses, [c_id], (err, result) => {
          if (err) {
            console.error('Error deleting item from courses:', err);
            res.status(500).json({ message: 'Internal Server Error' });
          } else {
            if (result.affectedRows >  0) {
              res.status(200).json({ message: 'deleted' });
            } else {
              res.status(404).json({ message: 'not found' });
            }
          }
        });
      }
    });
});




  
      

        

app.get('/student', function (req, res) {
    db.query('SELECT * FROM student WHERE s_id', function (error, results, fields) {
        if (error) throw error;
        
        if (results.length > 0) {
            // Records found
            res.send(results);
        } else {
            // No records found
            res.status(404).send({ message: 'No students found!' });
        }
    });
});


app.get('/prof/:p_id', function (req, res) {
    let p_id = req.params.p_id;
    db.query('SELECT * FROM professors WHERE p_id = ?', [p_id], function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
});

app.get('/studentInstructors/:s_id', (req, res) => {
    const s_id = req.params.s_id; // Get s_id from the URL parameters
   
    const sql = `
    SELECT DISTINCT   
      CONCAT(professors.first_name, ' ', professors.last_name) AS professor_name
    FROM studentInstructors
    INNER JOIN professors ON studentInstructors.p_id = professors.p_id
    WHERE studentInstructors.s_id = ?
  `;
  
   
    // Execute the query
    db.query(sql, [s_id], (error, results) => {
      if (error) throw error;
      res.json(results); // Send the results back to the client
    });
});


app.get('/api/courses/:professorFullName', async (req, res, next) => {
    try {
        // The professor's full name is now available as a route parameter
        const professorName = req.params.professorFullName;
    
        // Correctly pass the SQL query and parameters to the database client
        const sql = `
            SELECT c.Course_Code, c.Course_Section
            FROM professors p
            JOIN coursesrelation cr ON p.p_id = cr.p_id
            JOIN courses c ON cr.c_id = c.c_id
            WHERE CONCAT(p.first_name, ' ', p.last_name) = ?
          `;
        const params = [professorName];
    
        db.query(sql, params, (error, results) => {
            if (error) {
                return next(error);
            }
            res.json(results);
        });
    } catch (error) {
        next(error);
    }
});
var async = require('async');

app.post('/api/cart', function (req, res) {
    const items = Array.isArray(req.body) ? req.body : [req.body];

    let placeholdersAndValues = items.reduce((acc, curr) => {
        acc.values.push([curr.t_id, curr.i_id, curr.quantity, curr.studentname, curr.s_id,  1, curr.course, curr.professorname, curr.p_id, curr.a_id]);
        acc.placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        return acc;
    }, { values: [], placeholders: [] });

    let placeholders = placeholdersAndValues.placeholders.join(', ');
    let flattenedValues = placeholdersAndValues.values.flat();

    let sql = `INSERT INTO transactionstable (t_id, i_id, quantity, studentname, s_id, st_id, course, professorname, p_id, a_id) VALUES ${placeholders}`;

    db.query(sql, flattenedValues, (error, results, fields) => {
        if (error) {
            throw error;
        }
        res.send('Items added to cart');
    });

    items.forEach(item => {
        let professorName = item.professorname;
        console.log('Professor Name:', professorName);

        let selectProfessorSQL = `SELECT p_id FROM professors WHERE CONCAT(first_name, ' ', last_name) = ?`;
        let values = [professorName];

        db.query(selectProfessorSQL, values, (error, results, fields) => {
            if (error) {
                console.error("Error retrieving professor's p_id:", error);
                return;
            }
            if (results.length >  0) {
                let p_id = results[0].p_id;
                // Update the transactionstable with the retrieved p_id
                db.query(`UPDATE transactionstable SET p_id = ? WHERE professorname = ?`, [p_id, professorName], (error, results, fields) => {
                    if (error) {
                        console.error("Error updating p_id in transactionstable:", error);
                        return;
                    }
                    console.log(`p_id updated for professor ${professorName}`);
                });
            } else {
                console.log(`No matching professor found for ${professorName}`);
            }
        });
    });
});


app.delete('/api/items/:i_id', (req, res) => {
    const i_id = req.params.i_id;
  
    // SQL query to delete the item
    const sql = 'DELETE FROM toolbox WHERE i_id = ?';
  
    // Execute the query
    db.query(sql, i_id, (err, result) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        if (result.affectedRows >  0) {
          res.status(200).json({ message: 'Item successfully deleted' });
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
      }
    });
  });
  app.delete('/admin/items/:i_id', (req, res) => {
    const i_id = req.params.i_id;
  
    // SQL query to delete the item
    const sql = 'DELETE FROM items WHERE i_id = ?';
  
    // Execute the query
    db.query(sql, i_id, (err, result) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        if (result.affectedRows >  0) {
          res.status(200).json({ message: 'Item successfully deleted' });
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
      }
    });
  });




app.get('/student/:id', function (req, res) {
   const id = req.params.id;

   db.query('SELECT * FROM student WHERE ac_id = ?', [id], function (error, results, fields) {
       if (error) throw error;
       
       if (results.length > 0) {
           // Account found
           res.send(results[0]);
       } else {
           // No account found with provided ID
           res.status(404).send({ message: 'student not found!' });
       }
   });
});
app.get('/professor/:id', function (req, res) {
    const id = req.params.id;
 
    db.query('SELECT * FROM professors WHERE ac_id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        
        if (results.length > 0) {
            // Account found
            res.send(results[0]);
        } else {
            // No account found with provided ID
            res.status(404).send({ message: 'professors not found!' });
        }
    });
 });
 

app.get('/items/:id', function (req, res) {
   const id = req.params.id;

   db.query('SELECT * FROM items WHERE i_id = ?', [id], function (error, results, fields) {
       if (error) throw error;
       
       if (results.length > 0) {
           // Account found
           res.send(results[0]);
       } else {
           // No account found with provided ID
           res.status(404).send({ message: 'item not found!' });
       }
   });
});

   

app.get('/items/:category', function (req, res) {
   const id = req.params.id;

   db.query('SELECT * FROM items WHERE category = ?', [id], function (error, results, fields) {
       if (error) throw error;
       
       if (results.length > 0) {
           // Account found
           res.send(results[0]);
       } else {
           // No account found with provided ID
           res.status(404).send({ message: 'item not found!' });
       }
   });
});


app.post('/login', function(req, res) {
    const { email, password } = req.body;
    console.log('Request body:', req.body);
    
    db.query(
        `SELECT * FROM accounts WHERE email= ?`,  
        [email],
        function(err, results, fields) {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'An error occurred while executing the query' });
            } else if (results.length >  0) {
                const user = results[0];
                const role = user.role_id

                console.log(user)
                if (password === user.password) {
                    // Query the students table to get the s_id
                    db.query(
                        `SELECT s_id FROM student WHERE ac_id= ?`, [user.ac_id],    function(err, studentResults) {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ error: 'An error occurred while executing the query' });
                            } else if (studentResults.length >  0) {
                                const s_id = studentResults[0].s_id;
                                console.log(studentResults[0])
                                const payload = {
                                    s_id: user.s_id,
                                    ID: user.ac_id,
                                    email: user.email,
                                    role: role
                                };
                                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                                console.log (s_id)

                                res.status(200).json({ message: 'Login Successful', token: token, s_id: s_id, ID: user.ac_id  });
                               
                            } else {
                                res.status(401).json({ error: 'Student ID not found' });
                            }
                        }
                    );
                } else {
                    res.status(401).json({ error: 'Invalid username or password' });
                }
            } else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        }
    );
});
app.post('/a/login', function(req, res) {
    const { email, password } = req.body;
    console.log('Request body:', req.body);
    
    db.query(
        `SELECT * FROM accounts WHERE email= ?`,  
        [email],
        function(err, results, fields) {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'An error occurred while executing the query' });
            } else if (results.length >  0) {
                const user = results[0];
                const role = user.role_id

                console.log(user)
                if (password === user.password) {
                    // Query the students table to get the s_id
                    db.query(
                        `SELECT a_id FROM admins WHERE ac_id= ?`, [user.ac_id],    function(err, adminsResults) {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ error: 'An error occurred while executing the query' });
                            } else if (adminsResults.length >  0) {
                                const a_id = adminsResults[0].a_id;
                                console.log(adminsResults[0])
                                const payload = {
                                    a_id: user.a_id,
                                    ID: user.ac_id,
                                    email: user.email,
                                    role: role
                                };
                                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                                console.log (a_id)

                                res.status(200).json({ message: 'Login Successful', token: token, a_id: a_id, ID: user.ac_id  });
                               
                            } else {
                                res.status(401).json({ error: 'Student ID not found' });
                            }
                        }
                    );
                } else {
                    res.status(401).json({ error: 'Invalid username or password' });
                }
            } else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        }
    );
});

app.post('/p/login', function(req, res) {
    const { email, password } = req.body;
    console.log('Request body:', req.body);
    
    db.query(
        `SELECT * FROM accounts WHERE email= ?`,  
        [email],
        function(err, results, fields) {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'An error occurred while executing the query' });
            } else if (results.length >  0) {
                const user = results[0];
                const role = user.role_id

                console.log(user)
                if (password === user.password) {
                    // Query the students table to get the s_id
                    db.query(
                        `SELECT p_id FROM professors WHERE ac_id= ?`, [user.ac_id],    function(err, adminsResults) {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ error: 'An error occurred while executing the query' });
                            } else if (adminsResults.length >  0) {
                                const p_id = adminsResults[0].p_id;
                                console.log(adminsResults[0])
                                const payload = {
                                    p_id: user.p_id,
                                    ID: user.ac_id,
                                    email: user.email,
                                    role: role
                                };
                                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                                console.log (p_id)

                                res.status(200).json({ message: 'Login Successful', token: token, p_id: p_id, ID: user.ac_id  });
                               
                            } else {
                                res.status(401).json({ error: 'Instructor ID not found' });
                            }
                        }
                    );
                } else {
                    res.status(401).json({ error: 'Invalid username or password' });
                }
            } else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        }
    );
});

 

app.post('/register', (req, res) => {
    let sql = 'INSERT INTO accounts SET ?';
    let account = {
        email: req.body.email,
        password: req.body.password
    };
    db.query(sql, account, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'An error occurred while registering' });
        } else {
            res.send({ message: "Register successful" });
        }
    });
});


app.post('/register/student', (req, res) => {
   let sqlAccount = 'INSERT INTO accounts SET ?';
   let sqlStudent = 'INSERT INTO student SET ?';

   
   
   let account = {
       email: req.body.email,
       role_id: 1,

       password: req.body.password

   };
   
   db.beginTransaction((err) => {
       if (err) { throw err; }
       
       db.query(sqlAccount, account, (err, result) => {
           if (err) {
               return db.rollback(() => {
                   throw err;
               });
           }
           
           let student = {
               ac_id: result.insertId,
               s_id: req.body.s_id,
               prog_id: req.body.prog_id,
               first_name: req.body.first_name,
               last_name: req.body.last_name
           };
           
           db.query(sqlStudent, student, (err, result) => {
               if (err) {
                   return db.rollback(() => {
                       throw err;
                   });
               }
               
               db.commit((err) => {
                   if (err) {
                       return db.rollback(() => {
                           throw err;
                       });
                   }
                   res.send({ message: "Register successful" });
               });
           });
       });
   });
});
app.post('/register/professors', (req, res) => {
    let sqlAccount = 'INSERT INTO accounts SET ?';
    let sqlProfessors = 'INSERT INTO professors SET ?';
 
    
    
    let account = {
        email: req.body.email,
        password: req.body.password,
        role_id: 2

    };
    
    db.beginTransaction((err) => {
        if (err) { throw err; }
        
        db.query(sqlAccount, account, (err, result) => {
            if (err) {
                return db.rollback(() => {
                    throw err;
                });
            }
            
            let professors = {
                ac_id: result.insertId,
                p_id: req.body.p_id,
                r_id: 2,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            };
            
            db.query(sqlProfessors, professors, (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        throw err;
                    });
                }
                
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            throw err;
                        });
                    }
                    res.send({ message: "Register successful" });
                });
            });
        });
    });
 });
 app.post('/register/admins', (req, res) => {
    let sqlAccount = 'INSERT INTO accounts SET ?';
    let sqlAdmin = 'INSERT INTO admins SET ?';
 
    
    
    let account = {
        email: req.body.email,
        role_id: 3,

        password: req.body.password
    };
    
    db.beginTransaction((err) => {
        if (err) { throw err; }
        
        db.query(sqlAccount, account, (err, result) => {
            if (err) {
                return db.rollback(() => {
                    throw err;
                });
            }
            
            let admins = {
                ac_id: result.insertId,
                a_id: req.body.a_id,
                first_Name: req.body.first_Name,
                last_Name: req.body.last_Name
            };
            
            db.query(sqlAdmin, admins, (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        throw err;
                    });
                }
                
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            throw err;
                        });
                    }
                    res.send({ message: "Register successful" });
                });
            });
        });
    });
 });



app.get('/admins', function (req, res) {
    db.query('SELECT * FROM admins', function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
   });

app.get('/courses', function (req, res) {
    db.query('SELECT * FROM courses', function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
   });
   
   app.get('/items', function (req, res) {
    // First, retrieve all items
    db.query('SELECT * FROM items', function (error, items, fields) {
        if (error) throw error;
        
        // Next, execute the SQL query to calculate the updated quantities
        db.query(`
            SELECT   
                t.st_id,
                CASE   
                    WHEN t.st_id !=   7 THEN i.quantity - t.quantity
                    WHEN t.st_id =   7 THEN i.quantity + t.quantity
                END AS updated_quantity,
                t.i_id
            FROM   
                transactionstable t
            JOIN   
                items i ON t.i_id = i.i_id
            WHERE   
                t.st_id !=   7 OR t.st_id =   7
        `, function (queryError, results, fields) {
            if (queryError) throw queryError;
            
            // Now, iterate over the results and update the items in the database
            results.forEach(function(result) {
                db.query('UPDATE items SET quantity = ? WHERE i_id = ?', [result.updated_quantity, result.i_id], function(updateError, updateResult) {
                    if (updateError) throw updateError;
                    
                    // Log the result of the update operation
                    console.log('Updated item ' + result.i_id + ' with quantity ' + result.updated_quantity);
                });
            });
            
            // After updating the items, send the updated list of items as response
            db.query('SELECT * FROM items', function (finalSelectError, finalResults, fields) {
                if (finalSelectError) throw finalSelectError;
                res.send(finalResults);
            });
        });
    });
});


app.get('/professors', function (req, res) {
    db.query('SELECT * FROM professors', function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
   });
   app.post('/studentinstructors', function (req, res) {
    const { s_ids, p_id } = req.body;   
  
    // Make sure to include single quotes around the values
    const values = s_ids.map(s_id => `('${p_id}', '${s_id}')`).join(', ');
  
    // Log the SQL statement to see what's being executed
    console.log(`INSERT INTO studentinstructors (p_id, s_id) VALUES ${values}`);
  
    const sql = `INSERT INTO studentinstructors (p_id, s_id) VALUES ${values}`;
  
    db.query(sql, function (error, results, fields) {
      if (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while inserting data.' });
      } else {
        res.status(200).send({ message: 'Data inserted successfully.' });
      }
    });
  });

  app.post('/coursesrelation', function (req, res) {
    const { p_ids, c_id } = req.body;
  
    // First, check if the c_id exists in the courses table
    const checkCourseSql = `SELECT c_id FROM courses WHERE c_id = ?`;
    db.query(checkCourseSql, [c_id], function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while checking the course ID.' });
        return;
      }
  
      // If the c_id does not exist, return an error
      if (results.length ===  0) {
        res.status(400).send({ error: 'The course ID does not exist.' });
        return;
      }
  
      // If the c_id exists, proceed with inserting the relations
      const values = p_ids.map(p_id => `('${p_id}', '${c_id}')`).join(', ');
      const sql = `INSERT INTO coursesrelation (p_id, c_id) VALUES ${values}`;
  
      db.query(sql, function (error, results, fields) {
        if (error) {
          console.error(error);
          res.status(500).send({ error: 'An error occurred while inserting data.' });
        } else {
          res.status(200).send({ message: 'Data inserted successfully.' });
        }
      });
    });
  });
  
  
  

app.get('/admins', function (req, res) {
    db.query('SELECT * FROM admins', function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
   });

app.get('/student', function (req, res) {
    db.query('SELECT * FROM student', function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
   });

   
   app.get('/transact', function (req, res) {
    // Get the p_id from the query parameters
    const p_id = req.query.p_id;
   
    const query = `
    SELECT t.*, i.name, t.quantity, CONCAT(s.first_name, ' ', s.last_name) AS student_name
    FROM transactionstable AS t
    LEFT JOIN items AS i ON t.i_id = i.i_id
    LEFT JOIN student AS s ON t.s_id = s.s_id
    WHERE t.st_id <   2 AND t.p_id = ?;
    `;
   
    db.query(query, [p_id], function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});
app.get('/a/transact', function (req, res) {
    // Get the p_id from the query parameters
    const p_id = req.query.p_id;
   
    const query = `
    SELECT t.*, i.name, t.quantity, CONCAT(s.first_name, ' ', s.last_name) AS student_name
    FROM transactionstable AS t
    LEFT JOIN items AS i ON t.i_id = i.i_id
    LEFT JOIN student AS s ON t.s_id = s.s_id
    WHERE t.st_id =   2 AND t.p_id = ?;
    `;
   
    db.query(query, [p_id], function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});
app.get('/admin/transactions', (req, res) => {
    const a_id = req.query.a_id; // Get the a_id from the query parameters
   
    if (!a_id) {
      res.status(400).send('Missing a_id parameter');
      return;
    }
   
    const sql = `
      SELECT t.*, i.name, t.quantity, CONCAT(s.first_name, ' ', s.last_name) AS student_name
      FROM transactionstable AS t
      LEFT JOIN items AS i ON t.i_id = i.i_id
      LEFT JOIN student AS s ON t.s_id = s.s_id
      LEFT JOIN categorytable AS c ON i.ct_id = c.ct_id
      LEFT JOIN admins AS a ON c.r_id = a.r_id
      WHERE t.st_id >=  2 AND t.st_id NOT IN (7,  5) AND a.a_id = ?
    `;
   
    db.query(sql, [a_id], (err, results) => {
      if (err) {
        res.status(500).send('Error executing query');
        return;
      }
      res.json(results);
    });
});



   app.get('/req/transact/:s_id', function (req, res) {
    let s_id = req.params.s_id;
    db.query('SELECT * FROM transactionstable WHERE s_id = ?', [s_id], function (error, results, fields) {
       if (error) throw error;
       res.send(results);
    });
});
app.post('/updatestatus', async (req, res) => {
    // Check if transactionIds is an array
    if (!Array.isArray(req.body.transactionIds)) {
        return res.status(400).send('Invalid request: transactionIds must be an array');
    }

    // Log the received transactionIds
    console.log('Received transactionIds:', req.body.transactionIds);

    const transactionIds = req.body.transactionIds;
    const newStatusId = parseInt(req.query.newStatus, 10);

    try {
        // Use parameterized queries to prevent SQL injection
        const sqlUpdateQuery = `UPDATE transactionstable SET st_id = ? WHERE t_id IN (?)`;
        const values = [newStatusId, transactionIds];
        const result = await db.query(sqlUpdateQuery, values);

        // Check if the update was successful for all transactionIds
        if (result.rowCount !== transactionIds.length) {
            return res.status(404).send(`One or more transactions not found or not updated`);
        }

        // Send back a success message
        res.json({ message: 'Transaction statuses updated successfully.' });
    } catch (error) {
        console.error('Error updating transaction statuses: ', error);
        res.status(500).send('Server error');
    }
});
app.post('/p/updatestatus', async (req, res) => {
    // Check if transactionIds is an array
    if (!Array.isArray(req.body.transactionIds)) {
        return res.status(400).send('Invalid request: transactionIds must be an array');
    }

    // Log the received transactionIds
    console.log('Received transactionIds:', req.body.transactionIds);

    const transactionIds = req.body.transactionIds;
    const newStatusId = parseInt(req.query.newStatus, 10);

    try {
        // Use parameterized queries to prevent SQL injection
        const sqlUpdateQuery = `UPDATE transactionstable SET st_id = ? WHERE t_id IN (?)`;
        const values = [newStatusId, transactionIds];
        const result = await db.query(sqlUpdateQuery, values);

        // Check if the update was successful for all transactionIds
        if (result.rowCount !== transactionIds.length) {
            return res.status(404).send(`One or more transactions not found or not updated`);
        }

        // Send back a success message
        res.json({ message: 'Transaction statuses updated successfully.' });
    } catch (error) {
        console.error('Error updating transaction statuses: ', error);
        res.status(500).send('Server error');
    }
});
app.post('/r/updatestatus', async (req, res) => {
    // Check if transactionIds is an array
    if (!Array.isArray(req.body.transactionIds)) {
        return res.status(400).send('Invalid request: transactionIds must be an array');
    }

    // Log the received transactionIds
    console.log('Received transactionIds:', req.body.transactionIds);

    const transactionIds = req.body.transactionIds;
    const newStatusId = parseInt(req.query.newStatus, 10);

    try {
        // Use parameterized queries to prevent SQL injection
        const sqlUpdateQuery = `UPDATE transactionstable SET st_id = ? WHERE t_id IN (?)`;
        const values = [newStatusId, transactionIds];
        const result = await db.query(sqlUpdateQuery, values);

        // Check if the update was successful for all transactionIds
        if (result.rowCount !== transactionIds.length) {
            return res.status(404).send(`One or more transactions not found or not updated`);
        }

        // Send back a success message
        res.json({ message: 'Transaction statuses updated successfully.' });
    } catch (error) {
        console.error('Error updating transaction statuses: ', error);
        res.status(500).send('Server error');
    }
});
app.post('/ret/updatestatus', async (req, res) => {
    // Check if transactionIds is an array
    if (!Array.isArray(req.body.transactionIds)) {
        return res.status(400).send('Invalid request: transactionIds must be an array');
    }

    // Log the received transactionIds
    console.log('Received transactionIds:', req.body.transactionIds);

    const transactionIds = req.body.transactionIds;
    const newStatusId = parseInt(req.query.newStatus, 10);

    try {
        // Use parameterized queries to prevent SQL injection
        const sqlUpdateQuery = `UPDATE transactionstable SET st_id = ? WHERE t_id IN (?)`;
        const values = [newStatusId, transactionIds];
        const result = await db.query(sqlUpdateQuery, values);

        // Check if the update was successful for all transactionIds
        if (result.rowCount !== transactionIds.length) {
            return res.status(404).send(`One or more transactions not found or not updated`);
        }

        // Send back a success message
        res.json({ message: 'Transaction statuses updated successfully.' });
    } catch (error) {
        console.error('Error updating transaction statuses: ', error);
        res.status(500).send('Server error');
    }
});
app.post('/ready/updatestatus', async (req, res) => {
    // Check if transactionIds is an array
    if (!Array.isArray(req.body.transactionIds)) {
        return res.status(400).send('Invalid request: transactionIds must be an array');
    }

    // Log the received transactionIds
    console.log('Received transactionIds:', req.body.transactionIds);

    const transactionIds = req.body.transactionIds;
    const newStatusId = parseInt(req.query.newStatus, 10);

    try {
        // Use parameterized queries to prevent SQL injection
        const sqlUpdateQuery = `UPDATE transactionstable SET st_id = ? WHERE t_id IN (?)`;
        const values = [newStatusId, transactionIds];
        const result = await db.query(sqlUpdateQuery, values);

        // Check if the update was successful for all transactionIds
        if (result.rowCount !== transactionIds.length) {
            return res.status(404).send(`One or more transactions not found or not updated`);
        }

        // Send back a success message
        res.json({ message: 'Transaction statuses updated successfully.' });
    } catch (error) {
        console.error('Error updating transaction statuses: ', error);
        res.status(500).send('Server error');
    }
});


  





   
   app.post('/toolbox', function (req, res) {
    const { i_id, itemName, s_id, images } = req.body;
    const query = 'INSERT INTO toolbox (i_id, itemName, s_id, images) VALUES (?, ?, ?, ?)';
    const values = [i_id, itemName, s_id, images];
    
    db.query(query, values, function (error, results, fields) {
       if (error) throw error;
       res.send('Item added to toolbox');
    });
});


   
 
     
app.listen(6969)