import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Route, Routes} from 'react-router';
import SecondPage from './Pages/SecondPage';
import Navbar from './Ui/Navbar';
import Backtracking from './Visualizers/Backtracking';
import SortingVisualizer from './Visualizers/SortingVisualizer';
import SearchingVisualizer from './Visualizers/SearchingVisualizer';
import GraphVisualizer from './Visualizers/GraphVisualizer';
import GreedyVisualizer from './Visualizers/GreedyVisualizer';
import DpVisualizer from './Visualizers/DpVisualizer';
import TreeVisualizer from './Visualizers/TreeVisualizer';
import MathVisualizer from './Visualizers/MathVisualizer';
import LinkedListVisualizer from './Visualizers/LinkedListVisualizer';
import StackVisualizer from './Visualizers/StackVisualizer';
import QueueVisualizer from './Visualizers/QueueVisualizer';
import ScrollToTop from './Ui/ScrollToTop';
import { Provider } from 'react-redux';
import  store  from './Stores/store';
import Home from './Pages/home';
import AlgorithmRace from './AlgorithmRace';
import RaceModeEntryUI from './RaceModeEntryUI';
function App(){
    return(
        <Provider store={store}>
        <Router>
            <ScrollToTop/>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/visualizer' element={<SecondPage/>}/>
                <Route path='/visualizer/sorting' element={<SortingVisualizer/>}/>
                <Route path='/visualizer/searching' element={<SearchingVisualizer/>}/>
                <Route path='/visualizer/dp' element={<DpVisualizer/>}/>
                <Route path='/visualizer/graph' element={<GraphVisualizer/>}/>
                <Route path='/visualizer/tree' element={<TreeVisualizer/>}/>
                <Route path='/visualizer/math' element={<MathVisualizer/>}/>
                <Route path='/visualizer/linked-List' element={<LinkedListVisualizer/>}/>
                <Route path='/visualizer/backTracking' element={<Backtracking/>}/>
                <Route path='/visualizer/greedy' element={<GreedyVisualizer/>}/>
                <Route path='/visualizer/stack' element={<StackVisualizer/>}/>
                <Route path='/visualizer/queue' element={<QueueVisualizer/>}/>
                <Route path='/RaceMode' element={<AlgorithmRace/>}/>
                <Route path='/RaceModeEntryUI' element={<RaceModeEntryUI/>}/>
            </Routes>
        </Router>
        </Provider>
    );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);