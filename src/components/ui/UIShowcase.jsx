// Showcase des améliorations UI avec shadcn/ui et DaisyUI
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Zap, 
  Heart,
  Code,
  Layers,
  Wand2,
  Sparkles
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const UIShowcase = () => {
  const [progress, setProgress] = useState(75);

  const features = [
    {
      icon: <Palette className="w-5 h-5" />,
      title: "shadcn/ui",
      description: "Composants React modernes et accessibles",
      color: "bg-blue-500"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "DaisyUI", 
      description: "Classes CSS utilitaires élégantes",
      color: "bg-purple-500"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Framer Motion",
      description: "Animations fluides et performantes", 
      color: "bg-yellow-500"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Tailwind CSS",
      description: "Framework CSS utility-first",
      color: "bg-pink-500"
    }
  ];

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <div className="card w-80 bg-base-100 shadow-2xl border border-primary/20">
          <div className="card-body p-4">
            {/* Header avec badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="avatar">
                <div className="w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="card-title text-lg">🎨 UI Enhanced</h2>
                <div className="badge badge-primary badge-outline">shadcn/ui + DaisyUI</div>
              </div>
            </div>

            {/* Progress avec DaisyUI */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-base-content/70">Améliorations UI</span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
            </div>

            {/* Features avec cards DaisyUI */}
            <div className="grid grid-cols-2 gap-3 my-4">
              {features.map((feature, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="card card-compact bg-base-200 hover:bg-base-300 cursor-pointer transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="card-body items-center text-center p-3">
                        <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mb-2 shadow-lg`}>
                          {feature.icon}
                        </div>
                        <h4 className="text-sm font-bold">{feature.title}</h4>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{feature.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* DaisyUI Components Demo */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" />
                DaisyUI Components
              </h4>
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm">Primary</button>
                <button className="btn btn-secondary btn-sm">Secondary</button>
                <button className="btn btn-accent btn-sm">Accent</button>
              </div>
            </div>

            {/* Badges avec DaisyUI */}
            <div className="flex flex-wrap gap-2">
              <div className="badge badge-primary">React</div>
              <div className="badge badge-secondary">TypeScript</div>
              <div className="badge badge-accent">Tailwind</div>
              <div className="badge badge-info">Framer</div>
            </div>

            {/* Avatar Group avec DaisyUI */}
            <div className="flex items-center gap-3">
              <div className="avatar-group -space-x-3">
                <div className="avatar">
                  <div className="w-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">S</span>
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">U</span>
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">I</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-base-content/70">Enhanced UI Stack</span>
            </div>

            {/* Action Button avec loading */}
            <button 
              className="btn btn-outline btn-primary w-full mt-2"
              onClick={() => setProgress(prev => (prev + 10) % 100)}
            >
              <Code className="w-4 h-4 mr-2" />
              Voir les améliorations
              {progress === 90 && <span className="loading loading-spinner loading-xs ml-2"></span>}
            </button>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default UIShowcase;