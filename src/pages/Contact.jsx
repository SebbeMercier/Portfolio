// src/pages/Contact.jsx
import { useState, useEffect, useRef } from 'react';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Instagram } from 'lucide-react';
import { animate, stagger } from 'animejs';
import Turnstile from 'react-turnstile';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useSectionGradient } from '../hooks/useSectionGradient';
import { contactService } from '../services/supabase';
import { toast } from 'react-hot-toast';

import { useTranslation } from '../hooks/useTranslation';

const Contact = () => {
    const { currentLanguage, t } = useTranslation();
    const pageSectionRef = useSectionGradient('#0f0a1f');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [turnstileToken, setTurnstileToken] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const headerRef = useRef(null);
    const cardsRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        // Animation du header
        animate(headerRef.current, {
            opacity: [0, 1],
            translateY: [-30, 0],
            duration: 1000,
            easing: 'out-expo'
        });

        // Animation des cartes de contact en cascade
        if (cardsRef.current) {
            animate(cardsRef.current.children, {
                opacity: [0, 1],
                translateX: [-30, 0],
                delay: stagger(150),
                duration: 800,
                easing: 'out-expo'
            });
        }

        // Animation du formulaire
        animate(formRef.current, {
            opacity: [0, 1],
            translateX: [30, 0],
            duration: 1000,
            delay: 300,
            easing: 'out-expo'
        });
    }, []);

    const contactInfo = [
        {
            icon: Mail,
            label: t('pages.contact.email'),
            value: 'info@sebbe-mercier.tech',
            href: 'mailto:info@sebbe-mercier.tech'
        },
        {
            icon: Phone,
            label: t('pages.contact.phone'),
            value: '+32 (0) 470 27 01 72',
            href: 'tel:+32470270172'
        },
        {
            icon: MapPin,
            label: t('pages.contact.location'),
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

        if (!turnstileToken) {
            toast.error(t('pages.contact.captchaError'));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                turnstileToken: turnstileToken,
                lang: currentLanguage
            };

            // Envoyer les emails via Supabase Edge Function
            await contactService.sendEmail(payload);

            toast.success(t('pages.contact.successToast'));
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Reset Turnstile
            if (window.turnstile) {
                window.turnstile.reset();
            }
            setTurnstileToken(null);

        } catch (error) {
            console.error('❌ Error sending message:', error);
            toast.error(t('pages.contact.errorToast'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={pageSectionRef} className="min-h-screen pt-44 pb-20 px-8 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0f1f] via-[#1a1f2e] to-[#0f0a1f] relative overflow-hidden">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />

                {/* Floating particles */}
                <div className="absolute top-32 left-32 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }} />
                <div className="absolute top-64 right-48 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
                <div className="absolute bottom-48 left-1/4 w-1 h-1 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div ref={headerRef} className="text-center mb-16 opacity-0">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600
                                       bg-clip-text text-transparent">
                            {t('pages.contact.title')}
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('pages.contact.subtitle')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Contact Cards */}
                        <div ref={cardsRef} className="space-y-4">
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
                                <h3 className="text-white font-semibold mb-4">{t('pages.contact.followMe')}</h3>
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
                                        <p className="text-white font-medium">{t('pages.contact.statusAvailable')}</p>
                                        <p className="text-sm text-gray-400">{t('pages.contact.statusOpen')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div ref={formRef} className="lg:col-span-2 opacity-0">
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
                                                {t('pages.contact.formName')}
                                            </label>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder={t('pages.contact.placeholderName')}
                                                className="bg-white/5 border-white/10 text-white
                                                         placeholder:text-gray-500
                                                         focus:border-purple-500/50 focus:ring-purple-500/20
                                                         transition-all duration-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">
                                                {t('pages.contact.formEmail')}
                                            </label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder={t('pages.contact.placeholderEmail')}
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
                                            {t('pages.contact.formSubject')}
                                        </label>
                                        <Input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder={t('pages.contact.placeholderSubject')}
                                            className="bg-white/5 border-white/10 text-white
                                                     placeholder:text-gray-500
                                                     focus:border-purple-500/50 focus:ring-purple-500/20
                                                     transition-all duration-300"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">
                                            {t('pages.contact.formMessage')}
                                        </label>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder={t('pages.contact.placeholderMessage')}
                                            className="bg-white/5 border-white/10 text-white
                                                     placeholder:text-gray-500
                                                     focus:border-purple-500/50 focus:ring-purple-500/20
                                                     transition-all duration-300 resize-none"
                                        />
                                    </div>

                                    {/* Turnstile Captcha */}
                                    <div className="flex justify-center sm:justify-start">
                                        <Turnstile
                                            sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} // Fallback to testing key
                                            onVerify={(token) => setTurnstileToken(token)}
                                            theme="dark"
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
                                            <span>{isSubmitting ? t('pages.contact.buttonSending') : t('pages.contact.buttonSend')}</span>
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