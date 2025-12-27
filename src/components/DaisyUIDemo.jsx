// Démonstration complète des composants DaisyUI
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageSquare, 
  Share2,
  Download,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

const DaisyUIDemo = () => {
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(4);
  const [progress, setProgress] = useState(65);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-20 px-4"
      id="daisyui-demo"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            🎨 DaisyUI Components Showcase
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Découvrez la puissance des composants DaisyUI intégrés dans ce portfolio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card avec stats */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-xl border border-primary/20"
          >
            <div className="card-body">
              <h3 className="card-title">
                📊 Statistiques
                <div className="badge badge-secondary">NEW</div>
              </h3>
              <div className="stats stats-vertical shadow">
                <div className="stat">
                  <div className="stat-title">Projets</div>
                  <div className="stat-value text-primary">25+</div>
                  <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Clients</div>
                  <div className="stat-value text-secondary">50+</div>
                  <div className="stat-desc">↗︎ 90 (14%)</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card avec rating */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-xl border border-secondary/20"
          >
            <div className="card-body">
              <h3 className="card-title">⭐ Évaluations</h3>
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    checked={rating === star}
                    onChange={() => setRating(star)}
                  />
                ))}
              </div>
              <p className="text-sm text-base-content/70">
                Note moyenne: {rating}/5 étoiles
              </p>
              <div className="card-actions justify-end">
                <button 
                  className={`btn btn-sm ${liked ? 'btn-error' : 'btn-outline'}`}
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  {liked ? 'Aimé' : 'Aimer'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card avec progress */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-xl border border-accent/20"
          >
            <div className="card-body">
              <h3 className="card-title">📈 Progression</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>React</span>
                    <span>90%</span>
                  </div>
                  <progress className="progress progress-primary w-full" value="90" max="100"></progress>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>TypeScript</span>
                    <span>85%</span>
                  </div>
                  <progress className="progress progress-secondary w-full" value="85" max="100"></progress>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Node.js</span>
                    <span>{progress}%</span>
                  </div>
                  <progress className="progress progress-accent w-full" value={progress} max="100"></progress>
                </div>
              </div>
              <button 
                className="btn btn-outline btn-accent btn-sm mt-2"
                onClick={() => setProgress(prev => (prev + 5) % 100)}
              >
                Mettre à jour
              </button>
            </div>
          </motion.div>

          {/* Card avec avatars */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-xl border border-info/20"
          >
            <div className="card-body">
              <h3 className="card-title">👥 Équipe</h3>
              <div className="avatar-group -space-x-6">
                <div className="avatar">
                  <div className="w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">D</span>
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">U</span>
                  </div>
                </div>
                <div className="avatar placeholder">
                  <div className="w-12 bg-neutral-focus text-neutral-content rounded-full">
                    <span>+5</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="badge badge-primary">Designer</div>
                <div className="badge badge-secondary">Developer</div>
                <div className="badge badge-accent">UI/UX</div>
              </div>
            </div>
          </motion.div>

          {/* Card avec boutons */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-xl border border-success/20"
          >
            <div className="card-body">
              <h3 className="card-title">🎮 Actions</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm flex-1">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                  <button className="btn btn-secondary btn-sm flex-1">
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    className={`btn btn-sm flex-1 ${isPlaying ? 'btn-error' : 'btn-success'}`}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="btn btn-accent btn-block">
                  <MessageSquare className="w-4 h-4" />
                  Commenter
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card avec alerts */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-xl border border-warning/20"
          >
            <div className="card-body">
              <h3 className="card-title">🚨 Notifications</h3>
              <div className="space-y-3">
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-sm">Nouveau message reçu!</span>
                </div>
                <div className="alert alert-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-sm">Projet terminé!</span>
                </div>
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" /></svg>
                  <span className="text-sm">Attention aux délais!</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Section avec tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">📋 Onglets DaisyUI</h3>
              <div className="tabs tabs-boxed">
                <button className="tab tab-active">Composants</button>
                <button className="tab">Thèmes</button>
                <button className="tab">Animations</button>
                <button className="tab">Responsive</button>
              </div>
              <div className="mt-6 p-4 bg-base-200 rounded-lg">
                <h4 className="font-bold mb-2">🎨 Composants DaisyUI utilisés:</h4>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-outline">card</div>
                  <div className="badge badge-outline">btn</div>
                  <div className="badge badge-outline">avatar</div>
                  <div className="badge badge-outline">progress</div>
                  <div className="badge badge-outline">rating</div>
                  <div className="badge badge-outline">alert</div>
                  <div className="badge badge-outline">tabs</div>
                  <div className="badge badge-outline">stats</div>
                  <div className="badge badge-outline">badge</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DaisyUIDemo;