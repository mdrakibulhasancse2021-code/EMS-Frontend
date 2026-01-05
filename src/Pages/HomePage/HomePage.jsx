import {
    CheckCircle2,
    Clock,
    Users,
    CreditCard,
    FileText,
    ShieldCheck,
    Smartphone,
    Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const HomePage = () => {
    return (
        <div className="min-h-screen font-sans text-slate-800 bg-white">
         

            {/* --- Hero Section --- */}
            <header className="px-8 py-16 md:flex items-center justify-between max-w-7xl mx-auto">
                <div className="md:w-1/2 space-y-6">
                    <h1 className="text-5xl font-extrabold text-blue-950 leading-tight">
                        One Stop Solution For <br />
                        <span className="text-teal-500">Human Resource Management</span>
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Smart management of human resources can be a game changer for the success of your business.
                        Leave this crucial task in the capable hands of 'JR Management' with complete confidence!
                    </p>
                   <Link to={'/register'}>
                        <button className="bg-blue-900 text-white px-8 py-3 rounded-md shadow-lg hover:bg-blue-800 transition">
                            Register
                        </button>
                   </Link>
                </div>
                <div className="md:w-1/2 mt-12 md:mt-0 relative">
                    <div className="bg-teal-100 rounded-full w-96 h-96 absolute -z-10 blur-3xl opacity-50"></div>
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                        alt="Team working"
                        className="rounded-3xl shadow-2xl"
                    />
                </div>
            </header>

            {/* --- Features Section (Vertical Timeline) --- */}
            <section className="py-20 bg-slate-50">
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl font-bold text-blue-950">
                        Hazira's features will make your organization's <br />
                        human resources even more efficient!
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto space-y-24 px-8">
                    <FeatureItem
                        num="1"
                        title="Shift planning and management"
                        desc="Using Hazira's web application will simplify shift planning for your organization. Its user-friendly dashboard will make employee shift management more dynamic!"
                        icon={<Clock className="w-12 h-12 text-teal-500" />}
                        reverse={false}
                    />
                    <FeatureItem
                        num="2"
                        title="In-Out Time Clock"
                        desc="Hazira accurately records daily office time and work hours for your employees. The 'In-Out Time Clock' feature also allows for sharing office notices and instructions."
                        icon={<Users className="w-12 h-12 text-blue-500" />}
                        reverse={true}
                    />
                </div>
            </section>

     

           
        
        </div>
    );
};

// --- Sub-components ---

const FeatureItem = ({ num, title, desc, icon, reverse }) => (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
        <div className="md:w-1/2 space-y-4">
            <div className="flex items-center gap-4">
                <span className="bg-teal-100 text-teal-600 w-10 h-10 flex items-center justify-center rounded-lg font-bold">
                    {num}
                </span>
                <h3 className="text-2xl font-bold text-blue-950">{title}</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">{desc}</p>
        </div>
        <div className="md:w-1/2 flex justify-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            {icon}
        </div>
    </div>
);



export default HomePage;