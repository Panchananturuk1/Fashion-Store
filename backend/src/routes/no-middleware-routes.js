const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.json([{ id: 1, status: 'pending' }]);
});

router.get('/:id', function(req, res) {
  res.json({ id: parseInt(req.params.id), status: 'pending' });
});

router.post('/', function(req, res) {
  res.json({ message: 'Order created', id: 1 });
});

module.exports = router; 