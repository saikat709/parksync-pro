import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface PieChartCompProps {
    slotData: { name: string; value: number }[];
    availableSlots: number;
    totalSlots: number;
}

const SLOT_COLORS = [ '#4ade80', '#f87171' ];

const PieChartComp: React.FC<PieChartCompProps> = ({totalSlots, availableSlots, slotData}:PieChartCompProps) => {
    return (
        <>
            <div className="bg-white/5 p-6 pr-1 rounded-xl backdrop-blur-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Slot Availability</h3>
            <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                <Pie
                    data={slotData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    dataKey="value"
                    animationDuration={800}
                    >
                    {slotData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SLOT_COLORS[index]} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <p className="mt-1 text-center text-md">
                {availableSlots} of {totalSlots} slots available
            </p>
            </div>
        </>
    );
}

export default PieChartComp;