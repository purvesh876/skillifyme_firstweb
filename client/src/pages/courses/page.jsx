import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, LayoutGrid, List } from 'lucide-react';

const courseData = [
  {
    id: 1,
    image: 'https://placehold.co/600x400/556270/FFFFFF?text=Tech+Course',
    category: 'TECHNOLOGY',
    instructor: 'Colene Landin',
    title: 'Artificial intelligence and machine learning foundations',
    oldPrice: '50.00',
    newPrice: '45.00',
  },
  {
    id: 2,
    image: 'https://placehold.co/600x400/4ECDC4/FFFFFF?text=Math+Course',
    category: 'MATHEMATICS',
    instructor: 'Colene Landin',
    title: 'Essential math skills for data science and analysis',
    oldPrice: '50.00',
    newPrice: '45.00',
  },
  {
    id: 3,
    image: 'https://placehold.co/600x400/C7F464/333333?text=Business+Course',
    category: 'BUSINESS',
    instructor: 'Colene Landin',
    title: 'Effective communication and public speaking skills',
    oldPrice: '50.00',
    newPrice: '45.00',
  },
  {
    id: 4,
    image: 'https://placehold.co/600x400/FF6B6B/FFFFFF?text=Design+Course',
    category: 'DESIGN',
    instructor: 'John Doe',
    title: 'UI/UX Design Principles for Beginners',
    oldPrice: '60.00',
    newPrice: '49.99',
  },
  {
    id: 5,
    image: 'https://placehold.co/600x400/C44D58/FFFFFF?text=Marketing+Course',
    category: 'MARKETING',
    instructor: 'Jane Smith',
    title: 'Digital Marketing & SEO Fundamentals',
    oldPrice: '50.00',
    newPrice: '45.00',
  },
  {
    id: 6,
    image: 'https://placehold.co/600x400/34314C/FFFFFF?text=Finance+Course',
    category: 'FINANCE',
    instructor: 'Adam Beck',
    title: 'Personal Finance and Investment Strategy',
    oldPrice: '70.00',
    newPrice: '55.00',
  },
];

const CourseCard = ({ course }) => {
  return (
    // Card container
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      {/* Course Image */}
      <img 
        src={course.image} 
        alt={course.title} 
        className="w-full h-48 object-cover" 
      />
      
      {/* Course Content */}
      <div className="p-5">
        {/* Price */}
        <div className="flex justify-end items-baseline mb-3">
          <span className="text-gray-500 line-through text-sm mr-2">${course.oldPrice}</span>
          <span className="text-white font-bold text-lg">${course.newPrice}</span>
        </div>
        
        {/* Category & Instructor */}
        <div className="flex justify-between items-center text-xs text-gray-400 uppercase font-semibold tracking-wider">
          <span>{course.category}</span>
          <span>• {course.instructor}</span>
        </div>
        
        {/* Title (fixed height to align cards) */}
        <h3 className="text-lg font-semibold text-white mt-2 h-16">
          {course.title}
        </h3>
      </div>
    </div>
  );
};

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courseData);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCourses(courseData);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const newFilteredCourses = courseData.filter(course => 
        course.title.toLowerCase().includes(lowerCaseSearch) ||
        course.category.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredCourses(newFilteredCourses);
    }
  }, [searchTerm]); // This effect re-runs every time searchTerm changes

  const handleSearch = (e) => {
    e.preventDefault(); // Prevents the page from reloading on enter
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header: Title and Controls */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          
          {/* Left Side: Title */}
          <h1 className="text-4xl font-bold self-start md:self-center">
            All Courses
          </h1>

          {/* Right Side: Controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            
            {/* --- MODIFIED: Search Bar is now functional --- */}
            <form className="flex-grow md:flex-grow-0" onSubmit={handleSearch}>
              <div className="flex bg-gray-800 rounded-lg shadow-inner">
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  className="bg-transparent py-2 px-4 rounded-l-lg focus:outline-none w-full text-white"
                  // --- NEW: Controlled component ---
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-gray-700 p-3 rounded-r-lg text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
            
            {/* Filters & View Toggles (no changes here) */}
            <div className="flex gap-2 justify-between">
              <button className="flex items-center gap-2 bg-gray-800 py-2 px-4 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                <span>Newly published</span>
                <ChevronDown size={16} />
              </button>
              <button className="bg-gray-700 p-3 rounded-lg text-white" title="Grid View">
                <LayoutGrid size={20} />
              </button>
              <button className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" title="List View">
                <List size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* --- MODIFIED: Main Content: Courses Grid --- */}
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center text-gray-400 mt-16">
              <h2 className="text-2xl font-semibold">No courses found</h2>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}