import React, { useEffect } from "react";
import Analysis from "../components/Analysis";
import LogsList from "../components/LogList";
import ParkingInfo from "../components/ParkingInfo";
import Zones from "../components/Zones";
import useWebSocket from "../hooks/useWebSocket";
import type { LogItem } from "../libs/ApiTypes";
import axios from "axios";
import LoadingComp from "../components/LoadingComp";


const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
    const { onMessage } = useWebSocket();
    onMessage(( msg ) => {
        console.log("<Home> Received message:", msg);
    });

    const [ logsList, setLogsList] = React.useState<LogItem[]>([]);
    const [ isLoading, setIsLoading] = React.useState(true);
    const [ analysisData, setAnalysisData] = React.useState<AnalyserNode| null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${apiUrl}/log/?zone=all&page=1&page_size=6`);
                const data = response.data;
                console.log("Logs fetched:", data.logs );
                setLogsList(data.logs);

                const analysisResponse = await axios.get(`${apiUrl}/analysis`);
                setAnalysisData(analysisResponse.data);
                console.log("Analysis data fetched:", analysisResponse.data);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if ( isLoading ) return <LoadingComp />;
    
    return (
        <div className="flex-1 w-[100%]">
            <Analysis pieData={{availableSlots: 1, totalSlots: 3}} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-between items-top px-4 py-3 mx-auto">
              <ParkingInfo />
              <Zones />
            </div>
            <LogsList hasMore logs={logsList}/>
        </div>
    );
}

export default Home;