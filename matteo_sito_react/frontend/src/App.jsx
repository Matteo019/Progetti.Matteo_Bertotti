import Navbar from "./components/Navbar";
import Profilo from "./components/Profilo";
import Section1 from "./components/Section1";
import Formazione from "./components/Formazione";
import CompTec from "./components/CompTec";
import Progetti from "./components/Progetti";
import Certificati from "./components/Certificati";
import Contatti from "./components/Contatti";
import Footer from "./components/Footer";




function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar />
      <Profilo />
      <Section1 />
      <Formazione />
      <CompTec />
      <Progetti />
      <Certificati />
      <Contatti />
      <Footer />
    </div>
  );
}

export default App;