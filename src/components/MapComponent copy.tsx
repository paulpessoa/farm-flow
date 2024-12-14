import React from 'react';

interface PaginationProps {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = (
    { currentPage,
        totalPages,
        onPageChange }
) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center space-x-2 my-4">
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`
              px-4 py-2 border rounded 
              ${currentPage === number
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }
            `}
                >
                    {number}
                </button>
            ))}
        </div>
    );
};