
const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel')

const app = express()

app.use(express.json())

//Routes 

app.get('/product', async (req, res) => {
  try {
    const getProducts = await Product.find({})
    res.status(200).json(getProducts)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})



app.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const getProduct = await Product.findById(id)
    res.status(200).json(getProduct)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})


app.put('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateProduct = await Product.findByIdAndUpdate(id, req.body)
    if (!updateProduct) {
      return res.status(404).json({message: `can't find any product with ID ${id}`})
    }
    const updatedProduct=await Product.findById(id)
    res.status(200).json(updatedProduct)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

app.delete('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id)
    if (!deleteProduct) {
      return res.status(404).json({message: `can't find any product with ID ${id}`})
    }
    res.status(200).json(deleteProduct)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})



app.post('/product', async (req, res) => {
  try {
    const Products = await Product.create(req.body)
    res.status(200).json(Products)
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ message: e.message })
  }
})

mongoose.connect("mongodb+srv://fahad:roco123@fahadapi.9suqnfb.mongodb.net/Node-Curd?retryWrites=true&w=majority&appName=fahadApi")
  .then(() => {
    app.listen(3000, () => {
      console.log("node api is running on 3000")
    })

    console.log("connected to mongo db");
  }).catch((error) => {
    console.log(error)
  })