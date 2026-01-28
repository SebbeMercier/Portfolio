// Feedback.jsx - Page publique pour laisser des avis clients
import { useState, useEffect } from 'react';
import { Star, Send, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import Turnstile from 'react-turnstile';
import { motion, AnimatePresence } from 'framer-motion';
import { submitTestimonial } from '../services/feedbackService';

const Feedback = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        company: '',
        content: '',
        rating: 5,
        projectType: '',
        workDuration: '',
        wouldRecommend: true
    });
    
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const totalSteps = 4;

    // Validation en temps réel
    useEffect(() => {
        const errors = {};
        
        if (currentStep >= 1) {
            if (!formData.name.trim()) errors.name = 'Name is required';
            if (!formData.email.trim()) errors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
        }
        
        if (currentStep >= 2) {
            if (!formData.projectType) errors.projectType = 'Please select a project type';
        }
        
        if (currentStep >= 3) {
            if (!formData.content.trim()) errors.content = 'Feedback is required';
            else if (formData.content.length < 20) errors.content = 'Please provide at least 20 characters';
        }
        
        setValidationErrors(errors);
    }, [formData, currentStep]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const nextStep = () => {
        const stepErrors = Object.keys(validationErrors).length > 0;
        if (!stepErrors && currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        // For development, allow submission without captcha if table doesn't exist
        if (!captchaToken && import.meta.env.MODE === 'production') {
            setError('Please complete the security verification');
            return;
        }

        if (Object.keys(validationErrors).length > 0) {
            setError('Please fix the errors before submitting');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const result = await submitTestimonial({
                ...formData,
                captchaToken: captchaToken || 'dev-bypass',
                submittedAt: new Date().toISOString(),
                ipAddress: 'hidden', // Sera récupéré côté serveur
                userAgent: navigator.userAgent
            });

            if (result.success) {
                setIsSubmitted(true);
            } else {
                setError(result.error || 'Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            console.error('Error stack:', error.stack);
            setError(`An unexpected error occurred: ${error.message}. Please check the console for details and run fix_testimonials_table.sql in Supabase SQL Editor.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
                        <p className="text-gray-400 mb-6">
                            Your feedback has been submitted successfully. It will be reviewed and may appear on the website after approval.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform"
                        >
                            Back to Portfolio
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f]">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Share Your <span className="text-purple-400">Experience</span>
                    </h1>
                    <p className="text-gray-400">
                        Your feedback helps me improve and shows potential clients what it's like to work together
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
                        <span className="text-sm text-purple-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <motion.div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Form */}
                <motion.div
                    layout
                    className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                    <AnimatePresence mode="wait">
                        {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-semibold text-white mb-4">Let's start with your details</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors ${
                                            validationErrors.name ? 'border-red-500' : 'border-gray-700'
                                        }`}
                                        placeholder="Your full name"
                                    />
                                    {validationErrors.name && (
                                        <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors ${
                                            validationErrors.email ? 'border-red-500' : 'border-gray-700'
                                        }`}
                                        placeholder="your.email@company.com"
                                    />
                                    {validationErrors.email && (
                                        <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Your Role
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={(e) => updateField('role', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                            placeholder="CEO, Developer, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => updateField('company', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                            placeholder="Your company name"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Project Details */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-semibold text-white mb-4">Tell me about our project</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Project Type *
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['Website', 'E-commerce', 'Mobile App', 'Backend API', 'Consulting', 'Other'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => updateField('projectType', type)}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                                    formData.projectType === type
                                                        ? 'bg-purple-600 border-purple-500 text-white'
                                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    {validationErrors.projectType && (
                                        <p className="text-red-400 text-sm mt-1">{validationErrors.projectType}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Project Duration
                                    </label>
                                    <select
                                        value={formData.workDuration}
                                        onChange={(e) => updateField('workDuration', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="">Select duration</option>
                                        <option value="1-2 weeks">1-2 weeks</option>
                                        <option value="1 month">1 month</option>
                                        <option value="2-3 months">2-3 months</option>
                                        <option value="3-6 months">3-6 months</option>
                                        <option value="6+ months">6+ months</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Feedback */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-semibold text-white mb-4">Share your experience</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Rating *
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => updateField('rating', star)}
                                                className="p-1 transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${
                                                        star <= formData.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-600'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-gray-400 self-center">
                                            {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Your Feedback * (minimum 20 characters)
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => updateField('content', e.target.value)}
                                        rows={5}
                                        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none ${
                                            validationErrors.content ? 'border-red-500' : 'border-gray-700'
                                        }`}
                                        placeholder="Tell me about your experience working together. What did you like? How was the communication? Would you recommend my services?"
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        {validationErrors.content && (
                                            <p className="text-red-400 text-sm">{validationErrors.content}</p>
                                        )}
                                        <p className="text-gray-500 text-sm ml-auto">
                                            {formData.content.length} characters
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Would you recommend my services?
                                    </label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => updateField('wouldRecommend', true)}
                                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                                formData.wouldRecommend
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                        >
                                            Yes, definitely!
                                        </button>
                                        <button
                                            onClick={() => updateField('wouldRecommend', false)}
                                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                                !formData.wouldRecommend
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                        >
                                            Not really
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Security & Submit */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-semibold text-white mb-4">Security verification</h3>
                                
                                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Shield className="w-5 h-5 text-purple-400" />
                                        <span className="text-white font-medium">Security Check</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4">
                                        Please complete the security verification to prevent spam and ensure authentic feedback.
                                    </p>
                                    
                                    {/* Cloudflare Turnstile */}
                                    <div className="flex justify-center">
                                        <Turnstile
                                            sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                                            onVerify={(token) => setCaptchaToken(token)}
                                            theme="dark"
                                        />
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-3">Preview of your testimonial:</h4>
                                    <div className="bg-gray-900/60 border border-gray-600 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {formData.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-white font-semibold">{formData.name}</p>
                                                    <div className="flex gap-1">
                                                        {[...Array(formData.rating)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                {formData.role && (
                                                    <p className="text-purple-400 text-sm">{formData.role}</p>
                                                )}
                                                {formData.company && (
                                                    <p className="text-gray-500 text-xs">{formData.company}</p>
                                                )}
                                                <p className="text-gray-300 text-sm mt-2 italic">"{formData.content}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                        <div className="text-red-400 text-sm">
                                            <p>{error}</p>
                                            {error.includes('table not found') && (
                                                <p className="mt-2 text-xs">
                                                    💡 Run the SQL from fix_testimonials_table.sql in your Supabase SQL Editor to fix the testimonials table.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {currentStep < totalSteps ? (
                            <button
                                onClick={nextStep}
                                disabled={Object.keys(validationErrors).length > 0}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !captchaToken || Object.keys(validationErrors).length > 0}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Security Notice */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        🔒 Your information is secure and will only be used for testimonial purposes. 
                        All submissions are reviewed before publication.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Feedback;