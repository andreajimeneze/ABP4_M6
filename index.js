const express = require("express")
const app = express()
const hbs = require("hbs")
const fs = require("fs")
const morgan = require("morgan")
let data = Object.values(require("./data/db.json"))


//Settings
app.set("view engine", "hbs")
app.set("views", "./views")



// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))
app.use(express.static("data"))
app.use(morgan("dev"))
hbs.registerPartials(__dirname + "/views/partials")

app.listen(3000)
console.log("En puerto 3000")


//routes

app.get("/", (req, res) => {
    let menu = Object.values(data)
    res.render("index", { menu })
})

app.post("/add", (req, res) => {
    let currentMenu = data.find((e) => e.nombre == req.body.nombre)

    if (currentMenu) {
        res.send("Menú ya existe")

    } else {
        let newMenu = { nombre: req.body.nombre, precio: parseInt(req.body.precio) }

        Object.values(data.push(newMenu))
        fs.writeFileSync("./data/db.json", JSON.stringify(data))
        data = JSON.parse(fs.readFileSync("./data/db.json"))
        res.status(200).send("Menú agregado correctamente")
    }
})

app.get("/add", (req, res) => {
    res.render("formAdd")
})

app.get("/delete", (req, res) => {
    res.render("formDelete")
})


app.delete("/delete/:nombre", (req, res) => {
    console.log(req.params["nombre"])
    let objData = Object.values(data)

    let index = objData.find(obj => obj.nombre === req.query.nombre);
    
    if (objData.findIndex(index) <= objData.length - 1) {
        let newData = objData.splice(objData.findIndex(index), 1);
        fs.writeFile("./data/db.json", JSON.stringify(newData));
        res.status(200).render("Plato eliminado correctamente");
    
    } else {
        res.status(404).render("Plato no encontrado");
    }
});

