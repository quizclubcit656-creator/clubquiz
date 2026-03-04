import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-primary border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <span className="text-dark-primary font-bold text-xl">Q</span>
              </div>
              <span className="text-xl font-bold text-white">Quiz Club CIT</span>
            </div>
            <p className="text-gray-200 text-sm">
              Igniting minds through knowledge, fostering curiosity, and building champions.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-200 hover:text-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-200 hover:text-gold transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-200 hover:text-gold transition-colors text-sm">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-gray-200 hover:text-gold transition-colors text-sm">
                  Achievements
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-200 text-sm">
                <Mail size={16} className="mr-2 text-gold" />
                quizclub@cit.edu
              </li>
              <li className="flex items-center text-gray-200 text-sm">
                <Phone size={16} className="mr-2 text-gold" />
                +91 1234567890
              </li>
              <li className="flex items-center text-gray-200 text-sm">
                <MapPin size={16} className="mr-2 text-gold" />
                CIT Campus, Coimbatore
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/citquizclub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-dark-secondary hover:bg-gold flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram size={20} className="text-gray-200 hover:text-dark-primary" />
              </a>
              <a
                href="https://www.linkedin.com/company/quiz-club-qc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-dark-secondary hover:bg-gold flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={20} className="text-gray-200 hover:text-dark-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-200">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span>@Cit Quiz Club. All rights reserved.</span>
              <span className="mt-1">Developed by Strategic knights</span>
            </div>
            <Link to="/admin" className="mt-4 md:mt-0 hover:text-gold transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
