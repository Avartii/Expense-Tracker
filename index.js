const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5001;

// Middleware to handle CORS and JSON parsing
app.use(cors());
app.use(express.json());

// MongoDB connection (make sure MongoDB is running)
mongoose.connect('mongodb://127.0.0.1:27017/expense-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

// Define Expense schema and model
const expenseSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  category: String,
}, { versionKey: false });

const Expense = mongoose.model('Expense', expenseSchema);

app.get('/', (req, res) => {
    res.send('Welcome to the Expense Tracker API!');
  });


// Delete an expense by its ID
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id); // Delete by ID
    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting expense' });
  }
});
  

// Route to get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find(); // Fetch expenses from DB
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
});

// Route to add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const newExpense = new Expense({ amount, description, category });
    await newExpense.save();
    res.json(newExpense); // Return the newly added expense
  } catch (err) {
    res.status(500).json({ error: 'Error adding expense' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
