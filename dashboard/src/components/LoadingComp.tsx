import Lottie from "lottie-react";
import paperAnimation from "../assets/Paperplane.json";
import type React from "react";
import type { LoadingProps } from "../libs/PropTypes";

const LoadingComp: React.FC<LoadingProps> = ({ shortened, className, size }: LoadingProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Lottie animationData={paperAnimation} 
              loop={true} 
              className={`${ shortened? `w-[size] h-[size]` : "w-72 h-72" }`} 
              />
      <h1 className="text-3xl font-bold text-gray-300 mt-0">Loading...</h1>
      <p className="text-gray-500">Please wait while we fetch the data.</p>
    </div>
  );
}

export default LoadingComp;