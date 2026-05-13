import { useState } from "react";
import JournalHeader from "@/components/JournalHeader";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import RightPanel from "@/components/RightPanel";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Все");

  return (
    <div className="min-h-screen bg-white">
      <JournalHeader />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          <Sidebar activeCategory={activeCategory} onSelect={setActiveCategory} />
          <Feed activeCategory={activeCategory} />
          <RightPanel />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
