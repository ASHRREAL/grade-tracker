"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Mail, Linkedin, Github, ExternalLink, Instagram } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function ExecutiveSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const executives = [
    {
      name: "Steven Shelestowsky",
      position: "President",
      program: "",
      bio: "",
      image: "",
      email: "",
      linkedin: "https://www.linkedin.com/in/steven-shelestowsky",
      github: "",
      achievements: []
    },
    {
      name: "Elijah Ferns",
      position: "Vice President",
      program: "",
      bio: "hi im gay as hell",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQHg4SG2fQMqWw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1727378960563?e=1762992000&v=beta&t=shJvneyLnLPv-kDEEIK0MTXEyG6TjEcXp8KHAPma4Bw",
      email: "",
      linkedin: "https://www.linkedin.com/in/elijahferns",
      github: "https://github.com/elijahferns",
      achievements: []
    },
    {
      name: "Seiar Husain",
      position: "Web Developer",
      program: "",
      bio: "",
      image: "",
      email: "",
      linkedin: "",
      github: "",
      achievements: []
    },
    {
      name: "Andre",
      position: "Events Coordinator",
      program: "",
      bio: "",
      image: "",
      email: "",
      linkedin: "",
      github: "",
      achievements: []
    },
    {
      name: "Zeeshan",
      position: "Finance",
      program: "",
      bio: "",
      image: "",
      email: "",
      linkedin: "",
      github: "",
      achievements: []
    },
    {
      name: "Kyle",
      position: "",
      program: "",
      bio: "",
      image: "",
      email: "",
      linkedin: "",
      github: "",
      achievements: []
    },
    {
      name: "Aayan",
      position: "",
      program: "",
      bio: "",
      image: "",
      email: "",
      linkedin: "",
      github: "",
      achievements: []
    }
  ]

  const MotionCard = motion(Card)

  return (
    <section id="executive" className="py-20 bg-gradient-to-b from-zinc-900 to-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-24 h-1 uofg-gradient mx-auto rounded-full mb-6" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Meet Our <span className="text-[#CE0E2D]">Executive Team</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Passionate students leading our tech club with enthusiasm and dedication.
            Our team is focused on creating a fun and supportive environment for all members.
          </p>
        </motion.div>

        {/* Executive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {executives.map((exec, index) => (
            <motion.div
              key={exec.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
              className="h-full"
            >
              <MotionCard
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(241,190,72,0.4)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-full flex flex-col justify-between bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 border border-[#F1BE48]/50 hover:border-[#F1BE48] cursor-pointer"
              >
                <CardContent className="flex flex-col h-full justify-between p-6">
                  {/* Profile Image */}
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full border-4 border-[#CE0E2D] overflow-hidden">
                    {exec.image ? (
                      <Image
                        src={exec.image}
                        alt={exec.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-white font-bold text-xl">
                        {exec.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-white mb-1">{exec.name}</h4>
                    <div className="text-[#F1BE48] font-semibold mb-2">{exec.position}</div>
                    <div className="text-gray-400 text-sm mb-3">{exec.program}</div>
                  </div>

                  {/* Bio */}
                  <p className="text-center text-gray-300 text-sm leading-relaxed mb-4">{exec.bio}</p>

                  {/* Achievements */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {exec.achievements.map((ach, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-[#CE0E2D]/20 text-[#CE0E2D]">{ach}</span>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex justify-center space-x-3 mt-auto">
                    {exec.email && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-zinc-700 hover:bg-[#CE0E2D] rounded-full flex items-center justify-center transition-colors"
                        onClick={() => window.open(`mailto:${exec.email}`, '_blank')}
                      >
                        <Mail className="h-4 w-4 text-white" />
                      </motion.button>
                    )}
                    {exec.linkedin && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-zinc-700 hover:bg-[#0077B5] rounded-full flex items-center justify-center transition-colors"
                        onClick={() => window.open(exec.linkedin, '_blank')}
                      >
                        <Linkedin className="h-4 w-4 text-white" />
                      </motion.button>
                    )}
                    {exec.github && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-zinc-700 hover:bg-[#333] rounded-full flex items-center justify-center transition-colors"
                        onClick={() => window.open(exec.github, '_blank')}
                      >
                        <Github className="h-4 w-4 text-white" />
                      </motion.button>
                    )}
                  </div>
                </CardContent>
              </MotionCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
