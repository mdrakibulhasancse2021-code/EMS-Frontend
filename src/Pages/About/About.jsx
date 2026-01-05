
import { FaArrowRight } from "react-icons/fa";

const About = () => {
    const features = [
        {
            title: "Employee Management",
            description:
                "Easily add, edit, and manage employee information, roles, and departments with a user-friendly interface.",
        },
        {
            title: "Attendance Tracking",
            description:
                "Monitor daily check-ins, check-outs, and working hours to ensure accurate attendance records.",
        },
        {
            title: "Leave & Payroll",
            description:
                "Approve leave requests, track leave balance, and manage salaries with automated calculations.",
        },
        {
            title: "Reports & Dashboard",
            description:
                "Generate insightful reports and visualize data using charts, graphs, and summary cards for quick decisions.",
        },
    ];

    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full space-y-10">
                {/* Page Header */}
                <div className="text-center text-white mb-6">
                    <h1 className="text-4xl font-bold tracking-wide mb-2">About EMS</h1>
                    <p className="text-white/80 text-lg">
                        Employee Management System simplifies HR tasks, attendance, payroll, and more.
                    </p>
                </div>

                {/* Glassy Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 hover:scale-105 transition-transform duration-300"
                        >
                            {/* Arrow Icon */}
                            <FaArrowRight className="absolute -left-5 top-1/2 -translate-y-1/2 text-white text-xl" />

                            <h2 className="text-white text-2xl font-semibold mb-2">{feature.title}</h2>
                            <p className="text-white/80 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
