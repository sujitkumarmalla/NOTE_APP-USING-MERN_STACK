import axios from "axios";
import React, { useEffect, useState } from "react";
import NoteModel from "./NoteModel";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);

  const location = useLocation();

  // ✅ FETCH NOTES
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login");
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";

      const { data } = await axios.get("/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allNotes = Array.isArray(data) ? data : data.notes || [];

      // ✅ FILTER NOTES
      const filteredNotes = search
        ? allNotes.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.description
                .toLowerCase()
                .includes(search.toLowerCase())
          )
        : allNotes;

      setNotes(filteredNotes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notes");
    }
  };

  // ✅ EDIT NOTE
  const handleEdit = (note) => {
    setEditNote(note);
    setIsModelOpen(true);
  };

  // ✅ SAVE NOTE
  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note._id === newNote._id ? newNote : note
        )
      );
    } else {
      setNotes((prev) => [...prev, newNote]);
    }

    setEditNote(null);
    setIsModelOpen(false);
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);

  // ✅ DELETE NOTE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login");
        return;
      }

      await axios.delete(`/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-600 to-slate-700 px-4 py-8">
      
      {/* ERROR MESSAGE */}
      {error && (
        <p className="text-red-400 mb-4 text-center">{error}</p>
      )}

      {/* NOTE MODAL */}
      <NoteModel
        isOpen={isModelOpen}
        onClose={() => {
          setIsModelOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />

      {/* ADD BUTTON */}
      <button
        onClick={() => setIsModelOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
      >
        +
      </button>

      {/* MAIN CONTENT */}
      <div className="flex-grow">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {notes.length === 0 ? (
            <p className="text-center text-gray-300 col-span-full">
              No notes found
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-5 rounded-xl shadow-lg hover:scale-105 transition"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {note.title}
                </h3>

                <p className="text-gray-300 mb-3">
                  {note.description}
                </p>

                <p className="text-sm text-gray-400 mb-4">
                  {note.updatedAt
                    ? new Date(note.updatedAt).toLocaleString()
                    : "No date"}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="bg-amber-500 px-3 py-1 rounded hover:bg-amber-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(note._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}

        </div>
      </div>

      {/* ⭐ FOOTER */}
      <footer className="mt-12 text-center text-gray-300 text-sm">
        <p>
          © {new Date().getFullYear()} Created by{" "}
          <span className="font-semibold text-white">
            Sujit
          </span>
        </p>
      </footer>
    </div>
  );
};

export default Home;
