"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState } from "react"
import {
  Mail, MapPin, Phone, MessageSquare,
  Instagram, Linkedin, MessageCircle
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export function ContactSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", year: "",
    program: "", subject: "", message: "", interests: ""
  })

  const handleInputChange = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        toast({
          title: "Message Sent Successfully!",
          description: "We'll get back to you within 24-48 hours. Welcome to the IEEE UofG community!"
        })
        setFormData({
          name: "", email: "", phone: "", year: "",
          program: "", subject: "", message: "", interests: ""
        })
      } else throw new Error("Failed to send message")
    } catch {
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or email us directly at ieee@uoguelph.ca",
        variant: "destructive"
      })
    } finally { setIsSubmitting(false) }
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-zinc-900 to-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Johnston-Clock-Tower.jpg"
          alt="Johnston Hall Clock Tower"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <MessageSquare className="h-8 w-8 text-[#F1BE48] mr-3" />
            <div className="w-24 h-1 uofg-gradient rounded-full" />
          </motion.div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Get In <span className="text-[#CE0E2D]">Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Questions about our club? Want to join our club? We’d love to hear from you!
          </p>
        </motion.div>

        {/* Social Buttons */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-2xl flex justify-center"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full justify-items-stretch">
              {[
                { name: "Email", icon: Mail, url: "mailto:ieee@uoguelph.ca", color: "#CE0E2D", delay: 0.8 },
                { name: "Discord", icon: MessageCircle, url: "https://discord.gg/wDgBXZWJRR", color: "#5865F2", delay: 0.9 },
                { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/uofg_ieee/", color: "#E1306C", delay: 1.0 },
                { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/company/ieeeguelph/posts/?feedView=all", color: "#0077B5", delay: 1.1 }
              ].map(item => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: item.delay }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(item.url, "_blank")}
                  style={{
                    borderColor: `${item.color}80`, // 50% opacity border
                  }}
                  className="group bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 
                            border hover:brightness-110 
                            flex items-center justify-center gap-2 text-white 
                            h-12 sm:h-14 w-full rounded-lg font-semibold text-sm
                            shadow-md cursor-pointer transition-all duration-150"
                >
                  <item.icon
                    className="w-5 h-5 transition-transform duration-150 group-hover:scale-110"
                    style={{ color: item.color }}
                  />
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-150">
                    {item.name}
                  </span>

                  {/* Dynamic hover border color */}
                  <style jsx>{`
                    button:hover {
                      border-color: ${item.color};
                    }
                  `}</style>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>


        {/* Bottom Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-16 pt-12 border-t border-zinc-700"
        >
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="relative w-16 h-16">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1280px-IEEE_logo.svg.png"
                alt="IEEE Logo"
                fill
                className="object-contain filter brightness-0 invert opacity-60"
              />
            </div>
            <div className="text-3xl font-bold text-[#F1BE48] opacity-60">×</div>
            <div className="relative w-16 h-16">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/University_of_Guelph_logo.svg/2560px-University_of_Guelph_logo.svg.png"
                alt="University of Guelph Logo"
                fill
                className="object-contain opacity-60 [filter:invert(1)_brightness(1.8)]"
              />
            </div>
          </div>

          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            IEEE Student Branch, University of Guelph • Learning and Building Together •
            <em className="italic">"Improve Life"</em>
          </p>
          <div className="mt-6 text-xs text-gray-500">
            © 2025 IEEE Student Branch, University of Guelph. All rights reserved.
          </div>
        </motion.div>
      </div>
    </section>
  )
}
