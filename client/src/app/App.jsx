import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./index.css"
import Auth from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Header from "../widgets/Header.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Footer from "../widgets/Footer.jsx";
import QuestionsSection from "../widgets/QuestionsSection.js";
import Profile from "../pages/Profile/Profile.jsx";
import Interview from "../pages/Interview/Interview.jsx";
import Results from "../pages/Interview/Results.jsx";
import QuestionsPage from "../pages/Questions/QuestionsPage.jsx";
import TestTasks from "../pages/TestTasks.jsx";
import TestTask from "../entities/TestTaskCard.jsx";
import Roadmaps from "../pages/Roadmaps.jsx";
import Roadmap from "../entities/RoadmapCard.jsx";
import StartInterview from "../pages/Interview/StartInterview.jsx";
import Questions from "../pages/Questions/Questions.jsx";
// import Coding from "../pages/Сoding.jsx";
import { CodingPage } from "../pages/Coding/CodingPage.jsx";
import Coding from "../pages/Coding/Сoding.jsx";
import Subscription from "../pages/Subscription.jsx";

const App = () => {

  return (
    <div className="bg-[var(--bg-main)] text-black dark:text-white">
      <div className="sticky top-0 z-50 bg-[var(--bg-main)] border-b-3 border-b-[var(--color-accent)]">
        <div className="w-full max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
      </div>
      <div className="min-h-[100vh] w-full max-w-full sm:max-w-[640px] p-5 md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/startInterview" element={<StartInterview />} />
          <Route path="/baza_voprosov" element={<Questions />} />
          <Route path="/baza_voprosov/:tech" element={<QuestionsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/results" element={<Results />} />
          <Route path="/test-tasks" element={<TestTasks />} />
          <Route path="/test-tasks/:id" element={<TestTask />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/roadmaps/:tech" element={<Roadmap />} />
          <Route path="/coding" element={<Coding />} />
          <Route path="/coding/:id" element={<CodingPage />} />
        </Routes>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
