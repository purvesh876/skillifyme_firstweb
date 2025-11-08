// src/pages/blog/BlogDetail.jsx
import React from "react";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaBehance } from "react-icons/fa6";
import blogData from "./BlogData";

export default function BlogDetail({ blog, onBack }) {
  // Get related posts (excluding the current one)
  const relatedPosts = blogData.filter((b) => b.id !== blog.id).slice(0, 3);

  return (
    <div className="w-full bg-white font-['Inter'] text-[#313e3b]">
      {/* HERO SECTION */}
      <div className="relative w-full h-[80vh] overflow-hidden rounded-b-2xl">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/30 to-transparent"></div>

        <div className="absolute bottom-16 left-10 max-w-3xl text-white">
          <p className="text-xl text-gray-300 mb-3">8 March 2024 • Business</p>
          <h1 className="text-5xl font-bold leading-tight mb-6">{blog.title}</h1>

          <div className="flex items-center space-x-4">
            <img
              src={blog.profilepic}
              alt={blog.author}
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <p className="text-lg font-medium">
              {blog.author} • ❤️ {blog.hearts}
            </p>
          </div>
        </div>
      </div>

      {/* BLOG CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-[#313e3b] leading-relaxed space-y-8">
          <p className="text-3xl font-semibold">{blog.excerpt}</p>

          <p className="text-[#828c8a] text-lg">
            This is placeholder content. Once Firebase is integrated, this will
            render the full blog body fetched from Firestore. You can use rich
            text or <b className="text-[#313e3b]">Markdown rendering</b> here
            for proper formatting.
          </p>

          <p className="text-[#828c8a] text-lg">
            Great blog posts start with great structure — visuals, clarity, and
            storytelling. Keep your paragraphs tight, your typography balanced,
            and always lead with a strong headline.
          </p>

          <img
            src={blog.image}
            alt={blog.title}
            className="rounded-xl w-full h-[500px] object-cover my-8"
          />

          <p className="text-[#828c8a] text-lg">
            Great blog posts start with great structure — visuals, clarity, and
            storytelling. Keep your paragraphs tight, your typography balanced,
            and always lead with a strong headline.
          </p>
        </div>

        {/* AUTHOR SECTION */}
        <div className="mt-20 bg-white shadow-sm rounded-xl p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 border border-gray-100">
          <img
            src={blog.profilepic}
            alt={blog.author}
            className="w-28 h-28 rounded-full object-cover shadow-md"
          />

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <h3 className="text-2xl font-semibold">{blog.author}</h3>
            <p className="text-[#7b8a87] leading-relaxed">{blog.authorBio}</p>
            <a
              href="#"
              className="text-[#313e3b] font-medium underline underline-offset-4 hover:text-black transition"
            >
              All author posts
            </a>
          </div>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex justify-center gap-8 mt-10 text-[#313e3b] text-2xl">
          <a href={blog.socials?.facebook} className="hover:text-black">
            <FaFacebookF />
          </a>
          <a href={blog.socials?.twitter} className="hover:text-black">
            <FaXTwitter />
          </a>
          <a href={blog.socials?.linkedin} className="hover:text-black">
            <FaLinkedinIn />
          </a>
          <a href={blog.socials?.behance} className="hover:text-black">
            <FaBehance />
          </a>
        </div>

        {/* RELATED POSTS SECTION */}
        <div className="mt-14 w-full font-['Inter'] bg-[#f3f8f8] p-10 rounded-2xl">
          <p className="text-center text-gray-500 text-2xl mb-2">
            You may also like
          </p>
          <h2 className="text-center text-4xl font-bold mb-12">
            Related posts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {relatedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <img
                      src={post.profilepic}
                      alt={post.author}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-[#313e3b]">By {post.author}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    ❤️ <span>{post.hearts}</span>
                  </div>
                </div>

                <div className="p-6 h-70">
                  <h3 className="text-2xl font-semibold mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-[#7b8a87] text-xl">
                    {post.excerpt.slice(0, 80)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
