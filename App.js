import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [lastDeleted, setLastDeleted] = useState(null);

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // Add a new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !title || !category) {
      alert('All fields are required!');
      return;
    }
    try {
      const newExpense = { amount, description: title, category };
      await axios.post('http://localhost:5001/api/expenses', newExpense);
      setAmount('');
      setTitle('');
      setCategory('');
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  // Delete an expense
const handleDelete = async (index) => {
  const deletedExpense = expenses[index];
  setLastDeleted(deletedExpense);

  try {
    // Send DELETE request to the backend
    await axios.delete(`http://localhost:5001/api/expenses/${deletedExpense._id}`);

    // Update frontend state by removing the deleted expense
    setExpenses(expenses.filter((_, i) => i !== index));
  } catch (error) {
    console.error('Error deleting expense:', error);
    alert('Failed to delete expense. Please try again.');
  }
};


  // Undo last deletion
  const handleUndo = () => {
    if (lastDeleted) {
      setExpenses([...expenses, lastDeleted]);
      setLastDeleted(null);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>💸 My Expense Tracker</h1>
      </header>

      <main>
        <form className="expense-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount (e.g., 100)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Choose Category
            </option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Others">Others</option>
          </select>
          <button type="submit">Add Expense</button>
        </form>

        <section className="expenses-section">
          <h2>📊 Expense List</h2>
          {expenses.length === 0 ? (
            <p className="no-expenses">No expenses recorded yet.</p>
          ) : (
            <ul className="expenses-list">
              {expenses.map((expense, index) => (
                <li key={index} className="expense-item">
                  <div>
                    <h3>{expense.title}</h3>
                    <p>${expense.amount}</p>
                    <p className="category">{expense.category}</p>
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
          {lastDeleted && (
            <button className="undo-btn" onClick={handleUndo}>
              Undo Last Delete
            </button>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
