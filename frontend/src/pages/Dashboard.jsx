import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]); // For authors
  const [allBlogs, setAllBlogs] = useState([]); // For admins
  const [users, setUsers] = useState([]); // For admins
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        // console.log(token)
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user profile
        const userResponse = await axios.get(
          "http://localhost:4000/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(userResponse.data.user);
        const role = userResponse.data.user.role;

        if (role === "author") {
          // Fetch only the author's blogs
          const blogsResponse = await axios.get(
            "http://localhost:4000/blog/user-blogs",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setBlogs(blogsResponse.data.blogs);
        } else if (role === "admin") {
          // Fetch all blogs
          const allBlogsResponse = await axios.get(
            "http://localhost:4000/blog/all-blogs",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAllBlogs(allBlogsResponse.data.blogs);

          // Fetch all users
          const usersResponse = await axios.get(
            "http://localhost:4000/user/all-users",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUsers(usersResponse.data.users);
        } else {
          // Readers can only see all blogs
          const allBlogsResponse = await axios.get(
            "http://localhost:4000/blog/all-blogs",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAllBlogs(allBlogsResponse.data.blogs);
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

      if (user.role === "admin") {
        setAllBlogs(allBlogs.filter((blog) => blog._id !== blogId));
      } else {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
      }
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

  const handleDeleteUser = async (userId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`http://localhost:4000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `http://localhost:4000/user/update-role/${userId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      console.log(response.data.message);
    } catch (error) {
      console.error(
        "Error updating role:",
        error.response?.data?.message || error.message
      );
    }
  };
  
//   const getAuthorName = async (authorId) => {
//   try {
//     const token = Cookies.get("token");
//     const response = await axios.get(`http://localhost:4000/user/${authorId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(response.data.name)
//     return response.data.name; // Axios returns `data` directly
//   } catch (error) {
//     console.error(error);
//     return "Unknown Author";
//   }
// };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : user ? (
        <div className="w-full max-w-4xl bg-white p-8 rounded shadow-md">
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
                  alt="Profile"
                />
              </div>
            </div>
          </div>
          {user.role === "author" || user.role === "admin"  && (
            <button
              onClick={handleAddBlog}
              className="mt-4 w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add New Blog
            </button>
          )}

          {/* Admin View: See all users and all blogs */}
          {user.role === "admin" && (
            <div>
              <h3 className="text-xl font-bold mt-6 mb-4">All Users</h3>
              <ul className="space-y-2">
                {users.map((u) => (
                  <li
                    key={u._id}
                    className="p-2 border-b border-gray-300 flex justify-between items-center"
                  >
                    <div>
                      {u.name} - <span className="font-semibold">{u.role}</span>
                    </div>
                    <div className="flex space-x-2">
                      <select
                        className="border p-1 rounded"
                        value={u.role}
                        onChange={(e) =>
                          handleUpdateRole(u._id, e.target.value)
                        }
                      >
                        <option value="reader">Reader</option>
                        <option value="author">Author</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-4">All Blogs</h3>
              <div className="space-y-4">
                {allBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="p-4 border border-gray-300 rounded shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold">{blog.title}</h4>
                      {/* <p className="text-gray-600">By: {(blog)=>getAuthorName(blog.author)}</p> */}
                      
                    </div>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author View: See only own blogs */}
          {user.role === "author" && blogs.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mt-6 mb-4">Your Blogs</h3>
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="p-4 border border-gray-300 rounded shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold">{blog.title}</h4>
                      <p className="text-gray-600">
                        Created at: {blog.createdAt.substr(0, 10)}
                      </p>
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

          {/* Reader View: See all blogs but no actions */}
          {user.role === "reader" && (
            <div>
              <h3 className="text-xl font-bold mt-6 mb-4">All Blogs</h3>
              <div className="space-y-4">
                {allBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="p-4 border border-gray-300 rounded shadow-sm"
                  >
                    <h4 className="font-bold">{blog.title}</h4>
                    <p className="text-gray-600">By: {blog.authorName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          
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
