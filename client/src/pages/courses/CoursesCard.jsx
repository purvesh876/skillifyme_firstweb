import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4 bg-white">
      <img
        src={course.image}
        alt={course.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="mt-3 text-lg font-semibold">{course.name}</h3>
      <p className="text-gray-600 text-sm">{course.category}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xl font-bold text-blue-600">₹{course.price}</span>
        <span className="text-gray-400 line-through text-sm">
          ₹{course.originalPrice}
        </span>
        <span className="text-green-600 text-sm">({course.discount}% OFF)</span>
      </div>
      <Link
        to={`/course/${course.id}`}
        className="mt-3 inline-block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
};

export default CourseCard;
