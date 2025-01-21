import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
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
    </div>
  );
};
export default Home;
