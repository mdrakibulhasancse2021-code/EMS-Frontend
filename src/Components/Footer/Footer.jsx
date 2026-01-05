

const Footer = () => {
  return (
    <footer className="bg-slate-50 pt-16 pb-8 px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold text-teal-600 mb-4">
            <div className="w-8 h-8 bg-teal-500 rounded-full" /> Hazira
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            The various services of the Hazira application streamline human resource management
            and play a crucial role in achieving your organization's desired goals.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Useful Links</h4>
          <ul className="text-slate-500 space-y-2 text-sm">
            <li>About Us</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <ul className="text-slate-500 space-y-2 text-sm">
            <li>Phone: 01967391554</li>
            <li>Email: info@mindorbital.com</li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-12 pt-8 border-t border-slate-200 text-slate-400 text-xs">
        © 2025 Mind Orbital Technologies Limited.
      </div>
    </footer>
  );
};

export default Footer;
