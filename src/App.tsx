import { Routes, Route } from "react-router-dom";

import Footer from "./views/Footer";
import TopBar from "./views/TopBar";

import Home from "./routes/Home";
import Movie from "./routes/Movie";
import Tv from "./routes/Tv";
import E404 from "./routes/E404";

function App() {
    return (
        <>
            <TopBar />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/movie/:id" element={<Movie />} />

                <Route path="/tv/:id" element={<Tv />} />

                <Route path="*" element={<E404 />} />
            </Routes>

            <Footer />
        </>
    )
}

export default App
