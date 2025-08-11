import type React from "react";
import Right from '../assets/Right.svg';
import Left from '../assets/Left.svg';

type PaginationOptionProps = {
    className?: string;
}

const PaginationOption: React.FC<PaginationOptionProps> = ( {className}: PaginationOptionProps) => {
    return (
        <div className={ `w-full flex justify-between items-center ${className} `}>
            <button className="flex items-center gap-2 rounded-lg border border-white p-2 hover:bg-blue-500 hover:text-white transition-colorsh-10">
                <img src={Left} alt="Previous" className="w-4 h-4 bg-red-200 text-white" />
                Previous
            </button>
            <div className="flex gap-2">
                { Array.from({ length: 10 }, (_, i) => (
                    <button 
                        key={i + 1}
                        className="px-3 py-1 border-1 rounded hover:bg-blue-500 hover:text-white transition-colors h-10"
                    >
                        {i + 1}
                    </button>
                )) }
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-white p-2 hover:bg-blue-500 hover:text-white transition-colors h-10">
                Next
                <img src={Right} alt="Next" className="w-4 h-4" />
            </button>
        </div>
    )
}

export default PaginationOption;