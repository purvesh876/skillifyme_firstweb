import React, { useState, useEffect } from "react";
import { Search, ChevronDown, LayoutGrid, List } from "lucide-react";
import CourseCard from "./CoursesCard";
import { coursesData } from "./courseData";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(coursesData);

  // Filter courses whenever searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCourses(coursesData);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const newFilteredCourses = coursesData.filter(
        (course) =>
          course.name.toLowerCase().includes(lowerCaseSearch) ||
          course.category.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredCourses(newFilteredCourses);
    }
  }, [searchTerm]);

  const handleSearch = (e) => e.preventDefault();

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold self-start md:self-center text-gray-900">
            All Courses
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <form className="flex-grow md:flex-grow-0" onSubmit={handleSearch}>
              <div className="flex bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="bg-transparent py-2 px-4 w-full focus:outline-none text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-gray-100 p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Filters & View toggles */}
            <div className="flex gap-2 justify-between">
              <button className="flex items-center gap-2 bg-white py-2 px-4 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors">
                <span>Newly published</span>
                <ChevronDown size={16} />
              </button>
              <button
                className="bg-white p-3 rounded-lg text-gray-600 border border-gray-200 hover:bg-gray-100"
                title="Grid View"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                className="bg-white p-3 rounded-lg text-gray-400 border border-gray-200 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                title="List View"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Courses Grid */}
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center text-gray-500 mt-16">
              <h2 className="text-2xl font-semibold">No courses found</h2>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursesPage;
