const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = getNotes();
  newNote.id = generateUniqueId();
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const deleteId = parseInt(req.params.id); // Parse ID as integer
  const notes = getNotes();
  const updatedNotes = notes.filter((note) => note.id !== deleteId);
  saveNotes(updatedNotes);
  res.json(updatedNotes);
});

function getNotes() {
  const data = fs.readFileSync(path.join(__dirname, 'db', 'notes.json'), 'utf8');
  return JSON.parse(data) || [];
}

function saveNotes(notes) {
  fs.writeFileSync(path.join(__dirname, 'db', 'notes.json'), JSON.stringify(notes), 'utf8');
}

function generateUniqueId() {
  return Date.now();
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
