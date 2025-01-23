import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user profile
        const userResponse = await axios.get(
          `http://localhost:4000/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setUser(userResponse.data.user);

        // Fetch only the user's blogs if the role is "author"
        if (userResponse.data.user.role === "author") {
          const blogsResponse = await axios.get(
            `http://localhost:4000/blog/user-blogs`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setBlogs(blogsResponse.data.blogs);
          // console.log(blogsResponse.data.blogs)
        }
      } catch (err) {
        setError("Failed to load data. Please log in again.");
        console.error(err);
        Cookies.remove("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`http://localhost:4000/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId)); // Use _id if your backend uses it

    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const handleAddBlog = () => {
    navigate("/create-blog");
  };

  const handleEditBlog = (blogId) => {
    navigate(`/edit-blog/${blogId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : user ? (
        <div className="w-full max-w-3xl bg-white p-8 rounded shadow-md">
          <div className="flex flex-row justify-between">
            <div className="w-2/3">
              <h2 className="text-2xl font-bold">
                Welcome, {user.name.split(" ")[0]}!
              </h2>
              <p className="text-gray-700">@{user.username}</p>
              <p className="text-gray-700">Bio: {user.bio}</p>
              <p className="text-gray-700">Email: {user.email}</p>
              <p className="text-gray-700 mb-4">
                DOB: {user.dateOfBirth.substr(0, 10)}
              </p>
              <p className="text-gray-700 mb-4">Role: {user.role}</p>
            </div>
            <div className="w-1/3 flex justify-center">
              <div className="overflow-hidden w-36">
                <img
                  className="rounded-full w-20"
                  src={`${import.meta.env.VITE_AWS_S3_URL}/${user.profilePicture}`}
                  alt=""
                />
              </div>
            </div>
          </div>

          {blogs.length > 0 && user.role === "author" && (
            <div>
              <h3 className="text-xl font-bold mt-6 mb-4">Your Blogs</h3>
              <div className="space-y-4">
                {blogs.map((blog, index) => (
                  <div
                    key={blog._id || index}
                    className="p-4 border border-gray-300 rounded shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold">{blog.title}</h4>
                      <p className="text-gray-600">Created at: {blog.createdAt.substr(0,10)}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditBlog(blog._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={handleAddBlog}
            className="mt-4 w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add New Blog
          </button>
          <button
            className="w-full mt-8 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Dashboard;
