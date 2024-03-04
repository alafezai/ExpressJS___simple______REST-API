const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuration de la connexion à la base de données
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'orion__bd'
};

// Création d'une connexion à la base de données
const pool = mysql.createPool(dbConfig);
 
// Middleware pour parser les données JSON dans les requêtes     done!!!!!!!!!!!!!!
app.use(bodyParser.json());

// Route pour récupérer tous les organization (READ)
app.get('/organization', (req, res) => {
  pool.query('SELECT * FROM 	organization_dim', (error, results) => {
    if (error) {
      console.error('Query error:', error);
      res.status(500).send('An error occurred.');
    } else {
      res.json(results);
    }
  });
});

// Route pour créer un nouveau organization (CREATE)             done !!!!!!!
app.post('/organization', (req, res) => {
  const neworganization = req.body;
  pool.query('INSERT INTO organization_dim SET ?', neworganization, (error, result) => {
    if (error) {
      console.error('Query error:', error);
      res.status(500).send('An error occurred.');
    } else {
      res.status(201).json({ message: 'organization created successfully.'});
    }
  });
});

// Route pour mettre à jour un organization existant (UPDATE)               //done  !!
app.put('/organization/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId;
  const updatedorganization = req.body;
  pool.query('UPDATE organization_dim SET ? WHERE Employee_ID = ?', [updatedorganization, employeeId], (error, result) => {
    if (error) {
      console.error('Query error:', error);
      res.status(500).send('An error occurred.');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Employee not found.');
    } else {
      res.status(200).json({ message: 'Employee updated successfully.' });
    }
  });
});


// Route pour supprimer un organization existant (DELETE)
app.delete('/organization/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId;
  pool.query('DELETE FROM organization_dim WHERE Employee_ID = ?', employeeId, (error, result) => {
    if (error) {
      console.error('Query error:', error);
      res.status(500).send('An error occurred.');
    } else if (result.affectedRows === 0) {
      res.status(404).send('organization not found.');
    } else {
      res.status(200).json({ message: 'organization deleted successfully.' });
    }
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
