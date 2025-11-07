// src/pages/blog/BlogDetail.jsx
import React from "react";

export default function BlogDetail({ blog, onBack }) {
  return (
    <div className="w-full  bg-[#ffffff] p-8  shadow-xl hover:shadow-[#c2c3c3] ">
      <button
        onClick={onBack}
        className="mb-6 bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-all"
      >
        ← Back
      </button>

      <img
        src={blog.image}
        alt={blog.title}
        className="w-full object-cover rounded-xl mb-6"
      />

      <h1 className="text-3xl font-bold text-[#313e3b] mb-2">{blog.title}</h1>
      <p className="text-[#828c8a] text-sm mb-6">
        👤 {blog.author} | ❤️ {blog.hearts}
      </p>

      <div className="text-[#4b5955] leading-relaxed text-lg">
        <p>{blog.excerpt}</p>
        <p className="mt-6 text-[#768c87]">
          This is placeholder content. Once Firebase is integrated, this will
          render the full blog body fetched from Firestore.
        </p>
      </div>
    </div>
  );
}
