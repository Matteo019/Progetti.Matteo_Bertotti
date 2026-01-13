import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
    return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">                
            <span className="text-lg sm:text-xl md:text-2xl font-medium">
                <span className="text-white">Matteo</span>
                <span className="text-yellow-400">Bertotti</span>
            </span>

        {/*Navbar link*/}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a
             href="#profilo"
             className="text-white hover:text-yellow-200"
             >
                Chi sono
                </a>
            <a
             href="#comptec"
             className="text-white hover:text-yellow-200"
             >
                Skills
                </a>
            <a
             href="#progetti"
             className="text-white hover:text-yellow-200"
             >
                Progetti
                </a>
            <a
             href="#contatti"
             className="text-white hover:text-yellow-200"
             >
                Contatti
                </a>
            </div>
            <button
             className="md:hidden p-2 text-white hover:text-yellow-200"
             onClick={() => setMobileMenuIsOpen((prev) => !prev)}
             >
                {mobileMenuIsOpen ? (
                    <X className="w-5 h-5 sm:w-6 sm:h-6"/>
                ) : (
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6"/>
                )}
            </button>
                </div>
        </div>
        {mobileMenuIsOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 slide-in-from-top">
                    <a
                     href="#profilo"
                     className="text-white hover:text-yellow-200"
                     onClick={() => setMobileMenuIsOpen(false)}
                     >
                        Chi sono
                        </a>
                    <a
                     href="#comptec"
                     className="text-white hover:text-yellow-200"
                     onClick={() => setMobileMenuIsOpen(false)}
                     >
                        Skills
                        </a>
                    <a
                     href="#progetti"
                     className="text-white hover:text-yellow-200"
                     onClick={() => setMobileMenuIsOpen(false)}
                     >
                        Progetti
                        </a>
                    <a
                     href="#contatti"
                     className="text-white hover:text-yellow-200"
                     onClick={() => setMobileMenuIsOpen(false)}
                     >
                        Contatti
                        </a>
                </div>
        )}
    </nav>
    );
}
