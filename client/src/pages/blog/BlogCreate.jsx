import React, { useState } from "react";
import { db } from "../../lib/firebase"; // adjust path
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createRoutesFromChildren, Navigate, useNavigate } from "react-router-dom";

export const BlogCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // const [ImageFile,setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        date: "",
        author: "",
        image: "",
        content: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Blog submitted:", formData);

        try {
            setLoading(true);

            let imageUrl = formData.image;

            await addDoc(collection(db, "blogs"), {
                title: formData.title,
                category: formData.category,
                date: formData.date,
                author: formData.author,
                image: imageUrl,
                content: formData.content,
                createdAt: serverTimestamp(),
            });
            alert("✅ Blog successfully published!")
            navigate("/blog");
        } catch (error) {
            console.error("Upload Failed:", error);
            alert("❌ Something went wrong while publishing!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9fbfb] py-12 px-6 flex justify-center">
            <div className="max-w-3xl w-full bg-[#ffffff] shadow-lg rounded-2xl p-8">
                {/* Header */}
                <h2 className="text-3xl font-semibold text-[#313e3b] mb-6 text-center">
                    ✍️ Create New Blog Post
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Blog Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter your blog title"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Category and Date */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g. Business, Tech, Lifestyle"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Author Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Author Name
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Enter author name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Hero Image URL
                        </label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Paste image link here"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    {/* {Uplad hero image} */}
                    {/* <div>
                        <label className="block text-gray-700 font-medium mb-2">Upload Hero Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div> */}


                    {/* Content */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Blog Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="8"
                            placeholder="Write your blog content here..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200
                                ${loading? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                        >
                            {loading ? "Publishing..." : "Publish Blog"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};
