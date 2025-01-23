import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import debounce from "lodash.debounce";

const Home = () => {
  const [user, setUser] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const navigate = useNavigate();
  // console.log(import.meta.env.VITE_BACKEND_URL);
  useEffect(() => {
    console.log("useEffect called"); // Log when useEffect is triggered
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          return;
        }

        const response = await axios.get(`http://localhost:4000/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);

        const blogsResponse = await axios.get(
          `http://localhost:4000/blog/all-blogs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("Blogs fetched Success");
        setBlogs(blogsResponse.data.blogs);
        setFilteredBlogs(blogsResponse.data.blogs);
      } catch (err) {
        setError("Failed to load user data. Please log in again.");
        console.error(err);
        Cookies.remove("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim() === "") {
        setFilteredBlogs(blogs); // Reset to all blogs if search is cleared
      } else {
        const filtered = blogs.filter((blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredBlogs(filtered); // Set filtered blogs
      }
    }, 500), // Delay of 500ms after user stops typing
    [blogs], // Recreate debounced function if blogs change
  );

  const handleSearch = (event) => {
    const value = event.target.value;
    // console.log(value)
    setSearch(value);
    debouncedSearch(value); // Call debounced search function
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {!user ? (
        // User is not logged in: Show login and register buttons
        <div>
          <h1 className="text-4xl font-bold text-accent mb-6">
            Welcome to the Blogging Platform
          </h1>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-accent text-darkBackground py-2 px-4 rounded"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-accent text-darkBackground py-2 px-4 rounded"
            >
              Register
            </Link>
          </div>
        </div>
      ) : (
        // User is logged in: Show header, search bar, and blogs
        <div className="w-full max-w-4xl px-4">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-accent">All Blogs</h1>
            <button
              onClick={() => {
                Cookies.remove("token");
                navigate("/login");
                console.log("logout success");
              }}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Logout
            </button>
          </header>
          <div className="mb-4 text-white">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={handleSearch}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded"
            />
          </div>
          {filteredBlogs.length > 0 ? (
            <ul className="text-white">
              {filteredBlogs.map((blog, index) => (
                <li
                  key={blog.id || index}
                  className="p-4 border-b border-gray-200 text-left"
                >
                  <h2 className="text-xl font-bold">{blog.title}</h2>
                  <p>{blog.content.substring(0, 100)}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No blogs found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
