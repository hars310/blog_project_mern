import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
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

        const response = await axios.get("http://localhost:4000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
        // console.log(response.data.user)
      } catch (err) {
        setError("Failed to load user data. Please log in again.");
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : user ? (
        <div className="w-full max-w-lg bg-white p-8 rounded shadow-md">
          <div className="flex flex-row justify-between">
            <div className="w-2/3">
              <h2 className="text-2xl font-bold ">
                Welcome, {user.name.split(" ")[0]}!
              </h2>
              <p className="text-gray-700 ">@{user.username}</p>
              <p className="text-gray-700 ">Bio: {user.bio}</p>
              <p className="text-gray-700 ">Email: {user.email}</p>
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

          <button
            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
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
