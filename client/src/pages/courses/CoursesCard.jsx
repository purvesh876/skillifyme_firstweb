import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
      {/* Course Image */}
      <img
        src={course.image}
        alt={course.name}
        className="w-full h-48 object-cover"
      />

      {/* Course Content */}
      <div className="p-5">
        {/* Price */}
        <div className="flex justify-end items-baseline mb-3">
          <span className="text-gray-400 line-through text-sm mr-2">
            ₹{course.originalPrice}
          </span>
          <span className="text-gray-900 font-bold text-lg">
            ₹{course.price}
          </span>
        </div>

        {/* Category & Discount */}
        <div className="flex justify-between items-center text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">
          <span>{course.category}</span>
          <span className="text-green-600 font-semibold">{course.discount}% OFF</span>
        </div>

        {/* Title */}
        <h3 className="text-gray-900 text-lg font-semibold mt-1 mb-3 h-16 overflow-hidden">
          {course.name}
        </h3>

        {/* View Details Button */}
        <Link
          to={`/course/${course.id}`}
          className="mt-2 inline-block w-full text-center bg-yellow-400 text-gray-900 py-2 rounded hover:bg-yellow-300 font-semibold transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
