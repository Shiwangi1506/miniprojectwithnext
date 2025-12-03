"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";

export default function Home(): React.ReactElement {
  const { data: session } = useSession();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

 
  const userRole = (session?.user as { role?: string })?.role;

  const registrationHref = useMemo(() => {
    if (session) {
      return "/registration";
    }
    return "/login"; 
  }, [session, userRole]);

  const faqs = [
    {
      question: "How do I book a service on UrbanSetGo?",
      answer:
        "Simply click 'Book Now', choose your required service, select your preferred date and time, and confirm your booking.",
    },
    {
      question: "Can I register as a professional?",
      answer:
        "Yes! Click on 'Register as a Professional' on the homepage to join our verified list of service providers.",
    },
    {
      question: "Is payment made online or offline?",
      answer:
        "We offer both options — you can pay securely online or choose to pay in cash after the service.",
    },
  ];

  const reviews = [
    {
      name: "Amit Sharma",
      feedback:
        "UrbanSetGo helped me find an electrician within 15 minutes! Professional and polite service.",
      rating: 5,
    },
    {
      name: "Neha Gupta",
      feedback:
        "Very easy to book and reliable professionals. The plumber was on time and fixed the issue quickly.",
      rating: 4,
    },
    {
      name: "Rahul Verma",
      feedback:
        "Excellent experience! The maid service was top-notch and the platform is user-friendly.",
      rating: 5,
    },
  ];

  const services = [
    {
      title: "Electrician",
      quote: "Switch On to Reliability.",
      img: "/image/electrician.jpg",
      desc: "Reliable electricians for safe repairs, quick installations, and bright solutions—powering your home and workplace with trust and care.",
    },
    {
      title: "Plumbers",
      quote: "Keeping Water Running Smoothly.",
      img: "/image/plumber.jpg",
      desc: "Reliable plumbers for quick repairs, pipe installations, and leak-free homes—keeping your water flowing smoothly.",
    },
    {
      title: "Maids",
      quote: "Your Trusted Hand for a Spotless Home.",
      img: "/image/maid.jpg",
      desc: "Professional maids providing reliable cleaning, organizing, and household care—keeping your home spotless and comfortable.",
    },
    {
      title: "Carpenters",
      quote: "From Vision to Precision—We Build It Right.",
      img: "/image/carpenter.jpg",
      desc: "Skilled carpenters delivering reliable, precise craftsmanship for custom furniture, repairs, and woodwork.",
    },
    {
      title: "Dance",
      quote: "Where Passion Meets Performance.",
      img: "/image/dance.jpg",
      desc: "Learn, perform, and express yourself with passion—dance classes for every level.",
    },
    {
      title: "AC Repairers",
      quote: "Expert Care for Your Cooling Needs.",
      img: "/image/ac.jpg",
      desc: "Expert AC repair and maintenance to keep your home and office cool and comfortable. Fast, reliable, and efficient service whenever you need it.",
    },
  ];

  return (
    <main className="bg-gradient-to-b from-[#f5f6f2]/95 to-[#e5eaee]/90 text-center min-h-screen">
      {/* 🟦 Full-width Hero Section */}
      <section className="w-full bg-[#a8c6d8] py-16 px-6 mt-6 text-center shadow-inner">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5EF] drop-shadow-sm">
            Welcome to <span className="text-[#1f2839]">UrbanSetGo</span>
          </h1>
          <p className="mt-3 text-lg text-[#1f2839]/90">
            Your one-stop platform for booking trusted workers.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link href="/services">
              <button className="bg-black font-medium text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-[#e61717] hover:scale-105 transition-transform duration-200">
                Book Now
              </button>
            </Link>

            <Link href={registrationHref}>
              <button className="border-2 border-[#e61717] font-medium text-[#e61717] px-6 py-2.5 rounded-lg hover:bg-[#e61717] hover:text-white hover:scale-105 transition-transform duration-200">
                Register as a Professional
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 🟨 Popular Services */}
      <section className="py-14 px-5 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-[#1A1A1A]">
          Our Popular Services
        </h2>
        <p className="text-center text-[#6B7280] mt-2 text-sm md:text-base">
          Reliable workers for your everyday needs
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
          {services.map((service, index) => (
            <Link
              href={`/book/${service.title.toLowerCase()}`}
              key={index}
              className="group bg-white/85 border border-[#E5E7EB] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:cursor-pointer"
            >
              <Image
                src={service.img}
                alt={service.title}
                width={400}
                height={160}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5 text-left">
                <h3 className="text-xl font-semibold text-[#1A1A1A] group-hover:text-[#e61717] transition-colors">
                  {service.title}
                </h3>
                <p className="italic text-gray-500 mt-1 text-sm">
                  “{service.quote}”
                </p>
                <p className="text-[#6B7280] mt-2 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🟩 Reviews */}
      <section className="bg-[#f0f4f8]/80 backdrop-blur-lg py-14 px-6 rounded-2xl max-w-5xl mx-auto shadow-inner">
        <h2 className="text-2xl font-semibold text-center text-[#1A1A1A]">
          What Our Customers Say
        </h2>
        <p className="text-center text-[#6B7280] mt-1 mb-6 text-sm md:text-base">
          Real experiences from our trusted users
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white/80 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all text-left"
            >
              <p className="text-gray-700 italic text-sm leading-relaxed">
                “{review.feedback}”
              </p>
              <div className="mt-3">
                <p className="font-medium text-[#1f2839] text-sm">
                  {review.name}
                </p>
                <p className="text-yellow-500 text-sm mt-1">
                  {"⭐".repeat(review.rating)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🟪 FAQ */}
      <section className="py-14 px-5 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-[#1A1A1A]">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-[#6B7280] mt-2 mb-6 text-sm md:text-base">
          Everything you need to know about using UrbanSetGo
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-4 bg-white/85 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-base text-[#1A1A1A]">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`transition-transform ${
                    openFAQ === index ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openFAQ === index && (
                <p className="text-gray-600 mt-2 text-sm text-left leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="text-black pb-10 text-center">
        <p className="text-base font-medium">
          ✅ Trusted by over thousands of people for daily life solutions.
        </p>
      </section>
    </main>
  );
}
