import axios from "axios";
import React, { useEffect, useState } from "react";

const NoteModel = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // ✅ Fill form when editing
  useEffect(() => {
    setTitle(note ? note.title : "");
    setDescription(note ? note.description : "");
    setError("");
  }, [note]);

  // ⭐ Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleCancel();
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // ✅ Cancel handler
  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setError("");
    onClose();
  };

  // ✅ Submit handler
  const handelSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login");
        return;
      }

      const payload = { title, description };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let data;

      if (note) {
        const res = await axios.put(
          `/api/notes/${note._id}`,
          payload,
          config
        );
        data = res.data;
      } else {
        const res = await axios.post(
          "/api/notes",
          payload,
          config
        );
        data = res.data;
      }

      onSave(data);

      setTitle("");
      setDescription("");
      setError("");
      onClose();
    } catch (error) {
      console.log("Note save error:", error);
      setError("Failed to save note");
    }
  };

  // ❌ Don't render if closed
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={handleCancel} // ⭐ click outside closes modal
    >
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          {note ? "Edit note" : "Create note"}
        </h2>

        {error && (
          <p className="text-red-400 mb-4">{error}</p>
        )}

        <form onSubmit={handelSubmit} className="space-y-5">
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Note Description"
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />

          <div className="flex space-x-2">
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700"
            >
              {note ? "Update" : "Create"}
            </button>

            {/* ✅ WORKING CANCEL BUTTON */}
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-3 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModel;
