// import { useState } from "react";
// import axios from "axios";

// const RegisterPage = () => {
//   const [name, setName] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [bio, setBio] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [role, setRole] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [profilePicture, setProfilePicture] = useState("");

//   // const uploadImageToS3 = async (file) => {
//   //   try {
//   //     const fileBuffer = await file.arrayBuffer(); // Convert the file to an ArrayBuffer
//   //     console.log(fileBuffer)
//   //     const response = await axios.post(
//   //       "http://localhost:5000/upload/profile",
//   //       fileBuffer,
//   //       {
//   //         headers: {
//   //           "Content-Type": file.type, // Set the Content-Type based on the file type
//   //         },
//   //       }
//   //     );

//   //     return response.data.imageUrl; // S3 Image URL returned from the backend
//   //   } catch (error) {
//   //     console.error("Failed to upload image to S3:", error);
//   //     setErrorMessage("Failed to upload profile picture.");
//   //     return null;
//   //   }
//   // };

//   const uploadImageToS3 = async (file) => {
//     try {
//       // Create FormData object and append the file
//       const formData = new FormData();
//       formData.append('profilePicture', file); // 'profilePicture' must match the backend field name
      
//       // console.log(formData)
//       // Send FormData to the server
//       const response = await axios.post(
//         "http://localhost:5000/upload/profile",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data", // Let axios set this automatically
//           },
//         }
//       );
  
//       return response.data.imageUrl; // S3 Image URL returned from the backend
//     } catch (error) {
//       console.error("Failed to upload image to S3:", error);
//       setErrorMessage("Failed to upload profile picture.");
//       return null;
//     }
//   };
  
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Basic form validation
//     if (!name || !username || !email || !password) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setErrorMessage("");

//       let uploadedImageUrl = "";
//       if (profilePicture) {
//         uploadedImageUrl = await uploadImageToS3(profilePicture);
//         if (!uploadedImageUrl) {
//           setLoading(false);
//           return; // Stop submission if upload fails
//         }
//       }

//       const userData = {
//         name,
//         username,
//         email,
//         password,
//         bio,
//         profilePicture: uploadedImageUrl || "",
//         dateOfBirth,
//         role,
//       };
//       console.log(userData);
//       const response = await axios.post(
//         "http://localhost:5000/register",
//         userData,
//       );

//       setLoading(false);

//       const data = await response.data;

//       if (data.message === "User registered successfully!") {
//         console.log("Registration successful!");
//         // Handle successful registration (e.g., redirect to login page)
//         setBlankDetails();
//         window.location.href = '/login';
//       } else {
//         setErrorMessage(data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//       setErrorMessage("Registration failed. Please try again later.");
//     }

//     const setBlankDetails = () => {
//       setName("");
//       setUsername("");
//       setEmail("");
//       setPassword("");
//       setBio("");
//       setDateOfBirth("");
//       setRole("");
//       setProfilePicture("");
//     };
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="bg-darkCard p-8 rounded-md shadow-md">
//         <h1 className="text-2xl font-bold text-accent mb-4">Register</h1>
//         {errorMessage && (
//           <div className="text-red-500 mb-4">{errorMessage}</div>
//         )}
//         {loading && <div className="text-center mb-4">Registering...</div>}

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Name"
//             className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Username"
//             className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Bio (Optional)"
//             className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
//             value={bio}
//             onChange={(e) => setBio(e.target.value)}
//           />
//           <input
//             type="file"
//             placeholder="Profile Picture (Optional)"
//             className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
//             onChange={(e) => setProfilePicture(e.target.files[0])} // Assuming single file upload
//           />
//           <input
//             type="date"
//             placeholder="Date of Birth (Optional)"
//             className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
//             value={dateOfBirth}
//             onChange={(e) => setDateOfBirth(e.target.value)}
//           />
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
//           >
//             <option value="">Select Role</option> {/* Default option */}
//             <option value="author">Author</option>
//             <option value="reader">Reader</option>
//           </select>

//           <button
//             className="w-full bg-accent text-darkBackground py-2 rounded"
//             disabled={loading}
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;


import { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const uploadImageToS3 = async (file) => {
    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append('file', file);
  
      // Send FormData to the server
      const response = await axios.post(
        'http://localhost:5000/upload/profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response)
      return response.data.newName; // S3 Image URL returned from the backend
    } catch (error) {
      console.error('Failed to upload image to S3:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic form validation
    if (!name || !username || !email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      let uploadedImageName = "";
      if (profilePicture) {
        uploadedImageName = await uploadImageToS3(profilePicture);
        if (!uploadedImageName) {
          setLoading(false);
          return; // Stop submission if upload fails
        }
      }
      console.log(uploadedImageName)

      const userData = {
        name,
        username,
        email,
        password,
        bio,
        profilePicture: uploadedImageName,
        dateOfBirth,
        role,
      };

      const response = await axios.post("http://localhost:5000/register", userData);

      setLoading(false);
      const data = await response.data;

      if (data.message === "User registered successfully!") {
        console.log("Registration successful!");
        // Handle successful registration
        setBlankDetails();
        window.location.href = '/login'; // Alternatively, use `useNavigate()` from react-router-dom
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrorMessage("Registration failed. Please try again later.");
    }
  };

  // Reset form fields
  const setBlankDetails = () => {
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setBio("");
    setDateOfBirth("");
    setRole("");
    setProfilePicture("");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-darkCard p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-accent mb-4">Register</h1>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        {loading && <div className="text-center mb-4">Registering...</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bio (Optional)"
            className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <input
            type="file"
            placeholder="Profile Picture (Optional)"
            className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
            onChange={(e) => setProfilePicture(e.target.files[0])} // Assuming single file upload
          />
          <input
            type="date"
            placeholder="Date of Birth (Optional)"
            className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 bg-darkBackground border border-darkText rounded"
          >
            <option value="">Select Role</option>
            <option value="author">Author</option>
            <option value="reader">Reader</option>
          </select>

          <button
            className="w-full bg-accent text-darkBackground py-2 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
