const path = require('path');
const history = require('connect-history-api-fallback');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;



app.use(history({
  verbose: true
}));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function(request, response) {
  response.sendFile(__dirname + 'index.web.js');
});

app.listen(PORT, error => (
  error
    ? console.error(error)
    : console.info(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
));