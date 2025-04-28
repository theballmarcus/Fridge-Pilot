import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import background from '../../assets/keto.jpg';
import banner from '../../assets/banner.png';

export default function LandingPage() {
    console.log(background);
    const [_, setToken] = useState(null);
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            document.location.pathname = "/home";
        }
    }, []);
    
    return (
        <>
            <style>{`
            #root {
                max-width: unset !important;
            }
        `}</style>
            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <header className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
                        {/* Fixed Logo */}
                        <div className="absolute top-6 left-6">
                            <img src={banner} alt="FridgePilot Logo" className="h-10" />
                        </div>

                        {/* Centered Content */}
                        <h1 className="text-4xl md:text-6xl font-bold text-white">
                            Nem keto-diæt med <span className="text-primary">FridgePilot</span>
                        </h1>
                        <div className="flex gap-4 mt-6">
                            <Button size="lg" onClick={() => document.location.pathname = "/signup"}>Sign Up</Button>
                            <Button size="lg" onClick={() => document.location.pathname = "/login"}>Log In</Button>
                        </div>

                        {/* Wave SVG */}
                        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
                            <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-24">
                                <path d="M0.00,49.98 C150.00,150.00 349.99,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" fill="#f3f4f6" />
                            </svg>
                        </div>
                    </div>
                </header>

                {/* Product Highlights */}
                <section className="bg-gray-100 py-16 px-6">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-semibold mb-6">Hvad er FridgePilot?</h2>
                            <p className="mb-4 text-gray-700">
                                Få adgang til skræddersyede keto-planer, opskrifter og nem tracking.
                            </p>
                            <p className="mb-4 text-gray-700">
                                Optimer din kost med personlige anbefalinger og indkøbslister. Transformer din kost!
                            </p>
                        </div>
                        <div className="space-y-4">
                            <ul className="list-none space-y-2 text-left">
                                <li className="flex items-start">
                                    <span className="text-success mr-2">✔</span>
                                    Udarbejder en skræddersyet keto diæt baseret på dine fysiske data som vægt, højde og aktivitetsniveau.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-success mr-2">✔</span>
                                    Tilpasser måltider automatisk efter de ingredienser, du allerede har i dit køleskab, så intet går til spilde.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-success mr-2">✔</span>
                                    Finder manglende ingredienser i Salling-supermarkeder og foreslår køb, så du hurtigt kan færdiggøre dine måltider uden forvirring
                                </li>
                                <li className="flex items-start">
                                    <span className="text-success mr-2">✔</span>
                                    Justerer dine keto-måltider løbende for at sikre optimal makro- og mikronæringsstofbalance uden manuel tracking, og tillader cheat days
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
