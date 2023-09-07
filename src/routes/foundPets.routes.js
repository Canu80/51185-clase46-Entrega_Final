const express = require("express");
const router = express.Router();

// Definir una ruta para la página de mascotas perdidas
router.get("/found", (req, res) => {
  const lostPetsData = [
    {
      name: "Tomás",
      imageFilename: "01.jpg",
      age: 4,
      daysLost: 3,
      location: "un lugar dentro de la provincia de Buenos Aires (Argentina)",
      contactNumber: "11 9 5648 9554"
    },

  ];
  res.render("lostPets", { lostPets: lostPetsData });
});

module.exports = router;