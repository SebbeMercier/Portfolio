// testimonialsData.js - Données par défaut des témoignages
export const testimonialsData = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "CEO, TechStart",
        company: "TechStart Inc.",
        content: "Working with this developer was an absolute pleasure. The attention to detail and technical expertise exceeded our expectations. Our project was delivered on time and within budget.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        isVisible: true,
        status: 'approved',
        order: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Product Manager",
        company: "InnovateLab",
        content: "Exceptional work! The solution provided was not only technically sound but also user-friendly. Great communication throughout the project.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isVisible: true,
        status: 'approved',
        order: 2,
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Marketing Director",
        company: "GrowthCorp",
        content: "The website redesign transformed our online presence. Performance improvements were remarkable, and our conversion rate increased by 40%.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        isVisible: true,
        status: 'approved',
        order: 3,
        createdAt: new Date().toISOString()
    }
];