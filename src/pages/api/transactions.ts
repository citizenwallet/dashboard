import { NextApiRequest, NextApiResponse } from 'next';

// Example data for transactions
const transactions = [
  { id: 1, amount: 100, description: 'Transaction 1' },
  { id: 2, amount: -50, description: 'Transaction 2' },
  { id: 3, amount: 200, description: 'Transaction 3' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return all transactions
    res.status(200).json(transactions);
  } else if (req.method === 'POST') {
    // Create a new transaction
    const { amount, description } = req.body;
    const newTransaction = { id: Date.now(), amount, description };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}