import { Link } from "react-router";


const ErrorPage = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      {/* Glass Container */}
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center max-w-lg animate-fadeIn">
        <h1 className="text-9xl font-extrabold text-white mb-4 drop-shadow-lg">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-white/80 mb-6">
          Oops! The page you are looking for does not exist. It might have been removed or the URL is incorrect.
        </p>
        <Link
          to="/"
          className="bg-white/30 backdrop-blur-xl hover:bg-white/50 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
