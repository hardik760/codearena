import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

export default function Dashboard() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState([]);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [solved, setSolved] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔥 Fetch Progress with Pagination
  const fetchProgress = async (pageNumber = 1, searchTerm = search) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5003/api/progress?page=${pageNumber}&limit=5&search=${searchTerm}`,
        {
          headers: { Authorization: token },
        }
      );

      setProgress(res.data.data);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);

    } catch (err) {
      console.error("Error fetching progress");
    }
  };
  // 🔥 Add Progress
  const handleAddProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5003/api/progress",
        { platform, solved },
        {
          headers: { Authorization: token },
        }
      );

      setPlatform("");
      setSolved("");

    } catch (err) {
      alert("Error adding progress");
    }
  };

  // 🔥 Delete Progress
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5003/api/progress/${id}`,
        {
          headers: { Authorization: token },
        }
      );

    } catch (err) {
      alert("Error deleting progress");
    }
  };

  // 🔥 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // 🔥 On Mount
  useEffect(() => {
    fetchProgress();

    socket.on("progress-updated", () => {
      fetchProgress(page);
    });

    return () => {
      socket.off("progress-updated");
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Progress</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Add Progress */}
      <div className="bg-gray-800 p-6 rounded mb-8">
        <h2 className="text-xl mb-4 font-semibold">Add Progress</h2>

        <input
          type="text"
          placeholder="Platform (LeetCode, Codeforces)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700 outline-none"
        />

        <input
          type="number"
          placeholder="Solved Count"
          value={solved}
          onChange={(e) => setSolved(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700 outline-none"
        />

        <button
          onClick={handleAddProgress}
          className="bg-green-600 px-6 py-2 rounded hover:bg-green-700"
        >
          Add Progress
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by platform..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchProgress(1, e.target.value);
          }}
          className="w-full p-3 rounded bg-gray-800"
        />
      </div>

      {/* Progress List */}
      <div>
        {progress.length === 0 ? (
          <p className="text-gray-400">No progress added yet.</p>
        ) : (
          progress.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 p-4 mb-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">
                  Platform: {item.platform}
                </p>
                <p className="text-gray-300">
                  Solved: {item.solved}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex gap-4 mt-6 items-center">
        <button
          disabled={page === 1}
          onClick={() => fetchProgress(page - 1)}
          className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => fetchProgress(page + 1)}
          className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}