const path = require('path');
const history = require('connect-history-api-fallback');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: `http://localhost:${PORT}`,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(history({
  verbose: true,
    disableDotRule: true,
    htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
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
