import { useNavigate, useSearchParams } from "react-router-dom";
import LogsList from "../components/LogList";
import PaginationOption from "../components/PaginationOption";
import React, { useEffect } from "react";
import LoadingComp from "../components/LoadingComp";
import type { LogItem } from "../libs/ApiTypes";
import axios from "axios";

const getPaginationRange = (current: number, total: number) => {
    const visible = 5;
    let start = current - Math.floor(visible / 2);
    let end   = current + Math.floor(visible / 2);

    if (start < 1) {
        start = 1;
        end = Math.min(total, start + visible - 1);
    }

    if ( end > total) {
        end = total;
        start = Math.max(1, end - visible + 1);
    }

    console.log("Pagination Range:", { start, end, total }, (end < total));

    if ( end % 5 === 0 && end < total) {
        console.log("Adjusting pagination range for next page");
        end += 1;
        start += 1;
        console.log("Pagination Range:", { start, end, total }, (end < total));
    }

    return { start, end };
}


const apiUrl = import.meta.env.VITE_API_URL;

const LogsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const zone_id = searchParams.get('zone_id');
    const [ isLoading, setIsLoading] = React.useState(true);
    const [ currentPage, setCurrentPage ] = React.useState(1);
    const [ paginationInfo, setPaginationInfo ] = React.useState({
        currentPage: 1,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
    });
    const [ logsList, setLogsList] = React.useState<LogItem[]>([]);

    console.log("Zone ID from query params:", zone_id);
    const { start, end } = getPaginationRange(paginationInfo.currentPage, paginationInfo.totalPages);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${apiUrl}/log/?zone=${zone_id}&page=1&page_size=10`);
                const data = response.data;
                console.log("Logs fetched:", data.logs );
                setPaginationInfo({
                    ...paginationInfo,
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalItems: data.totalItems,
                    itemsPerPage: data.itemsPerPage,
                });
                setLogsList(data.logs);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, [currentPage, zone_id]);

    if ( isLoading ) return <LoadingComp />;

    return (
        <div className="w-[80%] mx-auto flex flex-col gap-4 items-center justify-center text-white">
            <h1 className="text-3xl font-bold my-3">Parking Logs</h1>
            <LogsList logs={logsList}/>
            <PaginationOption
                className="mt-5" 
                hasNext={currentPage < paginationInfo.totalPages} 
                hasPrevious={currentPage > 1}
                startPage={start} 
                endPage={end}
                currentPage={currentPage}
                onPageChange={(page) => {
                    setCurrentPage(page);
                    console.log("Page changed to:", page);
                }}
            />

            <div className="flex justify-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors transition-all transition-transform hover:scale-110 border border-blue-600 hover:border-blue-700 border-1"
                    onClick={() => {
                        navigate(-1);
                    }}>
                    Go Back
                    </button>
            </div>
        </div>
    );
}

export default LogsScreen;