// src/pages/blog/BlogPage.jsx
import React, { useState } from "react";
import BlogCard from "./BlogCard";
import BlogDetail from "./BlogDetail";
import blogData from "./BlogData";
import { Navigate, useNavigate } from "react-router-dom";

export default function BlogPage() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f9fafa] text-slate-100 px-6 py-12">
      {!selectedBlog ? (
        <>
          <h1 className="text-4xl font-bold text-center mb-10 text-[#002f27]">
            Our Latest Blogs
          </h1>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 p-5">
            {blogData.map((blog) => (
              <BlogCard key={blog.id} blog={blog} onClick={setSelectedBlog} />
            ))}
          </div>

            <button
              onClick={()=> navigate("/blog/blogcreate")}
              className="fixed bottom-7 right-7 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 
          text-white w-16 h-16 rounded-full shadow-lg pb-[8.2px]
          flex items-center justify-center text-5xl cursor-pointer
          hover:scale-110 hover:shadow-2xl transition-all duration-300 ease-in-out">
              +
            </button>
        </>
      ) : (
        <BlogDetail blog={selectedBlog} onBack={() => setSelectedBlog(null)} />
      )}
    </div>
  );
}
