import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Contact = () => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-6">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact Info */}
                <div className="space-y-8">
                    <h1 className="text-4xl font-bold text-white tracking-wide mb-6">Contact Us</h1>
                    <p className="text-white/80">
                        Have questions, need support, or want to collaborate? Reach out to us using the information below or fill out the contact form.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
                            <FaMapMarkerAlt className="text-white text-xl" />
                            <span className="text-white/80">
                                123 Company Street, Dhaka, Bangladesh
                            </span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
                            <FaPhoneAlt className="text-white text-xl" />
                            <span className="text-white/80">+880 1234 567 890</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
                            <FaEnvelope className="text-white text-xl" />
                            <span className="text-white/80">support@emscompany.com</span>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
                    <h2 className="text-3xl font-semibold text-white mb-6">Send a Message</h2>
                    <form className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="p-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="p-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                        />
                        <textarea
                            rows="5"
                            placeholder="Your Message"
                            className="p-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300 resize-none"
                        />
                        <button
                            type="submit"
                            className="mt-2 bg-white/30 hover:bg-white/50 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-2xl"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
