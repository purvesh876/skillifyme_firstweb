// src/pages/blog/BlogCard.jsx
import React from "react";

export default function BlogCard({ blog, onClick }) {
  return (
    <div
      onClick={() => onClick(blog)}
      className="cursor-pointer bg-[#ffffff] font-['Inter'] rounded-sm overflow-hidden shadow-lg hover:shadow-[#c3c3c3] hover:-translate-y-0.5 transform transition-all duration-300"
    >
    <div className="flex p-6 justify-between  text-[20px] font-bold">
          <div className="text-[#313e3b] flex gap-2 items-center">
            <img src={blog.profilepic} alt="profile_pic_blog" className="h-[50px] rounded-[100%]"/> 
            <span className="text-[#828c8a]">By-</span> {blog.author}</div>
          <div className="text-[#313e3b] m-2"> ❤️{blog.hearts}</div>
    </div>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-70 object-cover"
      />
      <div className="p-7 pt-6">
        <h3 className="text-[29px] font-semibold text-[#313e3b] mb-2">{blog.title}</h3>
        <p className="text-[#828c8a] text-[20px] mb-4">{blog.excerpt}</p>
      </div>
    </div>
  );
}
