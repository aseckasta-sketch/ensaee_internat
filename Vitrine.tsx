/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, ShieldCheck, Wifi, Coffee, Sparkles, HelpCircle, 
  Send, DollarSign, FileText, ArrowRight, CheckCircle2, User, 
  MapPin, Check, Image as ImageIcon, Flame, Droplets, Zap
} from 'lucide-react';
import EnsaeLogo from './EnsaeLogo';

interface VitrineProps {
  onGoToLogin: () => void;
}

export default function Vitrine({ onGoToLogin }: VitrineProps) {
  const [activeTab, setActiveTab] = useState<'accueil' | 'chambres' | 'services' | 'tarifs' | 'inscription' | 'galerie' | 'contact'>('accueil');
  const [galleryFilter, setGalleryFilter] = useState<'tous' | 'chambres' | 'communs' | 'services'>('tous');
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Inscription Multi-step simulation or Quick Check
  const [inscrName, setInscrName] = useState('');
  const [inscrEmail, setInscrEmail] = useState('');
  const [inscrDossier, setInscrDossier] = useState<File | null>(null);
  const [inscrStep, setInscrStep] = useState(1);
  const [inscrSuccess, setInscrSuccess] = useState(false);

  const keyStats = [
    { value: '120+', label: 'Chambres Modernes' },
    { value: '3', label: 'Types d\'Hébergement' },
    { value: '24h/24', label: 'Sécurité & Wi-Fi' },
    { value: '100%', label: 'Élèves Satisfaits' },
  ];

  const chambersList = [
    {
      type: 'chambre_seule',
      name: 'Chambre Individuelle',
      tagline: 'Le calme absolu pour vos études',
      size: '12 m²',
      price: '50 000 F CFA / mois',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      equipments: ['Lit simple grand confort', 'Bureau avec lampe d\'étude', 'Armoire de rangement', 'Salle d\'eau privative', 'Connexion Wi-Fi dédiée', 'Ventilateur de plafond'],
    },
    {
      type: 'chambre_double',
      name: 'Chambre Double',
      tagline: 'L\'équilibre parfait entre partage et indépendance',
      size: '18 m²',
      price: '35 000 F CFA / mois',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
      equipments: ['2 Lits simples séparés', '2 Bureaux individuels', 'Grand placard partagé', 'Salle d\'eau privative', 'Wi-Fi haut débit', 'Climatisation optionnelle'],
    },
    {
      type: 'lits_superposes',
      name: 'Chambre Lits Superposés',
      tagline: 'Une solution économique et conviviale',
      size: '16 m²',
      price: '25 000 F CFA / mois',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      equipments: ['Lits superposés robustes', '2 Tables d\'étude adaptées', '2 Casiers sécurisés', 'Salle d\'eau partagée', 'Wi-Fi haut débit', 'Ventilateur'],
    }
  ];

  const servicesList = [
    { icon: <Droplets className="h-6 w-6 text-blue-600" />, title: 'Eau Potable & Chauffage', desc: 'Approvisionnement continu en eau potable, avec chauffe-eau installés dans toutes les salles de bains.' },
    { icon: <Zap className="h-6 w-6 text-amber-500" />, title: 'Électricité 24h/24', desc: 'Groupe électrogène de secours automatique pour garantir une alimentation électrique ininterrompue.' },
    { icon: <Wifi className="h-6 w-6 text-emerald-600" />, title: 'Wi-Fi Très Haut Débit', desc: 'Fibre optique disponible dans toutes les chambres et les espaces d\'étude partagés.' },
    { icon: <Coffee className="h-6 w-6 text-red-500" />, title: 'Restauration / Cantine', desc: '3 repas par jour, équilibrés et préparés sur place par un chef cuisinier (plats sénégalais et internationaux).' },
    { icon: <Sparkles className="h-6 w-6 text-indigo-500" />, title: 'Laverie Moderne', desc: 'Lave-linges et sèche-linges professionnels en libre accès pour les résidents de l\'internat.' },
    { icon: <Building className="h-6 w-6 text-slate-700" />, title: 'Espaces Communs', desc: 'Bibliothèques calmes pour le travail de groupe, salon de détente équipé de télévisions et canapés.' },
  ];

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80', cat: 'chambres', caption: 'Chambre Individuelle Confort' },
    { src: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', cat: 'chambres', caption: 'Chambre Double Spacieuse' },
    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80', cat: 'chambres', caption: 'Espace Lits Superposés' },
    { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=600&q=80', cat: 'services', caption: 'La Cantine / Réfectoire chaleureux' },
    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80', cat: 'communs', caption: 'Espace d\'étude et bibliothèque' },
    { src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80', cat: 'communs', caption: 'Salle de détente et télévision' },
  ];

  const filteredGallery = galleryFilter === 'tous' 
    ? galleryImages 
    : galleryImages.filter(img => img.cat === galleryFilter);

  const faqs = [
    { q: 'Qui peut bénéficier de l\'internat de l\'ENSAE ?', a: 'L\'accès à l\'internat est réservé en priorité aux élèves ingénieurs inscrits à l\'ENSAE Sénégal, notamment ceux qui viennent des régions ou de l\'étranger.' },
    { q: 'Quels sont les documents à fournir pour l\'inscription ?', a: 'Il faut fournir une copie de l\'attestation d\'admission à l\'ENSAE, une pièce d\'identité, deux photos d\'identité, un certificat médical d\'aptitude à la vie en communauté et un justificatif de paiement de la caution.' },
    { q: 'Le Wi-Fi est-il inclus dans tous les forfaits ?', a: 'Oui, une connexion Wi-Fi standard par fibre optique est incluse dans tous les forfaits. Une option Wi-Fi Très Haut Débit dédiée est incluse dans les forfaits supérieurs.' },
    { q: 'Comment sont attribués les colocataires en chambre double ?', a: 'L\'administration attribue les colocataires en fonction des affinités indiquées lors de l\'inscription, de l\'âge et du cycle d\'étude. Vous pouvez également spécifier le nom d\'un élève avec qui vous souhaitez cohabiter.' },
    { q: 'Quel est le montant de la caution et est-elle remboursable ?', a: 'La caution équivaut à un mois de loyer selon la chambre choisie. Elle est entièrement remboursable en fin d\'année scolaire après l\'état des lieux de sortie, si aucun dégât n\'est constaté.' }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ nom: '', email: '', sujet: '', message: '' });
    }, 2000);
  };

  const handleInscriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInscrSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <EnsaeLogo size={42} />
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block">INTERNAT ENSAE</span>
              <span className="text-[10px] text-emerald-700 font-bold tracking-widest uppercase block -mt-1">Excellence & Confort</span>
            </div>
          </div>
          
          {/* Public tabs */}
          <div className="flex flex-wrap justify-center items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['accueil', 'chambres', 'services', 'tarifs', 'inscription', 'galerie', 'contact'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setContactSubmitted(false); setInscrSuccess(false); setInscrStep(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-white text-emerald-800 shadow-sm' 
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-white/50'
                }`}
                id={`tab-nav-${tab}`}
              >
                {tab === 'accueil' ? 'Accueil' : 
                 tab === 'chambres' ? 'Chambres' : 
                 tab === 'services' ? 'Services' : 
                 tab === 'tarifs' ? 'Tarifs' : 
                 tab === 'inscription' ? 'Inscription' : 
                 tab === 'galerie' ? 'Galerie' : 'Contact & FAQ'}
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md shadow-emerald-700/10 hover:shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
              id="btn-nav-login"
            >
              <User className="h-4 w-4" />
              Espace Personnel
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Render */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'accueil' && (
            <motion.div
              key="accueil"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Hero Banner Section */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[460px] flex items-center p-8 lg:p-16 shadow-lg">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80" 
                    alt="Campus ENSAE" 
                    className="w-full h-full object-cover opacity-25 filter grayscale brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-2xl space-y-6">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                    <Sparkles className="h-3.5 w-3.5" />
                    Nouveau & Moderne
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    Votre second foyer d'excellence à l'ENSAE Sénégal
                  </h1>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    Un cadre d'apprentissage exceptionnel, sécurisé, connecté et conçu pour la réussite académique des futurs ingénieurs statisticiens économistes.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab('inscription')}
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/30 cursor-pointer flex items-center gap-2 group"
                      id="hero-btn-inscription"
                    >
                      S'inscrire en ligne
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setActiveTab('chambres')}
                      className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 rounded-xl font-bold text-sm uppercase tracking-wider transition-all cursor-pointer"
                      id="hero-btn-chambres"
                    >
                      Découvrir les chambres
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Figures section */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {keyStats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all text-center">
                    <div className="text-3xl lg:text-4xl font-extrabold text-emerald-800 tracking-tight mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Core Presentation Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-4">
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Pourquoi choisir notre internat ?
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    L'internat de l'ENSAE n'est pas seulement un lieu de couchage, c'est une véritable communauté étudiante favorisant l'entraide, le partage et l'émulation scientifique. Nos résidents disposent de toutes les commodités modernes pour se concentrer uniquement sur leurs études.
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Sécurité renforcée 24h/24</h4>
                        <p className="text-xs text-slate-500">Gardiens à l'entrée, caméras de surveillance et contrôle d'accès électronique.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Fibre Optique Dédiée</h4>
                        <p className="text-xs text-slate-500">Un réseau Wi-Fi haut débit robuste dans tout le campus pour vos recherches.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Emplacement Idéal</h4>
                        <p className="text-xs text-slate-500">Situé à quelques pas des salles de cours et des laboratoires de l'ENSAE.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-4 bg-emerald-700/5 rounded-[2.5rem] transform -rotate-2" />
                  <img 
                    src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=700&q=80" 
                    alt="Vie étudiante" 
                    className="relative z-10 rounded-[2rem] shadow-md w-full object-cover h-[350px]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chambres' && (
            <motion.div
              key="chambres"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 animate-fade-in"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Découvrez Nos Chambres</h2>
                <p className="text-slate-600">
                  Nous proposons trois types de configurations d'hébergement adaptées aux besoins et au budget de chaque élève. Chaque logement est entièrement meublé et prêt à vous accueillir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {chambersList.map((ch, idx) => (
                  <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200/75 shadow-sm hover:shadow-lg transition-all flex flex-col group">
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img 
                        src={ch.image} 
                        alt={ch.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-emerald-800 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                        {ch.size}
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{ch.name}</h3>
                      <p className="text-xs text-emerald-700 font-medium mb-4">{ch.tagline}</p>
                      
                      <div className="space-y-2 mb-6 flex-grow">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Équipements inclus :</span>
                        <ul className="space-y-1.5">
                          {ch.equipments.map((eq, eIdx) => (
                            <li key={eIdx} className="flex items-center gap-2 text-xs text-slate-600">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              {eq}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Tarif mensuel</span>
                            <span className="font-extrabold text-emerald-800 text-md">{ch.price}</span>
                          </div>
                          <button
                            onClick={() => setActiveTab('inscription')}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            id={`btn-select-chambre-${ch.type}`}
                          >
                            Réserver
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Services & Commodités</h2>
                <p className="text-slate-600">
                  Pour garantir des conditions de vie optimales, notre internat propose une gamme complète de services inclus pour tous les pensionnaires.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesList.map((sv, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
                      {sv.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-md">{sv.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{sv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'tarifs' && (
            <motion.div
              key="tarifs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tarifs de l'Internat</h2>
                <p className="text-slate-600">
                  Des tarifs transparents, comparatifs et adaptés pour les étudiants de l'ENSAE Sénégal.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden max-w-4xl mx-auto">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider">
                        <th className="p-4 lg:p-5">Prestations & Forfaits</th>
                        <th className="p-4 lg:p-5 text-center">Chambre Lits Superposés</th>
                        <th className="p-4 lg:p-5 text-center">Chambre Double</th>
                        <th className="p-4 lg:p-5 text-center">Chambre Seule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      <tr>
                        <td className="p-4 font-bold text-slate-900">Loyer mensuel de base</td>
                        <td className="p-4 text-center text-slate-600">25 000 F CFA</td>
                        <td className="p-4 text-center text-slate-600">35 000 F CFA</td>
                        <td className="p-4 text-center text-slate-600">50 000 F CFA</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-900">Eau & Électricité (Inclus)</td>
                        <td className="p-4 text-center text-emerald-700 font-bold">✔ Inclus</td>
                        <td className="p-4 text-center text-emerald-700 font-bold">✔ Inclus</td>
                        <td className="p-4 text-center text-emerald-700 font-bold">✔ Inclus</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-900">Wi-Fi Fibre Optique Standard</td>
                        <td className="p-4 text-center text-emerald-700 font-bold">✔ Inclus</td>
                        <td className="p-4 text-center text-emerald-700 font-bold">✔ Inclus</td>
                        <td className="p-4 text-center text-emerald-700 font-bold">✔ Inclus</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-900">Accès Cantine (Forfait Optionnel)</td>
                        <td className="p-4 text-center text-slate-600">+15 000 F CFA / mois</td>
                        <td className="p-4 text-center text-slate-600">+15 000 F CFA / mois</td>
                        <td className="p-4 text-center text-slate-600">+15 000 F CFA / mois</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-900">Option Climatisation</td>
                        <td className="p-4 text-center text-slate-400">Non disponible</td>
                        <td className="p-4 text-center text-slate-600">+10 000 F CFA / mois</td>
                        <td className="p-4 text-center text-slate-600">+10 000 F CFA / mois</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="p-4 text-slate-900">Caution (Une seule fois, remboursable)</td>
                        <td className="p-4 text-center text-emerald-800">25 000 F CFA</td>
                        <td className="p-4 text-center text-emerald-800">35 000 F CFA</td>
                        <td className="p-4 text-center text-emerald-800">50 000 F CFA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'inscription' && (
            <motion.div
              key="inscription"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inscription & Conditions</h2>
                <p className="text-slate-600">
                  Veuillez prendre connaissance des conditions générales et remplir notre formulaire de pré-inscription pour réserver votre logement.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Rules & Conditions list */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-700" />
                      Dossier à fournir
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Copie de la carte nationale d'identité sénégalaise (ou passeport pour étrangers)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Attestation d'admission ou carte d'étudiant de l'ENSAE</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Certificat médical datant de moins de 3 mois</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Reçu du virement de la caution de garantie</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-slate-100 pt-5">
                    <h3 className="font-bold text-slate-900 text-md mb-3">Étapes de la démarche</h3>
                    <div className="relative pl-6 border-l-2 border-emerald-700/30 space-y-4 text-xs">
                      <div className="relative">
                        <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[10px]">1</div>
                        <h4 className="font-bold text-slate-900 mb-0.5">Formulaire de pré-inscription</h4>
                        <p className="text-slate-500 text-[11px]">Remplissez le formulaire en ligne avec vos choix et documents.</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[10px]">2</div>
                        <h4 className="font-bold text-slate-900 mb-0.5">Étude du dossier</h4>
                        <p className="text-slate-500 text-[11px]">L'administration étudie les demandes selon l'éloignement et les places disponibles.</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[10px]">3</div>
                        <h4 className="font-bold text-slate-900 mb-0.5">Validation et attribution</h4>
                        <p className="text-slate-500 text-[11px]">Vous recevez un email contenant votre identifiant pour l'espace élève avec les détails de votre chambre.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Module */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                  {inscrSuccess ? (
                    <div className="text-center py-12 space-y-4" id="inscription-success-msg">
                      <div className="h-16 w-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Demande Soumise avec Succès !</h3>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Merci {inscrName}. Votre dossier a été transmis à l'équipe de gestion de l'internat (Asta Seck & Mouhamadou Ndiaye). Nous l'étudierons sous 48 heures.
                      </p>
                      <button
                        onClick={() => { setInscrSuccess(false); setInscrName(''); setInscrEmail(''); }}
                        className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        id="btn-re-register"
                      >
                        Faire une autre demande
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInscriptionSubmit} className="space-y-4">
                      <h3 className="font-bold text-slate-900 text-md border-b border-slate-100 pb-2">
                        Formulaire de Pré-Inscription en Ligne
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nom complet</label>
                          <input 
                            type="text" 
                            required 
                            value={inscrName}
                            onChange={(e) => setInscrName(e.target.value)}
                            placeholder="Moussa Ndiaye" 
                            className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email académique ou personnel</label>
                          <input 
                            type="email" 
                            required 
                            value={inscrEmail}
                            onChange={(e) => setInscrEmail(e.target.value)}
                            placeholder="moussa.ndiaye@ensae.sn" 
                            className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Téléphone</label>
                          <input 
                            type="tel" 
                            required 
                            placeholder="+221 77 123 45 67" 
                            className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cycle d'étude</label>
                          <select className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700">
                            <option>ITS (Ingénieurs des Travaux Statistiques)</option>
                            <option>ISE (Ingénieurs Statisticiens Économistes)</option>
                            <option>Master Spécialisé</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Choix de la chambre</label>
                          <select className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700">
                            <option>Chambre Lits Superposés (25 000 F CFA/mois)</option>
                            <option>Chambre Double (35 000 F CFA/mois)</option>
                            <option>Chambre Individuelle (50 000 F CFA/mois)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Option Forfait Repas (Cantine)</label>
                          <select className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700">
                            <option>Aucun (Gestion autonome)</option>
                            <option>Pension Complète (3 repas / jour - 15 000 F CFA/mois)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Charger un document justificatif (Admissibilité/Carte d'étudiant)</label>
                        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-700 rounded-xl p-4 transition-all text-center relative bg-slate-50">
                          <input 
                            type="file" 
                            required
                            onChange={(e) => setInscrDossier(e.target.files ? e.target.files[0] : null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <p className="text-xs text-slate-600 font-semibold mb-0.5">
                            {inscrDossier ? `Fichier sélectionné : ${inscrDossier.name}` : 'Glissez-déposez ou cliquez pour ajouter votre attestation'}
                          </p>
                          <p className="text-[10px] text-slate-400">Format PDF ou JPG, taille maximum 5 Mo</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                          id="btn-submit-inscription-form"
                        >
                          Envoyer ma demande de pré-inscription
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'galerie' && (
            <motion.div
              key="galerie"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Galerie Photo</h2>
                <p className="text-slate-600">
                  Visualisez les chambres, le réfectoire et les divers espaces conviviaux qui composent notre internat.
                </p>
              </div>

              {/* Filtering Controls */}
              <div className="flex justify-center items-center gap-2 flex-wrap">
                {(['tous', 'chambres', 'communs', 'services'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setGalleryFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
                      galleryFilter === filter 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-white text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/60'
                    }`}
                    id={`btn-gallery-filter-${filter}`}
                  >
                    {filter === 'tous' ? 'Tous' : 
                     filter === 'chambres' ? 'Chambres' : 
                     filter === 'communs' ? 'Espaces Communs' : 'Services & Cantine'}
                  </button>
                ))}
              </div>

              {/* Grid of gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((img, idx) => (
                  <motion.div 
                    layout
                    key={idx} 
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm group hover:shadow-md transition-all"
                  >
                    <div className="h-48 overflow-hidden bg-slate-100 relative">
                      <img 
                        src={img.src} 
                        alt={img.caption} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-bold text-slate-800">{img.caption}</p>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase">{img.cat === 'chambres' ? 'Chambres' : img.cat === 'communs' ? 'Espaces communs' : 'Services'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* FAQ Accordions */}
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Foire Aux Questions (FAQ)</h2>
                  <p className="text-slate-600">
                    Retrouvez les réponses aux interrogations les plus fréquentes concernant l'accès, le règlement et les forfaits.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
                  {faqs.map((faq, idx) => (
                    <details key={idx} className="group py-4" id={`faq-accordion-${idx}`}>
                      <summary className="flex justify-between items-center font-bold text-slate-950 text-sm cursor-pointer list-none">
                        <span>{faq.q}</span>
                        <span className="transition group-open:rotate-180 text-emerald-700 font-bold shrink-0 ml-4">▼</span>
                      </summary>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed pl-1">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Contact Form Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4 items-stretch">
                <div className="bg-emerald-900 text-white p-8 rounded-3xl space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-extrabold tracking-tight">Coordonnées de l'Internat</h3>
                    <p className="text-emerald-100 text-xs leading-relaxed">
                      L'administration de l'internat de l'ENSAE Sénégal est à votre disposition pour toute information complémentaire. N'hésitez pas à nous joindre ou à nous rendre visite.
                    </p>
                  </div>
                  
                  <div className="space-y-4 text-xs pt-4">
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold block text-emerald-200">Notre Adresse :</span>
                        <span>Campus ENSAE, Université Amadou Mahtar Mbow (UAM), Dakar, Sénégal</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <HelpCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold block text-emerald-200">Email de Contact :</span>
                        <span>internat@ensae.sn</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-emerald-800 pt-6 mt-6">
                    <span className="text-[10px] text-emerald-300 font-bold tracking-wider block uppercase">Responsables de la plateforme</span>
                    <span className="font-bold text-xs block text-white mt-1">Asta Seck & Mouhamadou Ndiaye</span>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-center">
                  {contactSubmitted ? (
                    <div className="text-center py-12 space-y-4" id="contact-success-msg">
                      <div className="h-14 w-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Message Envoyé !</h3>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Merci pour votre message. Nous reviendrons vers vous par email dans les plus brefs délais.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-lg">Écrivez-nous un message</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Votre Nom</label>
                          <input 
                            type="text" 
                            required 
                            value={contactForm.nom}
                            onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })}
                            placeholder="Aline Diallo" 
                            className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Votre Email</label>
                          <input 
                            type="email" 
                            required 
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="aline@gmail.com" 
                            className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sujet</label>
                        <input 
                          type="text" 
                          required 
                          value={contactForm.sujet}
                          onChange={(e) => setContactForm({ ...contactForm, sujet: e.target.value })}
                          placeholder="Demande de renseignements particuliers" 
                          className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Message</label>
                        <textarea 
                          rows={4} 
                          required 
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Votre message ici..." 
                          className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group"
                          id="btn-submit-contact-form"
                        >
                          Envoyer le message
                          <Send className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-white font-bold text-sm">E</div>
            <div>
              <span className="font-bold text-slate-200 block text-xs">Internat ENSAE Sénégal</span>
              <span className="text-[9px] text-slate-500 block">© 2026 Tous droits réservés</span>
            </div>
          </div>
          
          <div className="flex gap-4 text-xs font-medium">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('accueil')}>Accueil</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('chambres')}>Chambres</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('tarifs')}>Tarifs</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('contact')}>Contact</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Développé pour l'ENSAE Sénégal par</span>
            <span className="font-bold text-xs text-emerald-400">Asta Seck & Mouhamadou Ndiaye</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
