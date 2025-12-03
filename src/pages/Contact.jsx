// src/pages/Contact.jsx
import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Instagram } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from  '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'info@sebbe-mercier.tech',
            href: 'mailto:info@sebbe-mercier.tech'
        },
        {
            icon: Phone,
            label: 'Phone',
            value: '+32 (0) 470 27 01 72',
            href: 'tel:+32470270172'
        },
        {
            icon: MapPin,
            label: 'Location',
            value: 'Belgium',
            href: null
        }
    ];

    const socialLinks = [
        { icon: Github, href: 'https://github.com/SebbeMercier', label: 'GitHub' },
        { icon: Linkedin, href: 'https://www.linkedin.com/in/sebbe-mercier-98bb16345/', label: 'LinkedIn' },
        { icon: Instagram, href: 'https://www.instagram.com/sebbe_mercier/', label: 'Instagram' },


    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulation d'envoi
        setTimeout(() => {
            toast({
                title: "Message sent! ✨",
                description: "I'll get back to you as soon as possible.",
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-44 pb-20 px-8 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600
                                       bg-clip-text text-transparent">
                            Get In Touch
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Have a project in mind? Let's work together to create something amazing.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Contact Cards */}
                        <div className="space-y-4">
                            {contactInfo.map((item, index) => (
                                <div key={index}
                                     className="group relative overflow-hidden">
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10
                                                  rounded-2xl blur-xl opacity-0 group-hover:opacity-100
                                                  transition-opacity duration-500"></div>

                                    <div className="relative bg-gray-900/60 backdrop-blur-xl
                                                  border border-white/10 rounded-2xl p-6
                                                  hover:border-purple-500/30 transition-all duration-300">
                                        {item.href ? (
                                            <a href={item.href}
                                               className="flex items-start space-x-4 group/link">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-xl
                                                              bg-gradient-to-br from-purple-600/20 to-pink-600/20
                                                              flex items-center justify-center
                                                              group-hover/link:from-purple-600/30 group-hover/link:to-pink-600/30
                                                              transition-all duration-300">
                                                    <item.icon className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                                                    <p className="text-white font-medium group-hover/link:text-purple-400
                                                                transition-colors duration-300">
                                                        {item.value}
                                                    </p>
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-xl
                                                              bg-gradient-to-br from-purple-600/20 to-pink-600/20
                                                              flex items-center justify-center">
                                                    <item.icon className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                                                    <p className="text-white font-medium">{item.value}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5
                                          rounded-2xl"></div>
                            <div className="relative bg-gray-900/60 backdrop-blur-xl
                                          border border-white/10 rounded-2xl p-6">
                                <h3 className="text-white font-semibold mb-4">Follow Me</h3>
                                <div className="flex space-x-3">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/social w-12 h-12 rounded-xl
                                                     bg-white/5 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600
                                                     border border-white/10 hover:border-transparent
                                                     flex items-center justify-center
                                                     transition-all duration-300
                                                     hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
                                        >
                                            <social.icon className="w-5 h-5 text-gray-400 group-hover/social:text-white
                                                                  transition-colors duration-300" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Availability Badge */}
                        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10
                                          rounded-2xl blur-xl"></div>
                            <div className="relative bg-gray-900/60 backdrop-blur-xl
                                          border border-green-500/20 rounded-2xl p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full
                                                      animate-ping"></div>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Available for work</p>
                                        <p className="text-sm text-gray-400">Open to new opportunities</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600
                                          rounded-2xl blur-xl opacity-20 group-hover:opacity-30
                                          transition-opacity duration-500"></div>

                            <div className="relative bg-gray-900/60 backdrop-blur-xl
                                          border border-white/10 rounded-2xl p-8 sm:p-10">

                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* Name & Email */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">
                                                Name *
                                            </label>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                                className="bg-white/5 border-white/10 text-white
                                                         placeholder:text-gray-500
                                                         focus:border-purple-500/50 focus:ring-purple-500/20
                                                         transition-all duration-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">
                                                Email *
                                            </label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                                className="bg-white/5 border-white/10 text-white
                                                         placeholder:text-gray-500
                                                         focus:border-purple-500/50 focus:ring-purple-500/20
                                                         transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">
                                            Subject *
                                        </label>
                                        <Input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="Project Discussion"
                                            className="bg-white/5 border-white/10 text-white
                                                     placeholder:text-gray-500
                                                     focus:border-purple-500/50 focus:ring-purple-500/20
                                                     transition-all duration-300"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">
                                            Message *
                                        </label>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder="Tell me about your project..."
                                            className="bg-white/5 border-white/10 text-white
                                                     placeholder:text-gray-500
                                                     focus:border-purple-500/50 focus:ring-purple-500/20
                                                     transition-all duration-300 resize-none"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto relative group/btn overflow-hidden
                                                 bg-gradient-to-r from-purple-600 to-pink-600
                                                 hover:from-purple-500 hover:to-pink-500
                                                 text-white font-medium py-6 px-8
                                                 rounded-xl shadow-lg shadow-purple-500/25
                                                 hover:shadow-xl hover:shadow-purple-500/40
                                                 hover:scale-105
                                                 transition-all duration-300
                                                 disabled:opacity-50 disabled:cursor-not-allowed
                                                 disabled:hover:scale-100"
                                    >
                                        {/* Shine effect */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                                       translate-x-[-100%] group-hover/btn:translate-x-[100%]
                                                       transition-transform duration-700"></span>

                                        <span className="relative flex items-center justify-center space-x-2">
                                            <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                            <Send className="w-5 h-5" />
                                        </span>
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
