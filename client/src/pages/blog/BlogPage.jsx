// src/pages/blog/BlogPage.jsx
import React, { useState } from "react";
import BlogCard from "./BlogCard";
import BlogDetail from "./BlogDetail";
import blogData from "./BlogData";

export default function BlogPage() {
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <div className="min-h-screen bg-[#fdfefe] text-slate-100 px-6 py-12">
      {!selectedBlog ? (
        <>
          <h1 className="text-4xl font-bold text-center mb-10 text-cyan-400">
            Our Latest Blogs
          </h1>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogData.map((blog) => (
              <BlogCard key={blog.id} blog={blog} onClick={setSelectedBlog} />
            ))}
          </div>
        </>
      ) : (
        <BlogDetail blog={selectedBlog} onBack={() => setSelectedBlog(null)} />
      )}
    </div>
  );
}
