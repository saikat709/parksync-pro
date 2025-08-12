import type React from "react";
import Right from '../assets/Right.svg';
import Left from '../assets/Left.svg';
import type { PaginationOptionProps } from "../libs/PropTypes";

const PaginationOption: React.FC<PaginationOptionProps> = ( 
    { className, hasNext, hasPrevious, startPage = 1, endPage= 5, currentPage, onPageChange }: PaginationOptionProps
) => {
    const getButtonClass = (isActive: boolean) => {
        return `px-3 py-1 border-2 rounded ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white ' : 'bg-gray-300 text-gray-700'} transition-colors h-10 flex items-center gap-2 rounded-lg border border-white p-2 transition-colorsh-10`;
    };

    return (
        <div className={ `w-full flex justify-between items-center ${className} `}>
            <button 
                className={getButtonClass(hasPrevious || false)} 
                disabled={!hasPrevious}
                onClick={() => {
                    if (onPageChange) onPageChange( (currentPage || 0) - 1)
                }}
                >
                <img src={Left} alt="Previous" className="w-4 h-4" />
                Previous
            </button>
            <div className="flex gap-2">
                { Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                    const pageNumber = i + startPage;
                    return <button 
                        key={pageNumber}
                        onClick={() => {
                            if (onPageChange)  onPageChange(pageNumber)
                        }}
                        className={`px-3 py-1 border-1 rounded hover:bg-blue-500 hover:text-white transition-colors h-10 ${currentPage == pageNumber ? "bg-blue-500 hover:text-white" : ""} `}
                        >
                            {i + 1}
                        </button>
                    }
                ) }
            </div>
            <button 
                className={getButtonClass(hasNext || false)}
                disabled={!hasNext}
                onClick={() => {
                    // console.log("Next button clicked, current page:", currentPage);
                    if (onPageChange) onPageChange( (currentPage || 0) + 1)
                }}
                >
                Next
                <img src={Right} alt="Next" className="w-4 h-4" />
            </button>
        </div>
    )
}

export default PaginationOption;