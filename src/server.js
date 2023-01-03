import express from "express";
import jwt from "jsonwebtoken";
//chek cors

const PORT = 3000;
const server = express();
server.get("/api", (req, res) => {
  res.status(200).json({ message: "Learning token based sessions" });
});
server.post("/api/login", (req, res) => {
  /* si el login va bien, obtendríamos de la base de datos la info del usuario */

  const userData = {
    id: "2klok_3454- sdf",
    name: "Marcelino Pan y Vino",
    email: "marce@bla.bla",
  };

  /* si el login está ok genero el token de sesión y se lo paso al usuario. El token se genera sobre una clave secreta que DEBE  estar a resguardo, es la que permite crear y verificar la validez de un token*/

  jwt.sign(
    { user: userData },
    "secretKey_ups_nosecretatall", //proccess.env.
    { expiresIn: "60s" },
    (err, token) => {
      res.json({ token });
    }
  );
});

server.post("/api/posts", verifytoken, (req, res) => {
  jwt.verify(req.token, "secretKey_ups_nosecretatall", (error, authData) => {
    if (error) {
      res.status(400).json({ message: "Forbidden access | Invalid Token" });
    } else {
      res.json({ message: "Post created!", author: authData });
    }
  });
});
//middleware para verificar la validez del token que trae la request
//el protocolo Bearer tiene esta sintaxis: "Bearer token"

function verifytoken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);
  if (typeof bearerHeader === "undefined") {
    res.status(403).json({ message: "Forbidden access | No token provided" });
  } else {
    const bearerToken = bearerHeader.split(" ").pop(); //partimos bearerHeader en dos y se generó un array: [0] = "Bearer" [1] = token
    req.token = bearerToken;
    next();
  }
}

server.listen(PORT, (err) => {
  err ? console.log(err) : console.log("http://localhost:" + PORT);
});
