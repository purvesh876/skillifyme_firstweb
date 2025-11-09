import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { coursesData } from "./courseData";
import { useCart } from "../../context/CartContext.jsx";
import toast from "react-hot-toast";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart(); 
  const [isInCart, setIsInCart] = useState(false);

  const course = coursesData.find((c) => c.id === parseInt(id));

  useEffect(() => {
    if (cart && course) {
      const exists = cart.some((item) => item.id === course.id);
      setIsInCart(exists);
    }
  }, [cart, course]);

  if (!course)
    return <h2 className="text-center text-red-500 mt-10">Course not found!</h2>;

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(course);
      toast.success(`${course.name} added to cart 🛒`);
      setIsInCart(true);
    }
  };

  const handleBuyNow = () => navigate("/checkout");

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-md my-8">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={course.image}
          alt={course.name}
          className="w-full md:w-1/2 h-72 object-cover rounded-lg shadow"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{course.name}</h1>
          <p className="text-gray-500 mb-2">{course.category}</p>
          <p className="text-gray-700 mb-4">{course.description}</p>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
            <span className="line-through text-gray-400">₹{course.originalPrice}</span>
            <span className="text-green-600 font-semibold">{course.discount}% OFF</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`px-6 py-2 rounded text-white font-semibold transition-colors ${
                isInCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-300"
              }`}
            >
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
            >
              Go to Cart
            </button>
            <a
              href="https://drive.google.com/file/d/1D66BJmite3XYv1pWLv61abH-6xz0ZSWJ/view"
              className="bg-gray-200 text-gray-900 px-6 py-2 rounded hover:bg-gray-300 font-semibold text-center"
            >
              Download Brochure
            </a>
          </div>
        </div>
      </div>

      {/* Syllabus */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Syllabus</h2>

        {course.syllabus?.map((week, idx) => (
          <div
            key={idx}
            className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{week.title}</h3>

            {/* Sections like Mon–Fri, Sat–Sun, Quiz */}
            {week.sections?.map((section, sIdx) => (
              <div key={sIdx} className="mb-3">
                <h4 className="text-md font-semibold text-gray-800 mb-1">{section.subTitle}</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {section.points.map((point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}

        {/* End-of-Month Deliverables */}
        {course.endOfMonth && (
          <div className="mt-6 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              End-of-Month Deliverables
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {course.endOfMonth.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
