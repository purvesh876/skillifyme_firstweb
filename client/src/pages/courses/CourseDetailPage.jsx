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

  const handleBuyNow = () => {
    navigate("/checkout");
  };

  return (
    <div className="p-8 flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
      <img
        src={course.image}
        alt={course.name}
        className="w-full md:w-1/2 h-72 object-cover rounded"
      />

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
        <p className="text-gray-600 mb-4">{course.category}</p>
        <p className="mb-4">{course.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-blue-600">₹{course.price}</span>
          <span className="line-through text-gray-400">₹{course.originalPrice}</span>
          <span className="text-green-600">({course.discount}% OFF)</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={isInCart} 
            className={`px-6 py-2 rounded text-white ${
              isInCart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-900"
            }`}
          >
            {isInCart ? "Added to Cart ✅" : "Add to Cart"}
          </button>

          <button
            onClick={handleBuyNow}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
