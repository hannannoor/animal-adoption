var express = require("express");
var db = require("./db-connections");

var app = express();    
app.use(express.json())
app.use(express.static("./public"));

// used to show all animals and their data (images,species and information)
app.route('/animal').get(function (req,res){
  //try-catch used to for error handling without crashing the server (USED FOR ALL THE APPROUTES)
  try {
// joins the three tables (animal and animal_images and animal_species) so that both animal info and default animal images can be shown
    var sql = `
      SELECT animal.*, animal_images.image_url, animal_species.species_name
      FROM animal
      LEFT JOIN animal_images
        ON animal_images.animal_id = animal.animal_id
        AND animal_images.is_default = 1
      LEFT JOIN animal_species
        ON animal.species_id = animal_species.species_id
    `;

    db.query(sql,function (error,result) {
      // Sends a error message if encounters an error (simialr for other approutes)
      if (error) return res.status(500).json({ error: "Failed to fetch animals" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// shows information about animal based on animal id
app.route('/animal/:animal_id').get(function (req, res) {
  try {
  //used to join the three tables (animal and animal_images and animal_species) so that both animal info and animal images can be shown
    var sql = `
      SELECT animal.*, animal_images.image_url, animal_species.species_name
      FROM animal
      LEFT JOIN animal_images
        ON animal_images.animal_id = animal.animal_id
        AND animal_images.is_default = 1
      LEFT JOIN animal_species
        ON animal.species_id = animal_species.species_id
      WHERE animal.animal_id = ?
    `;
    var parameter = [req.params.animal_id];

    db.query(sql, parameter, function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to fetch animal" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//used to show image based on image_id
app.route('/animal_image/:image_id').get(function (req,res){
  try {
    var sql= "SELECT * FROM animal_images where image_id= ?";
    var parameter= [req.params.image_id];

    db.query(sql, parameter, function (error,result) {
      if (error) return res.status(500).json({ error: "Failed to fetch image" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//used to show all images based on animal id ( i.e. all images of a certain animal/animal_id)
app.route("/animal/:animal_id/images").get(function (req, res) {
  try {
    var sql = "SELECT * FROM animal_images WHERE animal_id = ?";
    var parameters = [req.params.animal_id];

    db.query(sql, parameters, function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to fetch images" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// used to see all species (Only used for testing and debugging)
app.route("/species").get(function (req, res) {
  try {
    var sql = "SELECT species_id, species_name FROM animal_species ORDER BY species_name";
    db.query(sql, function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to fetch species" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.route('/application').get(function(req,res) {
  try {
    var sql= `
    SELECT
    adoption_application.*,
    animal.name as animal_name,
    animal.species_id,
    animal_species.species_name

    FROM adoption_application
    LEFT JOIN animal ON adoption_application.animal_id = animal.animal_id
    LEFT JOIN animal_species ON animal.species_id = animal_species.species_id
    ORDER BY adoption_application.created_at DESC `; // makes it so they are ordered by newest application

    db.query(sql, function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to fetch applications" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all applications for a specific animal
app.route('/application/animal/:animal_id').get(function(req, res) {
  try {
    var sql = `
      SELECT * FROM adoption_application 
      WHERE animal_id = ?
    `;
    var parameters = [req.params.animal_id];
    
    db.query(sql, parameters, function(error, result) {
      if (error) return res.status(500).json({ error: "Failed to fetch applications" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

 // used to add animal information (not images)
app.route("/animal").post(function (req, res) {
  try {
    if (!req.body.name || !req.body.breed || !req.body.species_id || !req.body.gender || !req.body.temperament || !req.body.adoption_status) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (isNaN(req.body.age_year) || isNaN(req.body.age_month) || isNaN(req.body.species_id)) {
      return res.status(400).json({ error: "Age and species ID must be numbers" });
    }

    var sql = `
      INSERT INTO animal_adoption.animal
      (name, age_year, age_month, species_id, breed, gender, temperament, adoption_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    var parameters = [req.body.name,req.body.age_year,req.body.age_month,req.body.species_id,req.body.breed,req.body.gender,req.body.temperament,req.body.adoption_status];

    db.query(sql, parameters, function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to add animal" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//used to add just a image
app.route('/animal_image').post( function(req,res){
  try {
    // Input validation error handling ie checks that all required fields are not empty (used in all post and put approutes)
    if (!req.body.animal_id || !req.body.image_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // also checks that numeric values are actually nubmers (also used in all post and put approutes)
    if (isNaN(req.body.animal_id)) {
      return res.status(400).json({ error: "Animal ID must be a number" });
    }

    var sql = "INSERT INTO animal_adoption.animal_images (animal_id,image_url, is_default) VALUES (?, ?, ?)";
    var parameters = [req.body.animal_id,req.body.image_url,req.body.is_default];

    db.query(sql, parameters, function(error, result){
      if (error) return res.status(500).json({ error: "Failed to add image" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// used to add a animal application
app.route('/application').post(function (req, res) {
  try {
    if (!req.body.animal_id || !req.body.applicant_name || !req.body.email || !req.body.phone || !req.body.application_statement) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (isNaN(req.body.animal_id)) {
      return res.status(400).json({ error: "Animal ID must be a number" });
    }

    var sql = `
      INSERT INTO animal_adoption.adoption_application
      (animal_id, applicant_name, email, phone, application_statement, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    var parameters = [req.body.animal_id,req.body.applicant_name,req.body.email,req.body.phone,req.body.application_statement];

    db.query(sql, parameters, function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to submit application" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// used to update only animal info (no images)
app.route("/animal/:animal_id").put(function (req, res) {
  // try-catch to catch errors without the server crashing
  try {
    //input validation to check all required values are present
    if (!req.body.name || !req.body.breed || !req.body.species_id || !req.body.gender || !req.body.temperament || !req.body.adoption_status) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // input validation to check that all the numeric values are actually numbers
    if (isNaN(req.body.age_year) || isNaN(req.body.age_month) || isNaN(req.body.species_id)) {
      return res.status(400).json({ error: "Age and species ID must be numbers" });
    }

    var sql = 
      "UPDATE animal_adoption.animal " +
      "SET name=?, age_year=?, age_month=?, species_id=?, breed=?, gender=?, temperament=?, adoption_status=? " +
      "WHERE animal_id=?";
    var params = [req.body.name,req.body.age_year,req.body.age_month,req.body.species_id,req.body.breed,req.body.gender,req.body.temperament,req.body.adoption_status,req.params.animal_id];

    db.query(sql, params, function (err, result) {
      if (err) return res.status(500).json({ error: "Failed to update animal" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// used to update default image
app.route("/animal_image/default/:animal_id").put(function (req, res) {
  try {
    if (!req.body.image_url) {
      return res.status(400).json({ error: "Missing image URL" });
    }

    var sql = 
      "UPDATE animal_adoption.animal_images " +
      "SET image_url=? " +
      "WHERE animal_id=? AND is_default=1";
    var params = [req.body.image_url, req.params.animal_id];

    db.query(sql, params, function (err, result) {
      if (err) return res.status(500).json({ error: "Failed to update image" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// used to update a image
app.route("/animal_image/:image_id").put( function(req,res){
  try {
    if (!req.body.image_url) {
      return res.status(400).json({ error: "Missing image URL" });
    }
    if (req.body.animal_id && isNaN(req.body.animal_id)) {
      return res.status(400).json({ error: "Animal ID must be a number" });
    }

    var sql = "UPDATE animal_adoption.animal_images SET animal_id=?, image_url=? WHERE image_id=?";
    var parameters = [req.body.animal_id, req.body.image_url, req.params.image_id];
    db.query(sql, parameters, function(error, result){
      if (error) return res.status(500).json({ error: "Failed to update image" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// used to update application status (approve or reject or reserve)
app.route('/application/:application_id').put(function (req, res) {
  try {
    if (!req.body.status) {
      return res.status(400).json({ error: "Missing status" });
    }

    var applicationId = req.params.application_id;
    var newStatus = req.body.status;
    
  // updates the application status 
    var sql = "UPDATE animal_adoption.adoption_application SET status = ? WHERE application_id = ?";
    
    db.query(sql, [newStatus, applicationId], function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to update application" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// used to update just the adoption status  of an animal 
app.route('/animalstatus/:animal_id').put(function (req, res) {
  try {
    if (!req.body.adoption_status) {
      return res.status(400).json({ error: "Missing adoption status" });
    }

    var sql = "UPDATE animal_adoption.animal SET adoption_status = ? WHERE animal_id = ?";
    var parameters = [req.body.adoption_status, req.params.animal_id];
    
    db.query(sql, parameters, function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to update status" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//used to delete just a image
app.route("/animal_image/:image_id").delete( function(req,res){
  // try-catch for error handling without the server crashing
  try {
    var sql="DELETE FROM animal_adoption.animal_images WHERE image_id=?";
    var parameters=[req.params.image_id];

    db.query(sql,parameters,function(error,result){
      // gives useful error message if error is encountered
      if (error) return res.status(500).json({ error: "Failed to delete image" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// deletes animal info ( but also deletes related images as in sql foreign key is set as cascade on delete)
app.route("/animal/:animal_id").delete(function (req, res) {
  try {
    var sql = "DELETE FROM animal_adoption.animal WHERE animal_id = ?";
    var parameters = [req.params.animal_id];

    db.query(sql, parameters, function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to delete animal" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// used to delete an adoption application
app.route('/application/:application_id').delete(function (req, res) {
  try {
    var sql = "DELETE FROM animal_adoption.adoption_application WHERE application_id = ?";
    var parameters = [req.params.application_id];
    
    db.query(sql, parameters, function (error, result) {
      if (error) return res.status(500).json({ error: "Failed to delete application" });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(8080 ,'127.0.0.1');
console.log("web server running @http:/127.0.0.1:8080");