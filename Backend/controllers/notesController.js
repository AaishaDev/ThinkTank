const Note = require("../model/Note");

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.body.user });

    if (!notes) {
      return res.status(204).json({ message: "No notes found" });
    }
    res.json({
      notes: notes.map((note) => ({
        id: note._id,
        title: note.title,
        content: note.content,
        isFavorite: note.isFavorite,
        username: req.body.username,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving notes" });
  }
};

const createNewNote = async (req, res) => {
  const { title, content, user } = req.body;
  if (!title || !content)
    return res.status(400).json({ message: "Title and content are required." });

  try {
    //create and store the new user
    const result = await Note.create({
      title,
      content,
      user,
    });

    res.status(201).json({ success: `New note ${result.title} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markFavorite = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.isFavorite = !note.isFavorite;
    await note.save();

    const notes = await Note.find({ user: req.body.user });
    res.json({
      notes: notes.map((note) => ({
        id: note._id,
        title: note.title,
        content: note.content,
        isFavorite: note.isFavorite,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const deleteNote = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Invalid Id" });

  try {
    const result = await Note.findByIdAndRemove(id);
    if (!result) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
const editNote = async (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;

  try {
    const note = await Note.findByIdAndUpdate(
      noteId,
      { title, content },
      {
        new: true, // return the updated note instead of the old one
      }
    );

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const username = (req, res) => {
  res.status(200).json({ username: req.body.username });
};
module.exports = {
  createNewNote,
  getAllNotes,
  markFavorite,
  deleteNote,
  editNote,
  username,
};
