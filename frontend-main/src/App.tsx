import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import About from './pages/About';
import Achievements from './pages/Achievements';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import Members from './pages/Members';
import Team from './pages/Team';

// Admin imports
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col bg-transparent z-0">
      <AnimatedBackground />
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow w-full relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/members" element={<Members />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
