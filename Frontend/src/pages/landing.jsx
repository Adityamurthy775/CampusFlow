import Footer from "@/components/footer";
import Home from "@/components/home";
import Navbar from "@/components/navbar";

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}
