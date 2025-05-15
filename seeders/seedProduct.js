import mongoose from 'mongoose';
import Product from '../models/productModel.js'; // Adjust path if needed

const products = [
  {
    name: 'Product One',
    image: 'https://via.placeholder.com/150',
    price: 29.99,
    description: 'This is the first product description.',
    category: 'Electronics',
    stock: 10,
  },
  {
    name: 'Product Two',
    image: 'https://via.placeholder.com/150',
    price: 49.99,
    description: 'This is the second product description.',
    category: 'Clothing',
    stock: 20,
  },
  {
    name: 'Product Three',
    image: 'https://via.placeholder.com/150',
    price: 19.99,
    description: 'This is the third product description.',
    category: 'Accessories',
    stock: 15,
  },
  {
    name: 'Product Four',
    image: 'https://via.placeholder.com/150',
    price: 99.99,
    description: 'This is the fourth product description.',
    category: 'Electronics',
    stock: 5,
  },
  {
    name: 'Product Five',
    image: 'https://via.placeholder.com/150',
    price: 24.99,
    description: 'This is the fifth product description.',
    category: 'Clothing',
    stock: 12,
  },
  {
    name: 'Product Six',
    image: 'https://via.placeholder.com/150',
    price: 39.99,
    description: 'This is the sixth product description.',
    category: 'Accessories',
    stock: 8,
  },
  {
    name: 'Product Seven',
    image: 'https://via.placeholder.com/150',
    price: 59.99,
    description: 'This is the seventh product description.',
    category: 'Electronics',
    stock: 3,
  },
  {
    name: 'Product Eight',
    image: 'https://via.placeholder.com/150',
    price: 14.99,
    description: 'This is the eighth product description.',
    category: 'Clothing',
    stock: 18,
  },
];

export default products;


// Seed Function
const seedProducts = async () => {
  try {
    console.log('come')
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany(); // Optional: Clear existing products
    await Product.insertMany(products);
    console.log('Products seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run seed function
seedProducts();
