import Lottie from "lottie-react";
import paperAnimation from "../assets/Paperplane.json";
import type React from "react";
import type { LoadingProps } from "../libs/PropTypes";

const LoadingComp: React.FC<LoadingProps> = ({ shortened, className }: LoadingProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
     <Lottie
        animationData={paperAnimation}
        loop
        className={shortened ? "w-56 h-56" : "w-72 h-72"}
      />

     { !shortened && ( 
      <>
        <h1 className="text-3xl font-bold text-gray-300 mt-0">Loading...</h1>
        <p className="text-gray-500">Please wait while we fetch the data.</p> 
      </>)}
    </div>
  );
}

export default LoadingComp;