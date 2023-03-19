const express = require("express")
const app = express()
const hbs = require("hbs")
const fs = require("fs")
const morgan = require("morgan")
let data = require("./data/db.json")
var helpers = require("./helpers/helper.js")
const Memcached = require("memcached")
const client = new Memcached("localhost:3000")


//Settings
app.set("view engine", "hbs")
app.set("views", "./views")
client.set("miClave", "miValor", 600, (error, result) => {
  console.log(result)
})

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))
app.use(express.static("data"))
app.use(morgan("dev"))
hbs.registerPartials(__dirname + "/views/partials")

app.listen(3000, () => {
  console.log("En puerto 3000")
})

client.get("miClave", (error, result) => {
  console.log(result)
})

//routes
app.get("/", (req, res) => {
  let menu = data.map((menuItem) => {
    return {
      nombre: helpers.capFirstMay(menuItem.nombre),
      precio: helpers.formatCL(menuItem.precio),
    }
  })
  res.render("index", { menu })
})

app.post("/add", (req, res) => {
  let currentMenu = data.find((e) => e.nombre == req.body.nombre)

  if (currentMenu) {
    res.send("Menú ya existe")
  } else {
    let newMenu = { nombre: req.body.nombre, precio: parseInt(req.body.precio) }
    data.push(newMenu)
    fs.writeFileSync("./data/db.json", JSON.stringify(data))

    res.redirect("/")
  }
})

app.get("/add", (req, res) => {
  res.render("formAdd")
})

app.get("/delete", (req, res) => {
  res.render("formDelete")
})

app.post("/delete/", (req, res) => {
  let index = data.findIndex(menu => menu.nombre === helpers.capFirstMay(req.body.nombre))

  if (index < 0 || index >= data.length) {
    res.status(404).send("Plato no encontrado")
  } else {
    data.splice(index, 1)

    fs.writeFileSync("./data/db.json", JSON.stringify(data))
    res.status(200).send("Plato eliminado correctamente")

  }
})


app.get("/modif", (req, res) => {
  let menu = data.map((menuItem) => {
    return {
      nombre: helpers.capFirstMay(menuItem.nombre),
      precio: helpers.formatCL(menuItem.precio),
    }
  })
  res.render("formModif", { menu })
})

app.post("/modif", (req, res) => {
  let menuName = req.body.nombre
  let newPrice = parseInt(req.body.precio)

  data[menuName].precio = newPrice;

  fs.writeFileSync("./data/db.json", JSON.stringify(data))
  res.status(200).send("Precio actualizado correctamente");
});
