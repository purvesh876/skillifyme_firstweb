// src/pages/blog/BlogCard.jsx
import React from "react";

export default function BlogCard({ blog, onClick }) {
  return (
    <div
      onClick={() => onClick(blog)}
      className="cursor-pointer bg-[#ffffff] rounded-2xl overflow-hidden shadow-lg hover:shadow-[#c3c3c3] hover:-translate-y-0.5 transform transition-all duration-300"
    >
    <div className="flex p-4 justify-between  text-lg font-bold">
          <span className="text-[#313e3b]">👤 <span className="text-[#828c8a]">By-</span> {blog.author}</span>
          <span className="text-[#313e3b]"> ❤️{blog.hearts}</span>
    </div>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-52 object-cover"
      />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[#313e3b] mb-2">{blog.title}</h3>
        <p className="text-slate-400 text-sm mb-4">{blog.excerpt}</p>
      </div>
    </div>
  );
}
