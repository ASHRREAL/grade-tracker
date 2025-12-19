"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Code,
  Presentation,
  Coffee,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EventsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const upcomingEvents = [
    {
      id: "prog-workshop-2024",
      title: "Programming Workshop",
      date: "October 28, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "",
      description: "",
      category: "Workshop",
      attendees: 30,
      icon: Code,
      color: "bg-[#CE0E2D]",
      registration: true,
      registrationLink: "https://www.ashrreal.dev",
    },
    {
      id: "tech-talk-fun-projects",
      title: "Tech Talk: Fun Projects",
      date: "November 15, 2024",
      time: "7:00 PM - 8:30 PM",
      location: "War Memorial Hall",
      description:
        "Fellow students present their cool tech projects and share what they've learned.",
      category: "Learning",
      attendees: 40,
      icon: Presentation,
      color: "bg-[#F1BE48]",
      registration: false,
      registrationLink: "",
    },
    {
      id: "study-social-nov2024",
      title: "Study Social",
      date: "November 22, 2024",
      time: "3:00 PM - 5:00 PM",
      location: "Library",
      description:
        "Study together on tech assignments, get help from peers, make friends!",
      category: "Social",
      attendees: 20,
      icon: Coffee,
      color: "bg-[#CE0E2D]",
      registration: true,
      registrationLink: "https://example.com/study-social",
    },
  ];

  const passedEvents = [
    {
      id: "resume-roast-oct2025",
      title: "Resume Roast",
      date: "October 6, 2025",
      time: "5:30 PM - 8:30 PM",
      location: "Thornbrough Building",
      description:
        "Get feedback on your resume from industry professionals and improve your application materials.",
      category: "Career",
      attendees: 25,
      icon: Presentation,
      color: "bg-[#F1BE48]",
    },
    {
      id: "soldering-workshop-sep2024",
      title: "Soldering Workshop",
      date: "September 26, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Thornbrough Building",
      description:
        "Hands-on workshop to learn basic soldering techniques and build your own LED circuit.",
      category: "Workshop",
      attendees: 20,
      icon: Code,
      color: "bg-[#CE0E2D]",
    },
    {
      id: "resume-roast-oct2024",
      title: "Resume Roast",
      date: "October 6, 2024",
      time: "3:00 PM - 5:00 PM",
      location: "Engineering Atrium",
      description:
        "Get feedback on your resume from industry professionals and improve your application materials.",
      category: "Career",
      attendees: 30,
      icon: Presentation,
      color: "bg-[#F1BE48]",
    },
  ];

  const eventTypes = [
    {
      icon: Code,
      title: "Workshops",
      description:
        "From PCB design and embedded systems to Python and cloud computing — learn by doing.",
    },
    {
      icon: Trophy,
      title: "Friendly Challenges",
      description: "Fun competitions to test your skills",
    },
    {
      icon: Presentation,
      title: "Tech Talks",
      description: "Learn about cool tech projects from fellow students",
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Connect with fellow students and study together",
    },
  ];

  return (
    <section
      id="events"
      className="py-20 bg-gradient-to-b from-black to-zinc-900 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 border border-[#CE0E2D] rounded-full" />
        <div className="absolute top-40 right-20 w-16 h-16 border border-[#F1BE48] rounded-full" />
      </div>

      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        ref={ref}
      >
        {/* Header */}
        <motion.div
          style={{ pointerEvents: "auto" }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <Calendar className="h-8 w-8 text-[#F1BE48] mr-3" />
            <div className="w-24 h-1 uofg-gradient rounded-full" />
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Events & <span className="text-[#CE0E2D]">Activities</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From study groups to tech workshops - join fun activities and events
            with fellow tech enthusiasts at UofG.
          </p>
        </motion.div>

        {/* Event Types Overview */}
        <motion.div
          style={{ pointerEvents: "auto" }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {eventTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              style={{ pointerEvents: "auto" }}
            >
              <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 h-full relative z-20 pointer-events-auto">
                <CardContent className="p-6 text-center">
                  <type.icon className="h-12 w-12 text-[#F1BE48] mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {type.title}
                  </h4>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          style={{ pointerEvents: "auto" }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Upcoming Events
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                style={{ pointerEvents: "auto" }}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <Card className="relative z-20 pointer-events-auto bg-[#CE0E2D]/80 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-12 h-12 ${event.color} rounded-lg flex items-center justify-center`}
                      >
                        <event.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-zinc-800 text-zinc-300">
                        {event.category}
                      </Badge>
                    </div>
                    <h4 className="text-xl font-bold text-white leading-tight">
                      {event.title}
                    </h4>
                  </CardHeader>

                  <CardContent className="flex flex-col h-full">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-[#F1BE48]" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-[#F1BE48]" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-[#F1BE48]" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="h-4 w-4 mr-2 text-[#F1BE48]" />
                        <span className="text-sm">{event.attendees} expected</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                      {event.description}
                    </p>

                    <div className="mt-auto pointer-events-auto">
                      {event.registration ? (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          <Button className="w-full bg-[#F1BE48] hover:bg-[#F1BE48] text-black">
                            Register Now
                          </Button>
                        </a>
                      ) : (
                        <Button
                          className="w-full bg-[#F1BE48] hover:bg-[#F1BE48] text-black opacity-50 cursor-not-allowed"
                          disabled
                        >
                          No Registration Required
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Past Events */}
        <motion.div
          style={{ pointerEvents: "auto" }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Past Events
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {passedEvents.map((event) => (
              <motion.div
                key={event.id}
                style={{ pointerEvents: "auto" }}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <Card className="relative z-20 pointer-events-auto bg-zinc-800/80 border-zinc-700/50 hover:border-zinc-600/50 transition-all h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-12 h-12 ${event.color} rounded-lg flex items-center justify-center`}
                      >
                        <event.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-zinc-700 text-zinc-300">
                        {event.category}
                      </Badge>
                    </div>
                    <h4 className="text-xl font-bold text-white leading-tight">
                      {event.title}
                    </h4>
                  </CardHeader>

                  <CardContent className="flex flex-col h-full">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-[#F1BE48]" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-[#F1BE48]" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-[#F1BE48]" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="h-4 w-4 mr-2 text-[#F1BE48]" />
                        <span className="text-sm">{event.attendees} attended</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}