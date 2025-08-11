const EnterForm = ({onClose}) => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const zoneId = formData.get('zoneId') as string;

        onClose();
        console.log('Zone ID:', zoneId);
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-700 p-9 gap-2 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold">Track Parking Info</h2>
            <form className="flex flex-col gap-2 p-4" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center gap-4">
                    <label htmlFor="zoneId" className="text-lg font-semibold">Zone ID:</label>
                    <input placeholder="10000" 
                            type="text" 
                            id="zoneId" 
                            name="zoneId" 
                            required 
                            className="border-1 border-white p-2 rounded-lg text-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-34" 
                        />
                </div>
                
                <button type="submit" className="p-3 m-3 mt-6 mx-0 bg-blue-200 text-gray-600 rounded-xl">Enter</button>
            </form>
        </div>
    );
}

export default EnterForm;