import React from "react";

const EnterForm = ({onClose, onSubmit}) => {

    const [error, setError ] = React.useState<string| null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const parkingId = parseInt(formData.get('parkingId') as string);
        if ( !parkingId || parkingId < 10001 || parkingId > 99999 ){
            setError("Not a valid parking id.");
        } else {
            onSubmit(parkingId);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-700 p-6 gap-2 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold">Track Parking Info</h2>
            <form className="flex flex-col gap-2 p-4" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center gap-4">
                    <label htmlFor="zoneId" className="text-lg font-semibold">Parking ID:</label>
                    <input placeholder="10000" 
                        type="text" 
                        id="parkingId" 
                        name="parkingId" 
                        onChange={()=> {
                            setError(null)
                        }}
                        required 
                        className="border-1 border-white p-2 rounded-lg text-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-34" 
                    />
                </div>
                { error && <p className="text-sm text-center bg-red-200/70 font-normal w-full py-1"> {error} </p>}
                <button type="submit" className="p-3 m-2 mt-1 mx-0 bg-blue-200 text-gray-600 rounded-xl font-semibold hover:scale-105 transition-transform">Enter</button>
            </form>
        </div>
    );
}

export default EnterForm;