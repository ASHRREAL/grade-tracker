"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {

  const scrollToAbout = () => {
    const element = document.querySelector("#about")
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Static Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="https://www.uoguelph.ca/maps/img/full/johnston-hall-banner.jpg"
          alt="Johnston Hall - University of Guelph"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-[#CE0E2D] rounded-full"
          animate={{ y: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 bg-[#F1BE48] rounded-full"
          animate={{ y: [20, -20, 20], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-white rounded-full"
          animate={{ y: [-15, 15, -15], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-center items-center space-x-6 mb-6">
            <motion.div 
              className="relative w-16 h-16"
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1280px-IEEE_logo.svg.png"
                alt="IEEE Logo"
                fill
                className="object-contain filter brightness-0 invert"
              />
            </motion.div>
            <div className="text-4xl font-bold text-[#F1BE48]">×</div>
            <motion.div 
              className="relative w-16 h-16"
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/University_of_Guelph_logo.svg/2560px-University_of_Guelph_logo.svg.png"
                alt="University of Guelph Logo"
                fill
                className="object-contain opacity-60 [filter:invert(1)_brightness(1.8)]"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-[#00629B] stroke-white">IEEE </span>
          <span className="text-white">Student Branch</span>
          <br />
          <span className="text-[#CE0E2D]">University of Guelph</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          A community for students who love technology. Learn, build, and connect with fellow tech enthusiasts. 
          Join UofG's student tech club and explore the fun side of technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            
            onClick={scrollToAbout}
            size="lg"
            className="bg-[#F1BE48] hover:bg-[#F1BE48] transition-all duration-300 text-lg px-8 py-4  group text-black"
          >
            Discover Our Club
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => window.open('https://discord.gg/wDgBXZWJRR', '_blank')}
            size="lg"
            className="bg-[#F1BE48] hover:bg-[#F1BE48] transition-all duration-300 text-lg px-8 py-4  text-black"
          >
            Join the Club
          </Button>
        </motion.div>
      </div>

     
    </section>
  )
}
