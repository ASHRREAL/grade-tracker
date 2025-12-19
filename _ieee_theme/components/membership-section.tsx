"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CheckCircle, DollarSign, Users, BookOpen, Trophy, Briefcase, Globe, Star, Calendar, Wrench, Clock, GraduationCap, Lightbulb, Network } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function MembershipSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const benefits = [
    {
      icon: BookOpen,
      title: "Learning Resources",
      description: "Access to technical materials and learning resources for your projects",
      value: "Great value"
    },
    {
      icon: GraduationCap,
      title: "Hands-On Learning",
      description: "Gain experience through workshops, coding sessions, and hardware projects.",
      color: "text-[#CE0E2D]"
    },
    {
      icon: Lightbulb,
      title: "Industry Connections", 
      description: "Network with engineers, alumni, and recruiters through career events and IEEE’s professional network.",
      color: "text-[#F1BE48]"
    },
    {
      icon: Network,
      title: "Collaborative Projects",
      description: "Team up with peers on robotics, embedded systems, and AI projects or bring your own ideas to life.",
      color: "text-[#CE0E2D]"
    },
  ]


  return (
    <section id="membership" className="py-20 bg-gradient-to-b from-black to-zinc-900 relative overflow-hidden">
      {/* Background Elements */}
      

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
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
            <Star className="h-8 w-8 text-[#F1BE48] mr-3" />
            <div className="w-24 h-1 uofg-gradient rounded-full" />
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join the <span className="text-[#CE0E2D]">Community</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join our community of tech enthusiasts at UofG. 
            We're here to learn, build projects, and support each other in our tech journey.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Membership Benefits
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6}}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 border-zinc-700/50 hover:border-zinc-600/50 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      {/* Solid yellow background for icons */}
                      <div className="w-12 h-12 bg-[#F1BE48] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white mb-2">
                          {benefit.title}
                        </h4>
                        <Badge className="bg-[#F1BE48]/20 text-[#F1BE48] text-xs">
                          {benefit.value}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

       
      </div>
    </section>
  )
}
