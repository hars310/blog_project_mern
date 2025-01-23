import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const CreateBlogWithImages = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  //   const [user,setUser] = useState("")
  const navigate = useNavigate();

  const handleImageUpload = async (files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/upload/blog-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      //   console.log(response.data.uploadedImages)
      return response.data.uploadedImages; // Array of uploaded image names
    } catch (error) {
      console.error("Failed to upload images:", error);
      setError("Image upload failed. Please try again.");
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    let uploadedImageNames = [];
    if (images.length > 0) {
      uploadedImageNames = await handleImageUpload(images);
      if (uploadedImageNames.length === 0) {
        console.log("no images");
        return; // Stop submission if image upload fails
      }
    }
    // console.log(user)
    const blogData = {
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()), // Convert comma-separated tags to an array
      images: uploadedImageNames,
      //   userId: user._id // Pass the uploaded image names
    };
    // console.log(blogData)
    try {
      const token = Cookies.get("token");
      // console.log(token)
      await axios.post("http://localhost:4000/blog/create", blogData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Blog created successfully!");
      console.log("Blog created successfully!");
      setTitle("");
      setTags("");
      setImages("");
      setContent("");
      setError("");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Failed to create blog. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create a New Blog</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-4 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            className="w-full p-2 mb-4 border rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="w-full p-2 mb-4 border rounded"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <input
            type="file"
            multiple
            className="w-full p-2 mb-4"
            onChange={(e) => setImages(e.target.files)}
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogWithImages;
