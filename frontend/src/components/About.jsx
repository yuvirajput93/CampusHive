import React from 'react';
import { FiUsers, FiEdit, FiCalendar } from 'react-icons/fi';

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700 transition hover:-translate-y-2">
    <div className="text-purple-400 mb-4">{icon}</div>
    <h3 className="font-bold text-xl text-white mb-2">{title}</h3>
    <p className="text-gray-300">{children}</p>
  </div>
);

function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">What is CampusHive?</h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          CampusHive is more than just a social network; it's the digital heartbeat of our campus community.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<FiUsers size={32} />} title="Connect with Peers">
            Find and connect with students from your branch, discipline, or across the entire campus. Build your network.
          </FeatureCard>
          <FeatureCard icon={<FiEdit size={32} />} title="Share Knowledge">
            Upload and share notes, assignments, and resources. Help others and get help when you need it most.
          </FeatureCard>
          <FeatureCard icon={<FiCalendar size={32} />} title="Stay Updated">
            Never miss an event. From tech fests to cultural nights, stay informed about everything happening on campus.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

export default About;