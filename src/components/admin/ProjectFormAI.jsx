// Composant pour les champs IA dans le formulaire projet
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Target, Zap } from 'lucide-react';

const ProjectFormAI = ({ currentProject, updateField }) => {
  const [showAIFields, setShowAIFields] = useState(false);

  const aiPriorityOptions = [
    { value: 1, label: '1 - Très haute (Featured)', color: 'text-red-400' },
    { value: 2, label: '2 - Haute', color: 'text-orange-400' },
    { value: 3, label: '3 - Moyenne', color: 'text-yellow-400' },
    { value: 4, label: '4 - Basse', color: 'text-blue-400' },
    { value: 5, label: '5 - Très basse', color: 'text-gray-400' }
  ];

  const complexityOptions = [
    { value: 1, label: '1 - Simple', desc: 'Projet basique' },
    { value: 2, label: '2 - Facile', desc: 'Quelques fonctionnalités' },
    { value: 3, label: '3 - Moyen', desc: 'Complexité standard' },
    { value: 4, label: '4 - Complexe', desc: 'Nombreuses fonctionnalités' },
    { value: 5, label: '5 - Très complexe', desc: 'Architecture avancée' }
  ];

  const impactOptions = [
    { value: 1, label: '1 - Minimal' },
    { value: 3, label: '3 - Faible' },
    { value: 5, label: '5 - Moyen' },
    { value: 7, label: '7 - Important' },
    { value: 10, label: '10 - Majeur' }
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public', desc: 'Visible partout' },
    { value: 'portfolio-only', label: 'Portfolio seulement', desc: 'Visible sur le portfolio uniquement' },
    { value: 'private', label: 'Privé', desc: 'Non visible publiquement' }
  ];

  const statusOptions = [
    { value: 'planning', label: 'En planification' },
    { value: 'in-progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'live', label: 'En ligne' },
    { value: 'archived', label: 'Archivé' }
  ];

  // Ajouter/supprimer des technologies
  const addTechnology = (tech) => {
    if (tech && !currentProject.technologies?.includes(tech)) {
      updateField('technologies', [...(currentProject.technologies || []), tech]);
    }
  };

  const removeTechnology = (tech) => {
    updateField('technologies', (currentProject.technologies || []).filter(t => t !== tech));
  };

  // Ajouter/supprimer des challenges
  const addChallenge = (challenge) => {
    if (challenge) {
      updateField('challenges', [...(currentProject.challenges || []), challenge]);
    }
  };

  const removeChallenge = (index) => {
    const newChallenges = [...(currentProject.challenges || [])];
    newChallenges.splice(index, 1);
    updateField('challenges', newChallenges);
  };

  // Ajouter/supprimer des solutions
  const addSolution = (solution) => {
    if (solution) {
      updateField('solutions', [...(currentProject.solutions || []), solution]);
    }
  };

  const removeSolution = (index) => {
    const newSolutions = [...(currentProject.solutions || [])];
    newSolutions.splice(index, 1);
    updateField('solutions', newSolutions);
  };

  return (
    <div className="space-y-6">
      {/* Bouton pour afficher/masquer les champs IA */}
      <button
        type="button"
        onClick={() => setShowAIFields(!showAIFields)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        <Sparkles className="w-4 h-4" />
        Optimisation IA
        {showAIFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showAIFields && (
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Optimisation pour l'IA</h3>
            <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded-full">
              Ces champs améliorent les réponses de l'assistant IA
            </span>
          </div>

          {/* Description courte pour l'IA */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description courte (pour l'IA)
              <span className="text-purple-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={currentProject.short_description || ''}
              onChange={(e) => updateField('short_description', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="Version condensée pour l'assistant IA (max 100 caractères)"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1">
              {(currentProject.short_description || '').length}/100 caractères
            </p>
          </div>

          {/* Technologies (séparées des tags) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Technologies utilisées
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ajouter une technologie (ex: React, Node.js)"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology(e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(currentProject.technologies || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm cursor-pointer hover:bg-blue-900/50 transition-colors"
                  onClick={() => removeTechnology(tech)}
                >
                  {tech}
                  <span className="text-blue-400 hover:text-red-400">×</span>
                </span>
              ))}
            </div>
          </div>

          {/* Priorité IA et Visibilité */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Priorité IA
              </label>
              <select
                value={currentProject.ai_priority || 5}
                onChange={(e) => updateField('ai_priority', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {aiPriorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Plus la priorité est haute, plus l'IA mentionnera ce projet
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Visibilité
              </label>
              <select
                value={currentProject.visibility || 'public'}
                onChange={(e) => updateField('visibility', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {visibilityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {visibilityOptions.find(o => o.value === (currentProject.visibility || 'public'))?.desc}
              </p>
            </div>
          </div>

          {/* Statut et Featured */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Statut du projet
              </label>
              <select
                value={currentProject.status || 'completed'}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Projet vedette
              </label>
              <div className="flex items-center gap-3 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProject.is_featured || false}
                    onChange={(e) => {
                      updateField('is_featured', e.target.checked);
                      updateField('featured', e.target.checked); // Sync avec l'ancien champ
                    }}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-white">Projet vedette</span>
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Les projets vedettes sont prioritaires dans l'IA
              </p>
            </div>
          </div>

          {/* Métriques de complexité et impact */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Zap className="w-4 h-4 inline mr-1" />
                Niveau de complexité
              </label>
              <select
                value={currentProject.complexity_level || 3}
                onChange={(e) => updateField('complexity_level', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {complexityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {complexityOptions.find(o => o.value === (currentProject.complexity_level || 3))?.desc}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Score d'impact
              </label>
              <select
                value={currentProject.impact_score || 5}
                onChange={(e) => updateField('impact_score', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {impactOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Impact du projet sur votre carrière/portfolio
              </p>
            </div>
          </div>

          {/* URLs */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL Live</label>
              <input
                type="url"
                value={currentProject.live_url || ''}
                onChange={(e) => updateField('live_url', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input
                type="url"
                value={currentProject.github_url || ''}
                onChange={(e) => updateField('github_url', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="https://github.com/user/repo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Demo URL</label>
              <input
                type="url"
                value={currentProject.demo_url || ''}
                onChange={(e) => updateField('demo_url', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="https://demo.example.com"
              />
            </div>
          </div>

          {/* Challenges */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Défis rencontrés
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ajouter un défi technique ou métier"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addChallenge(e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              {(currentProject.challenges || []).map((challenge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 bg-red-900/20 border border-red-500/30 rounded-lg"
                >
                  <span className="flex-1 text-red-200 text-sm">{challenge}</span>
                  <button
                    type="button"
                    onClick={() => removeChallenge(idx)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Solutions apportées
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ajouter une solution mise en place"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSolution(e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              {(currentProject.solutions || []).map((solution, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-500/30 rounded-lg"
                >
                  <span className="flex-1 text-green-200 text-sm">{solution}</span>
                  <button
                    type="button"
                    onClick={() => removeSolution(idx)}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Catégorie et rôle */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
              <input
                type="text"
                value={currentProject.category || ''}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="web, mobile, api, tool, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mon rôle</label>
              <input
                type="text"
                value={currentProject.my_role || ''}
                onChange={(e) => updateField('my_role', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Lead Developer, Full Stack, etc."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFormAI;