import './App.css'
import Analysis from './components/Analysis'
import Footer from './components/Footer';
import Header from './components/Header'
import ParkingInfo from './components/ParkingInfo';


const infoData = [
  {
    title: 'Total zones',
    value: '1',
    colorClass: 'bg-gradient-to-tr from-purple-500 to-indigo-600',
  },
  {
    title: 'Occupied / Empty',
    value: '3 / 6',
    description: 'total zone 6',
    colorClass: 'bg-gradient-to-tr from-green-400 to-teal-500',
  },
  {
    title: 'Average fare',
    value: '12.5 Tk',
    colorClass: 'bg-gradient-to-tr from-yellow-400 to-orange-500',
  },
  {
    title: 'Average time',
    value: '20 Min',
    colorClass: 'bg-gradient-to-tr from-pink-500 to-red-500',
  },
];

function App() {

  return (
  <>
  <div
    className="flex flex-col justify-between items-center gap-4 min-w-screen min-h-screen
              bg-gradient-to-br from-gray-900 to-black"
              >
    <Header title="ParkSync.Pro" />
    <Analysis />
    <ParkingInfo info={infoData}/>
    <Footer />
  </div>

  </>
  )
}

export default App
