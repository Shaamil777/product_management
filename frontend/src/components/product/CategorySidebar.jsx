import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Trash2 } from 'lucide-react';

const CategorySidebar = ({
  categories = [],
  subCategories = [],
  selectedCategory,
  selectedSubCategory,
  onSelectCategory,
  onSelectSubCategory,
  onResetFilters,
  onDeleteCategory,
  onDeleteSubCategory,
  onAuthError,
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleExpand = (categoryId, e) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeSubCategories = Array.isArray(subCategories) ? subCategories : [];

  const getSubCategoriesForCategory = (categoryId) => {
    return safeSubCategories.filter(
      (sub) =>
        sub.category === categoryId ||
        sub.category?._id === categoryId ||
        sub.category?.id === categoryId
    );
  };

  return (
    <aside className="w-full lg:w-60 shrink-0 bg-white pr-4">
      <h2 className="text-[#003b5c] font-bold text-lg mb-4">Categories</h2>

      <button
        type="button"
        onClick={onResetFilters}
        className={`w-full text-left py-1.5 text-sm font-medium transition-colors ${
          !selectedCategory && !selectedSubCategory
            ? 'text-[#003b5c] font-bold'
            : 'text-slate-600 hover:text-[#003b5c]'
        }`}
      >
        All categories
      </button>

      <div className="mt-2 space-y-1">
        {safeCategories.map((cat) => {
          const isExpanded = expandedCategories[cat._id];
          const isSelected = selectedCategory === cat._id;
          const catSubCategories = getSubCategoriesForCategory(cat._id);

          return (
            <div key={cat._id} className="py-1 group">
              <div
                onClick={() => {
                  onSelectCategory?.(isSelected ? null : cat._id);
                  setExpandedCategories((prev) => ({
                    ...prev,
                    [cat._id]: !prev[cat._id],
                  }));
                }}
                className={`flex items-center justify-between cursor-pointer py-1 text-sm transition-colors ${
                  isSelected
                    ? 'text-[#003b5c] font-bold'
                    : 'text-slate-700 hover:text-[#003b5c]'
                }`}
              >
                <span>{cat.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const token = localStorage.getItem('token');
                      if (!token) {
                        onAuthError?.('Please login');
                        return;
                      }
                      onDeleteCategory?.(cat._id);
                    }}
                    className="p-1 text-slate-300 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(cat._id, e)}
                    className="p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && catSubCategories.length > 0 && (
                <div className="ml-4 mt-1 space-y-1 pl-2 border-l border-slate-100">
                  {catSubCategories.map((sub) => {
                    const isSubSelected = selectedSubCategory === sub._id;
                    return (
                      <div
                        key={sub._id}
                        className="flex items-center justify-between py-1 text-xs text-slate-600 hover:text-[#003b5c] w-full text-left group/sub"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSubCategory?.(isSubSelected ? null : sub._id);
                          }}
                          className="flex items-center gap-2.5 flex-1 text-left"
                        >
                          <div
                            className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors border ${
                              isSubSelected
                                ? 'bg-[#003b5c] border-[#003b5c] text-white'
                                : 'border-slate-300 bg-slate-50'
                            }`}
                          >
                            {isSubSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={isSubSelected ? 'font-semibold text-slate-900' : ''}>
                            {sub.name}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const token = localStorage.getItem('token');
                            if (!token) {
                              onAuthError?.('Please login');
                              return;
                            }
                            onDeleteSubCategory?.(sub._id);
                          }}
                          className="p-1 text-slate-300 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete subcategory"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default CategorySidebar;
