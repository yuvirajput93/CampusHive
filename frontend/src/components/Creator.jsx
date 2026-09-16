import React from 'react'

import creatorImage from '../assets/creator.jpg';
function Creator() {
  return (
    <section id="creator" className="py-20 px-4 bg-gray-900/70">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">From the Creator</h2>
        <div className="mt-8 flex flex-col items-center">
          {/* Replace with your actual image URL */}
          <img 
            src={creatorImage} 
            alt="Creator" 
            className="w-64 h-64 rounded-full object-cover border-4 border-purple-500"
          />
          {/* Replace with your name */}
          <h3 className="text-2xl font-bold text-white mt-6">Rohit Guleria</h3>
          <p className="text-purple-400">Full Stack Developer | Student</p>
          <p className="mt-4 text-gray-300 max-w-xl">
            "I built CampusHive to create a unified digital space for our college. My goal is to foster better communication, collaboration and fun(this part coming soon😉) among students. I hope you find it useful!"
          </p>
        </div>
      </div>
    </section>
  );
}

export default Creator;