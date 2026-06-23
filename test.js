const axios = require('axios');

axios.post('http://localhost:8080/api/budget/delete', { userId: 1, category: "Food" })
  .then(res => console.log(res.data))
  .catch(err => console.error(err.response ? err.response.data : err.message));
