import React from 'react';
import {
    Clock,
    MapPin,
    Wifi,
    Coffee,
    ShieldCheck,
    Monitor,
    ArrowRight
} from 'lucide-react';

/**
 * StationPage Component
 * A layout highlighting various office 'stations' or service hubs.
 */
const Station = () => {
    const stations = [
        {
            id: 1,
            title: "Attendance Station",
            desc: "Biometric and RFID-enabled zones for seamless check-ins.",
            icon: <Clock className="w-8 h-8 text-teal-600" />,
            color: "bg-teal-50",
        },
        {
            id: 2,
            title: "Remote Hub",
            desc: "Virtual stations for hybrid teams to sync in real-time.",
            icon: <Wifi className="w-8 h-8 text-blue-600" />,
            color: "bg-blue-50",
        },
        {
            id: 3,
            title: "Wellness Zone",
            desc: "Break management and employee health tracking stations.",
            icon: <Coffee className="w-8 h-8 text-orange-600" />,
            color: "bg-orange-50",
        },
        {
            id: 4,
            title: "Security Point",
            desc: "Encrypted document vaults and sensitive data access points.",
            icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
            color: "bg-indigo-50",
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <section className="py-20 bg-slate-900 text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Service Stations</h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Integrated modules designed to streamline every touchpoint of your
                    organization's physical and digital workspace.
                </p>
            </section>

            {/* Stations Grid */}
            <section className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stations.map((station) => (
                        <StationCard key={station.id} {...station} />
                    ))}
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="max-w-6xl mx-auto mb-20 px-8">
                <div className="bg-teal-500 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between text-white">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-3xl font-bold mb-2">Ready to deploy a station?</h2>
                        <p className="opacity-90">Setup takes less than 10 minutes per location.</p>
                    </div>
                    <button className="bg-white text-teal-600 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition">
                        Get Started Now <ArrowRight size={20} />
                    </button>
                </div>
            </section>
        </div>
    );
};

/**
 * Sub-component for individual Station cards
 */
const StationCard = ({ title, desc, icon, color }) => {
    return (
        <div className="group p-8 rounded-2xl border border-slate-100 hover:border-teal-500 hover:shadow-xl transition-all duration-300">
            <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 mb-6 line-clamp-2">
                {desc}
            </p>
            <a href="#" className="text-teal-600 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                View Details <ArrowRight size={16} />
            </a>
        </div>
    );
};

export default Station;