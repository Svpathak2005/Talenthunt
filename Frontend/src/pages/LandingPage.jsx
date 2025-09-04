import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/animations.css';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const FloatingCard = ({ children, className = "" }) => (
    <div 
      className={`absolute bg-white/90 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-xl border border-white/20 ${className}`}
      style={{
        animation: `float 6s ease-in-out infinite`,
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out 0.4s both;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        .animate-delay-400 {
          animation-delay: 0.4s;
        }
        .animate-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>

      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center overflow-hidden">
        {/* Background with gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left Column - Text Content */}
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                  Transform Your Future with{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                    TalentHunt
                  </span>
                </h1>
                
                <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                  Connect with industry experts, accelerate your growth, and unlock endless possibilities through personalized mentorship
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                {[
                  { icon: '✓', text: 'Personalized Guidance' },
                  { icon: '✓', text: 'Industry Experts' },
                  { icon: '✓', text: 'Career Growth' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {feature.icon}
                    </div>
                    <span className="text-white/95 text-lg font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/login"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 text-center"
                >
                  Get Started Now
                </Link>
                <Link 
                  to="/signup"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className={`relative ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <div className="relative max-w-lg mx-auto">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur-3xl scale-110"></div>
                
                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="/images/mentorship.jpg"
                    alt="Mentorship" 
                    className="w-full h-auto rounded-3xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/fallback-mentorship.jpg";
                    }}
                  />
                </div>

                {/* Floating Cards */}
                <FloatingCard className="top-4 -right-4">
                  <span className="text-2xl">🎯</span>
                  <span className="ml-2 font-semibold text-gray-800">Expert Guidance</span>
                </FloatingCard>
                
                <FloatingCard className="-bottom-4 -left-4">
                  <span className="text-2xl">💡</span>
                  <span className="ml-2 font-semibold text-gray-800">Smart Learning</span>
                </FloatingCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '👨‍🏫', number: '500+', label: 'Active Mentors' },
              { icon: '👨‍🎓', number: '2000+', label: 'Students Mentored' },
              { icon: '🎯', number: '95%', label: 'Success Rate' },
              { icon: '🤝', number: '50+', label: 'Partner Companies' }
            ].map((stat, index) => (
              <div key={index} className={`text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-fade-in-up animate-delay-${index * 200}`}>
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose TalentHunt?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                image: "/images/expert-mentors.jpg",
                fallbackImage: "/images/fallback-mentors.jpg",
                emoji: "🎓",
                title: "Expert Mentors",
                description: "Connect with industry leaders from top companies who provide personalized guidance for your career growth",
                features: ["One-on-one mentoring sessions", "Industry-specific guidance", "Real-world project experience"]
              },
              {
                image: "/images/personalized-growth.jpg",
                fallbackImage: "/images/fallback-growth.jpg",
                emoji: "📈",
                title: "Personalized Growth",
                description: "Tailored mentorship programs designed to accelerate your learning journey",
                features: ["Customized learning paths", "Progress tracking", "Skill assessment"]
              },
              {
                image: "/images/global-network.jpg",
                fallbackImage: "/images/fallback-network.jpg",
                emoji: "🌐",
                title: "Global Network",
                description: "Join an active community of professionals and peers worldwide",
                features: ["Networking events", "Community forums", "Industry connections"]
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = feature.fallbackImage;
                    }}
                  />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center">
                    <span className="text-xl">{feature.emoji}</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-600">
                        <span className="text-purple-500 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-16">
            Success Stories
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                quote: "TalentHunt transformed my career path. My mentor helped me land my dream job at Google!",
                author: "Sarah J., Software Engineer"
              },
              {
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                quote: "The insights and guidance I received were invaluable. Best career decision ever!",
                author: "Michael R., Product Manager"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-full object-cover border-4 border-purple-500"
                  />
                  <div className="ml-4">
                    <div className="flex text-yellow-400 mb-1">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of successful professionals who started their journey with TalentHunt
          </p>
          <Link 
            to="/signup"
            className="inline-block px-10 py-5 bg-white text-purple-600 font-bold text-xl rounded-full shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default LandingPage;