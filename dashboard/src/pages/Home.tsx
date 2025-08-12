import React, { useEffect } from "react";
import Analysis from "../components/Analysis";
import LogsList from "../components/LogList";
import ParkingInfo from "../components/ParkingInfo";
import Zones from "../components/Zones";
import useWebSocket from "../hooks/useWebSocket";
import type { LogItem, OverallDataType } from "../libs/ApiTypes";
import axios from "axios";
import LoadingComp from "../components/LoadingComp";
import type { AnalysisDataType } from "../libs/PropTypes";


const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
    const { onMessage } = useWebSocket();
    onMessage(( msg ) => {
        console.log("<Home> Received message:", msg);
    });

    const [ logsList, setLogsList] = React.useState<LogItem[]>([]);
    const [ isLoading, setIsLoading] = React.useState(true);
    const [ analysisData, setAnalysisData] = React.useState<AnalysisDataType| null>(null);
    const [ overallData, setOverallData] = React.useState<OverallDataType| null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                
                const response = await axios.get(`${apiUrl}/log/?zone=all&page=1&page_size=6`);
                const data = response.data;
                setLogsList(data.logs);

                const analysisResponse = await axios.get(`${apiUrl}/analysis`);
                setAnalysisData(analysisResponse.data);

                const overallResponse = await axios.get(`${apiUrl}/overall`);
                setOverallData(overallResponse.data);
                console.log("Overall Data:", overallResponse.data);

            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if ( isLoading ) return <LoadingComp />;

    // console.log("Analysis Data:", analysisData?.barData);
    
    return (
        <div className="flex-1 w-[100%]">
            <Analysis pieData={analysisData?.pieData} barData={analysisData?.barData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-between items-top px-4 py-3 mx-auto">
              <ParkingInfo 
                totalSlots={overallData?.total_slots} 
                availableSlots={overallData?.available_slots} 
                averageFare={overallData?.average_fare} 
                averageTime={overallData?.average_time}
                />
              <Zones totalSlots={overallData?.zone_a1?.total_slots} availableSlots={overallData?.zone_a1?.available_slots}/>
            </div>
            <LogsList hasMore logs={logsList}/>
        </div>
    );
}

export default Home;