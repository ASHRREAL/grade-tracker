"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const MotionImage = motion(Image)

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [spinoMode, setSpinoMode] = useState(false)
  const [spinoInput, setSpinoInput] = useState("")
  const [inputPosition, setInputPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true')) {
        return;
      }
      
      if (e.key === ' ' || e.key === 'Escape' || e.key === 'Enter') {
        setSpinoInput("");
        setInputPosition(0);
        return;
      }
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        const newInput = spinoInput + e.key.toLowerCase();
        
        if (newInput.includes("spino")) {
          setSpinoMode(true);
          setSpinoInput("");
          setInputPosition(0);
        } else {
          const inputToKeep = newInput.slice(-5);
          setSpinoInput(inputToKeep);
          setInputPosition(inputToKeep.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spinoInput])

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#events", label: "Events" },
    { href: "#executive", label: "Team" },
    { href: "#contact", label: "Contact" }
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  const toggleSpinoMode = () => {
    setSpinoMode(!spinoMode);
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-t border-transparent ${
        isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: spinoMode ? 1 : 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {spinoMode ? (
              <div className="relative w-8 h-8">
                <MotionImage
                  src="/spino.svg"
                  alt="Spino Logo"
                  fill
                  className="object-contain filter brightness-0 invert"
                  onClick={toggleSpinoMode}
                  initial={{ rotate: 0, scale: 1 }}
                  animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  onAnimationComplete={() => {
                    const audio = new Audio('/roar.mp3');
                    audio.volume = 0.1;
                    audio.play();
                  }}
                />

                <motion.div
                  initial={{ x: 0, scaleX: 0, opacity: 0 }}
                  animate={{ x: -50, scaleX: [0, 1, 0], opacity: [1, 1, 0] }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#CE0E2D] rounded-full origin-left"
                />
              </div>
            ) : (
              <>
                <div className="relative w-12 h-12">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1280px-IEEE_logo.svg.png"
                    alt="IEEE Logo"
                    fill
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="relative w-12 h-12">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/University_of_Guelph_logo.svg/2560px-University_of_Guelph_logo.svg.png"
                    alt="University of Guelph Logo"
                    fill
                    className="object-contain opacity-60 [filter:invert(1)_brightness(1.8)]"
                  />
                </div>
              </>
            )}
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F1BE48]"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
            <Button
              onClick={() => window.open('https://discord.gg/wDgBXZWJRR', '_blank')}
              className="ml-4 bg-[#F1BE48] hover:bg-[#F1BE48] transition-opacity text-black"
            >
              Join Club
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-black/90 backdrop-blur-lg rounded-lg mt-2"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            <div className="px-4 pt-2">
              <Button
                onClick={() => window.open('https://discord.gg/wDgBXZWJRR', '_blank')}
                className="w-full bg-[#F1BE48] hover:bg-[#F1BE48] transition-opacity text-black"
              >
                Join Club
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
