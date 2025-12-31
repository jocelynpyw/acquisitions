import app from './app.js';
const PORT = process.env.PORT | 3000;

app.listen(PORT, () => {
  console.log(`The app is listening on port: http://localhost:${PORT}...`);
});
