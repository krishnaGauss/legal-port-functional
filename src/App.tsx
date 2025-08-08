import { useState } from "react";
import './App.css';
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import WhyChooseUs from "./components/WhyChooseUs";
import Advisors from "./components/Advisors";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";
import { auth } from "./lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    toast.success("Successfully logged in!");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully.");
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error("Failed to sign out.");
    }
  };

  return (
    <div className="app-container bg-gray-50">
      <Header
        user={user}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />
      <main>
        <Hero onAuthClick={() => setIsAuthModalOpen(true)} />
        <Stats />
        <WhyChooseUs />
        <Advisors />
        <CTA onAuthClick={() => setIsAuthModalOpen(true)} />
      </main>
      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}