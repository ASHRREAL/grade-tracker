
"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { GraduationCap, Lightbulb, Network, Trophy, Heart, Rocket } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const features = [
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
    <section id="about" className="py-20 bg-gradient-to-b from-black to-zinc-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='https://i.pinimg.com/564x/18/95/9c/18959cc5d14a44692daaaa2ee916bdda.jpg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23CE0E2D' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

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
            className="inline-block mb-6"
          >
            <div className="w-24 h-1 uofg-gradient mx-auto rounded-full" />
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            About IEEE <span className="text-[#CE0E2D]">at Guelph</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Where Guelph's spirit of <em>"rerum cognoscere causas"</em> meets IEEE's global innovation network. 
            We're not just another student club - we're your gateway to shaping the future of technology.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* War Memorial Hall */}
              <motion.div 
                className="relative aspect-[4/3] rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/War_Memorial_Hall_University_of_Guelph.jpg/1200px-War_Memorial_Hall_University_of_Guelph.jpg"
                  alt="War Memorial Hall - UofG"
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  War Memorial Hall
                </div>
              </motion.div>

              {/* The Cannon */}
              <motion.div 
                className="relative aspect-[4/3] rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/1/19/Old_Jeremiah_at_University_of_Guelph%2C_Nov_25.jpg"
                  alt="The Cannon (Old Jeremiah) - UofG Tradition"
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  Old Jeremiah
                </div>
              </motion.div>

              {/* Thornbrough - Engineering Building */}
              <motion.div 
                className="relative aspect-[4/3] rounded-lg overflow-hidden col-span-2 "
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://www.uoguelph.ca/maps/img/full/albert-a-thornbrough-building-banner.jpg"
                  alt="Thornbrough - Engineering Building"
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-lg font-semibold">Thornbrough - Engineering Building</div>
                  <div className="text-sm opacity-90">Where IEEE club meets</div>
                </div>
              </motion.div>
            </div>


          </motion.div>

          {/* Right: Story Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Our Story at <span className="text-[#CE0E2D]">Guelph</span>
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We're a community of tech enthusiasts at UofG who share a passion for technology and innovation. 
                Started by students who wanted to explore beyond the classroom.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Whether you're interested in coding, robotics, or just want to meet fellow tech lovers, 
                IEEE UofG is the place to be.
              </p>
            </div>

            <div className="border-l-4 border-[#F1BE48] pl-6 py-4 bg-gradient-to-r from-[#F1BE48]/10 to-transparent rounded-r-lg">
              <blockquote className="text-lg italic text-white mb-2">
                "Improve Life"
              </blockquote>
              <p className="text-sm text-gray-400">
                University of Guelph's mission reminds us that technology should benefit everyone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 glass-effect rounded-lg">
                <div className="text-2xl font-bold text-[#CE0E2D] mb-1">2023</div>
                <div className="text-sm text-gray-300">Founded</div>
              </div>
              <div className="text-center p-4 glass-effect rounded-lg">
                <div className="text-2xl font-bold text-[#F1BE48] mb-1">Growing</div>
                <div className="text-sm text-gray-300">Community</div>
              </div>
            </div>
          </motion.div>
        </div>

        


      </div>
    </section>
  )
}
