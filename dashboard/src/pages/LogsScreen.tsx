import LogsList from "../components/LogList";
import PaginationOption from "../components/PaginationOption";

const LogsScreen: React.FC = () => {
    return (
        <div className="w-[80%] mx-auto flex flex-col gap-4 items-center justify-center text-white">
            <h1 className="text-3xl font-bold mb-3">Parking Logs</h1>
            <LogsList />
            <PaginationOption className="mt-5"/>
        </div>
    );
}

export default LogsScreen;