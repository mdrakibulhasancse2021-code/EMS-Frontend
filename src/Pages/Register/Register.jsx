import { Link } from "react-router";
import companyImage from "../../assets/login.jpg";

const Register = () => {
    return (
        <div
            className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: `url(${companyImage})` }}
        >
            {/* Overlay for darker background */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Glass Container */}
            <div className="relative z-10 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-96 animate-fadeIn">
                <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wider">
                    Welcome Back
                </h2>

                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="p-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="p-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                    />

                    {/* Optional Role Selection */}
                    <select
                        className="p-3 rounded-xl bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                    >
                        <option value="">Select Role</option>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        <option value="hr">HR / Manager</option>
                    </select>

                    <button
                        type="submit"
                        className="mt-4 bg-white/30 hover:bg-white/50 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-2xl"
                    >
                        Register
                    </button>
                </form>

                <p className="text-white/70 text-center mt-6 text-sm">
                    Already have an account?{" "}
                    <span className="underline cursor-pointer hover:text-white transition duration-200">
                        <Link to={'/login'} >
                            Login</Link>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
