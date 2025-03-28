import React, { useState } from "react";
import PoetHeader from "@/components/home/PoetHeader";

const ContestsPage = () => {
  const [contests] = useState([
    {
      id: 1,
      title: "غزل نویسی مقابلہ",
      description: "اپنی بہترین غزل پیش کریں اور جیتیں خصوصی انعامات!",
      date: "15 مارچ 2025",
      status: "Open",
    },
    {
      id: 2,
      title: "نظم نویسی چیلنج",
      description: "ایک خوبصورت نظم لکھیں اور اپنی شاعری کی صلاحیتوں کو نکھاریں۔",
      date: "20 مارچ 2025",
      status: "Closed",
    },
    {
      id: 3,
      title: "مشاعرہ مقابلہ",
      description: "اپنی شاعری کو آواز دیں اور مشاعرے کا حصہ بنیں۔",
      date: "25 مارچ 2025",
      status: "Open",
    },
  ]);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
      <PoetHeader />

      <div className="max-w-4xl mx-auto py-12">
        <h2 className="text-4xl font-bold text-center text-white mb-6">🏆 Poetry Contests</h2>
        <p className="text-center text-gray-300 mb-8">
          Participate in exciting Urdu poetry contests and showcase your talent.
        </p>

        {/* Contests List */}
        <div className="space-y-6">
          {contests.map((contest) => (
            <div
              key={contest.id}
              className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600"
            >
              <h3 className="text-2xl font-semibold text-white mb-2 font-urdu">{contest.title}</h3>
              <p className="text-gray-300 mb-2 font-urdu">{contest.description}</p>
              <p className="text-gray-400">📅 Date: {contest.date}</p>
              <p
                className={`mt-2 font-bold ${
                  contest.status === "Open" ? "text-green-400" : "text-red-400"
                }`}
              >
                {contest.status === "Open" ? "🟢 Contest Open" : "🔴 Contest Closed"}
              </p>

              {/* Buttons */}
              <div className="mt-4 flex gap-3">
                {contest.status === "Open" && (
                  <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                    Participate
                  </button>
                )}
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsPage;
