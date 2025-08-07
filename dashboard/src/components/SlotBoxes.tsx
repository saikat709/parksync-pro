interface SlotBoxProps {
    slots: number[],
}

const SlotBoxes: React.FC<SlotBoxProps> = ({slots}: SlotBoxProps ) => {
    return (
        <div className="flex flex-col items-center justify-center text-white">
            <h1 className="text-3xl font-bold mb-6">Slot Boxes</h1>
            <p className="text-lg mb-4">This page is under construction.</p>
            <p className="text-sm text-gray-400">Please check back later for updates.</p>
        </div>
    );
}

export default SlotBoxes;