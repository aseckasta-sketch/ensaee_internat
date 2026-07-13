/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, Building, CreditCard, MessageSquare, Plus, Edit, Trash2, 
  Search, Filter, CheckCircle2, AlertTriangle, Clock, Send, 
  Download, ArrowUpRight, HelpCircle, Check, Wrench, Ban, ShieldCheck
} from 'lucide-react';
import { Eleve, Chambre, Paiement, Message, Facture } from '../types';
import { 
  getEleves, saveEleves, 
  getChambres, saveChambres, 
  getPaiements, savePaiements, 
  getMessages, saveMessages 
} from '../data';
import EnsaeLogo from './EnsaeLogo';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'eleves' | 'paiements' | 'chambres'>('stats');

  // Search & Filters
  const [searchEleve, setSearchEleve] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [searchPaiement, setSearchPaiement] = useState('');

  // Selected entities for actions
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [showEleveModal, setShowEleveModal] = useState(false);
  const [showPaiementModal, setShowPaiementModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileEleve, setProfileEleve] = useState<Eleve | null>(null);

  // New Student Form State
  const [studentForm, setStudentForm] = useState({
    id: '',
    nom: '',
    email: '',
    telephone: '',
    chambre: '101',
    typeLit: 'Simple',
    forfait: 'Pension complète + Internet Haut Débit',
    statut: 'actif' as 'actif' | 'suspendu',
    motDePasse: 'password123'
  });

  // New Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    eleveId: '',
    mois: 'Juillet 2026',
    montant: 35000,
    moyen: 'mobile_money' as 'especes' | 'virement' | 'mobile_money',
    typeFacture: 'Pension & Services'
  });

  // Reply Ticket State
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Initial Database load and updates
  const loadDatabase = () => {
    setEleves(getEleves());
    setChambres(getChambres());
    setPaiements(getPaiements());
    setMessages(getMessages());
  };

  useEffect(() => {
    loadDatabase();
  }, [activeTab]);

  // Calculations for Metrics
  const activeStudentsCount = eleves.filter(e => e.statut === 'actif').length;
  const occupiedChambersCount = chambres.filter(c => c.etat === 'occupee').length;
  const maintenanceChambersCount = chambres.filter(c => c.etat === 'en_travaux').length;
  const freeChambersCount = chambres.filter(c => c.etat === 'libre').length;

  // Revenue Calculations
  const totalRevenueThisYear = paiements.reduce((sum, p) => sum + p.montant, 0);
  
  // Simulated monthly payments for charts
  const revenueByMonthData = [
    { name: 'Jan', montant: 180000 },
    { name: 'Fév', montant: 220000 },
    { name: 'Mar', montant: 195000 },
    { name: 'Avr', montant: 240000 },
    { name: 'Mai', montant: paiements.filter(p => p.mois.includes('Mai')).reduce((sum, p) => sum + p.montant, 0) || 218000 },
    { name: 'Juin', montant: paiements.filter(p => p.mois.includes('Juin')).reduce((sum, p) => sum + p.montant, 0) || 89000 }
  ];

  const chamberStatusData = [
    { name: 'Occupées', value: occupiedChambersCount, color: '#047857' }, // Emerald 700
    { name: 'Libres', value: freeChambersCount, color: '#10b981' }, // Emerald 500
    { name: 'En travaux', value: maintenanceChambersCount, color: '#f59e0b' } // Amber 500
  ];

  // Forfait statistics
  const countInternet = eleves.filter(e => e.forfait.includes('Internet')).length;
  const countCantine = eleves.filter(e => e.forfait.includes('Pension') || e.forfait.includes('Demi-pension')).length;

  const servicesData = [
    { name: 'Option Internet', value: countInternet, color: '#6366f1' },
    { name: 'Option Cantine', value: countCantine, color: '#ec4899' },
    { name: 'Aucune option', value: eleves.length - Math.max(countInternet, countCantine), color: '#94a3b8' }
  ];

  // CRUD Students
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEleves = [...eleves];

    if (selectedEleve) {
      // Edit
      const index = updatedEleves.findIndex(el => el.id === selectedEleve.id);
      if (index !== -1) {
        // Keep their old invoices
        const oldInvoices = updatedEleves[index].factures;
        updatedEleves[index] = {
          ...updatedEleves[index],
          ...studentForm,
          factures: oldInvoices
        };

        // Update chamber occupancy
        updateChamberOccupants(selectedEleve.chambre, studentForm.chambre, selectedEleve.id);
      }
    } else {
      // Create New Student
      const newId = studentForm.nom.toLowerCase().replace(/\s+/g, '.');
      const newStudent: Eleve = {
        ...studentForm,
        id: newId,
        dateInscription: new Date().toISOString().split('T')[0],
        factures: [
          { id: 'f_new_1', type: 'Eau', montant: 5000, statut: 'en_attente', echeance: '2026-07-05' },
          { id: 'f_new_2', type: 'Électricité', montant: 10000, statut: 'en_attente', echeance: '2026-07-05' },
          { id: 'f_new_3', type: 'Cantine & Internet', montant: 25000, statut: 'en_attente', echeance: '2026-07-05' }
        ]
      };
      updatedEleves.push(newStudent);

      // Add to chamber
      addOccupantToChamber(studentForm.chambre, newId);
    }

    saveEleves(updatedEleves);
    setEleves(updatedEleves);
    setShowEleveModal(false);
    setSelectedEleve(null);
    resetStudentForm();
  };

  const handleEditStudentClick = (eleve: Eleve) => {
    setSelectedEleve(eleve);
    setStudentForm({
      id: eleve.id,
      nom: eleve.nom,
      email: eleve.email,
      telephone: eleve.telephone,
      chambre: eleve.chambre,
      typeLit: eleve.typeLit,
      forfait: eleve.forfait,
      statut: eleve.statut,
      motDePasse: eleve.motDePasse
    });
    setShowEleveModal(true);
  };

  const handleDeleteStudent = (eleveId: string, chamberNum: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élève de l\'internat ? Cette action est irréversible.')) {
      const updatedEleves = eleves.filter(el => el.id !== eleveId);
      saveEleves(updatedEleves);
      setEleves(updatedEleves);

      // Remove from chamber
      const allChambres = getChambres();
      const updatedChambres = allChambres.map(ch => {
        if (ch.numero === chamberNum) {
          const newOccs = ch.occupants.filter(id => id !== eleveId);
          return {
            ...ch,
            occupants: newOccs,
            etat: newOccs.length === 0 ? 'libre' as const : 'occupee' as const
          };
        }
        return ch;
      });
      saveChambres(updatedChambres);
      setChambres(updatedChambres);
    }
  };

  const handleToggleSuspend = (eleveId: string) => {
    const updated = eleves.map(el => {
      if (el.id === eleveId) {
        return { ...el, statut: el.statut === 'actif' ? 'suspendu' as const : 'actif' as const };
      }
      return el;
    });
    saveEleves(updated);
    setEleves(updated);
  };

  const resetStudentForm = () => {
    setStudentForm({
      id: '',
      nom: '',
      email: '',
      telephone: '',
      chambre: '101',
      typeLit: 'Simple',
      forfait: 'Pension complète + Internet Haut Débit',
      statut: 'actif',
      motDePasse: 'password123'
    });
  };

  // Chamber Occupants helpers
  const addOccupantToChamber = (chamberNum: string, studentId: string) => {
    const allChambres = getChambres();
    const updated = allChambres.map(ch => {
      if (ch.numero === chamberNum) {
        const newOccs = [...ch.occupants, studentId];
        return {
          ...ch,
          occupants: newOccs,
          etat: 'occupee' as const
        };
      }
      return ch;
    });
    saveChambres(updated);
    setChambres(updated);
  };

  const updateChamberOccupants = (oldChamber: string, newChamber: string, studentId: string) => {
    if (oldChamber === newChamber) return;
    const allChambres = getChambres();
    const updated = allChambres.map(ch => {
      // Remove from old
      if (ch.numero === oldChamber) {
        const newOccs = ch.occupants.filter(id => id !== studentId);
        return {
          ...ch,
          occupants: newOccs,
          etat: newOccs.length === 0 ? 'libre' as const : 'occupee' as const
        };
      }
      // Add to new
      if (ch.numero === newChamber) {
        const newOccs = [...ch.occupants, studentId];
        return {
          ...ch,
          occupants: newOccs,
          etat: 'occupee' as const
        };
      }
      return ch;
    });
    saveChambres(updated);
    setChambres(updated);
  };

  // Record a payment
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.eleveId) return;

    const targetStudent = eleves.find(el => el.id === paymentForm.eleveId);
    if (!targetStudent) return;

    // Save payment record
    const newPaiement: Paiement = {
      id: 'p_adm_' + Date.now(),
      eleveId: paymentForm.eleveId,
      eleveNom: targetStudent.nom,
      mois: paymentForm.mois,
      montant: Number(paymentForm.montant),
      date: new Date().toISOString().split('T')[0],
      moyen: paymentForm.moyen,
      typeFacture: paymentForm.typeFacture
    };

    const updatedPaiements = [newPaiement, ...paiements];
    savePaiements(updatedPaiements);
    setPaiements(updatedPaiements);

    // Update Student's invoices! Mark invoices of this type as paid
    const updatedEleves = eleves.map(el => {
      if (el.id === paymentForm.eleveId) {
        const updatedFactures = el.factures.map(f => {
          // If the invoice is unpaid and matches the recorded type, mark as paid
          if (f.statut !== 'paye' && f.type.toLowerCase().includes(paymentForm.typeFacture.split(' ')[0].toLowerCase())) {
            return { ...f, statut: 'paye' as const };
          }
          return f;
        });
        return { ...el, factures: updatedFactures };
      }
      return el;
    });

    saveEleves(updatedEleves);
    setEleves(updatedEleves);
    setShowPaiementModal(false);
  };

  // Export to CSV helper
  const handleExportPayments = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,Eleve,Mois,Montant,Date,Moyen,Type\n';
    paiements.forEach((p) => {
      csvContent += `${p.id},"${p.eleveNom}","${p.mois}",${p.montant},${p.date},"${p.moyen}","${p.typeFacture}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'historique_paiements_internat_ensae.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send automatic invoice reminder (simulated)
  const handleSendReminder = (eleve: Eleve) => {
    alert(`Rappel envoyé avec succès à ${eleve.nom} (${eleve.email}). Un message d'alerte s'affichera sur son tableau de bord.`);
  };

  // Reply student ticket
  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTicketId || !replyContent) return;

    const updatedMessages = messages.map(msg => {
      if (msg.id === replyTicketId) {
        return {
          ...msg,
          statut: 'repondu' as const,
          reponse: replyContent,
          reponseDate: new Date().toISOString().split('T')[0]
        };
      }
      return msg;
    });

    saveMessages(updatedMessages);
    setMessages(updatedMessages);
    setReplyTicketId(null);
    setReplyContent('');
  };

  // Chamber State Toggles
  const handleToggleChamberState = (chamberNum: string, currentEtat: 'libre' | 'occupee' | 'en_travaux') => {
    let nextState: 'libre' | 'occupee' | 'en_travaux' = 'libre';
    if (currentEtat === 'libre') nextState = 'en_travaux';
    else if (currentEtat === 'en_travaux') nextState = 'libre';
    else {
      alert('Cette chambre est actuellement occupée par des élèves. Modifiez l\'attribution des élèves avant de changer son état.');
      return;
    }

    const updated = chambres.map(ch => {
      if (ch.numero === chamberNum) {
        return { ...ch, etat: nextState };
      }
      return ch;
    });
    saveChambres(updated);
    setChambres(updated);
  };

  // Filter students based on search/status
  const filteredEleves = eleves.filter(el => {
    const matchesSearch = el.nom.toLowerCase().includes(searchEleve.toLowerCase()) || 
                          el.chambre.includes(searchEleve);
    const matchesStatut = filterStatut === 'tous' || el.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  // Filter payments
  const filteredPaiements = paiements.filter(p => {
    return p.eleveNom.toLowerCase().includes(searchPaiement.toLowerCase()) || 
           p.mois.toLowerCase().includes(searchPaiement.toLowerCase());
  });

  const viewStudentProfile = (eleve: Eleve) => {
    setProfileEleve(eleve);
    setShowProfileModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top Banner Navigation */}
      <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-40 px-4 lg:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <EnsaeLogo size={38} />
            <div>
              <span className="font-extrabold text-sm text-slate-900 block uppercase tracking-tight">BACK-OFFICE INTERNAT ENSAE</span>
              <span className="text-[10px] text-emerald-700 font-bold block -mt-1">Espace Administratif</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="font-bold text-xs text-slate-900 block">Asta Seck</span>
              <span className="text-[10px] text-slate-500 font-medium block">Administratrice Principale</span>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
              id="admin-logout-btn"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-2 block border-b border-slate-100 mb-2">Navigation</span>
            
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'stats' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
              id="admin-menu-stats"
            >
              <ArrowUpRight className="h-4 w-4" />
              Statistiques & Graphiques
            </button>

            <button
              onClick={() => setActiveTab('eleves')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'eleves' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
              id="admin-menu-eleves"
            >
              <Users className="h-4 w-4" />
              Gérer les Élèves
            </button>

            <button
              onClick={() => setActiveTab('paiements')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'paiements' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
              id="admin-menu-paiements"
            >
              <CreditCard className="h-4 w-4" />
              Suivre les Paiements
            </button>

            <button
              onClick={() => setActiveTab('chambres')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'chambres' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
              id="admin-menu-chambres"
            >
              <Building className="h-4 w-4" />
              Chambres & Pannes
            </button>
          </div>
        </div>

        {/* Dynamic Panels */}
        <div className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Statistics cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Élèves Actuels</span>
                    <div className="text-2xl lg:text-3xl font-extrabold text-slate-900">{activeStudentsCount}</div>
                    <span className="text-[9px] text-emerald-700 font-semibold">Inscrits officiellement</span>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Taux d'occupation</span>
                    <div className="text-2xl lg:text-3xl font-extrabold text-slate-900">
                      {Math.round((occupiedChambersCount / chambres.length) * 100)}%
                    </div>
                    <span className="text-[9px] text-slate-400">{occupiedChambersCount} / {chambres.length} chambres</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Revenus Perçus</span>
                    <div className="text-2xl lg:text-3xl font-extrabold text-emerald-800 font-mono">
                      {totalRevenueThisYear.toLocaleString('fr-FR')} F
                    </div>
                    <span className="text-[9px] text-emerald-700 font-semibold">Total depuis début 2026</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tickets Pannes</span>
                    <div className="text-2xl lg:text-3xl font-extrabold text-amber-600">
                      {messages.filter(m => m.statut !== 'repondu').length}
                    </div>
                    <span className="text-[9px] text-amber-700 font-semibold">Tickets actifs à traiter</span>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Revenue BarChart */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Évolution des Encaisses (F CFA)</h4>
                      <p className="text-[11px] text-slate-400">Paiements cumulés reçus mois par mois.</p>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={revenueByMonthData}>
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <Tooltip formatter={(value) => [`${value.toLocaleString()} F CFA`, 'Revenus']} />
                          <Bar dataKey="montant" fill="#047857" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chamber Occupancy PieChart */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Occupation de l'Internat</h4>
                      <p className="text-[11px] text-slate-400">Répartition des chambres selon leur état.</p>
                    </div>
                    <div className="h-64 flex flex-col justify-between">
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chamberStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {chamberStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-slate-100 pt-3">
                        <div>
                          <span className="text-slate-400 block">Occupées</span>
                          <span className="font-bold text-slate-900">{occupiedChambersCount}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Libres</span>
                          <span className="font-bold text-slate-900">{freeChambersCount}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">En travaux</span>
                          <span className="font-bold text-slate-900">{maintenanceChambersCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscriptions breakdown */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Répartition des Options de Forfait</h4>
                    <p className="text-[11px] text-slate-400">Abonnement aux services complémentaires (cantine, internet haut débit).</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="h-40 md:col-span-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={servicesData}
                            cx="50%"
                            cy="50%"
                            outerRadius={55}
                            dataKey="value"
                          >
                            {servicesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 md:col-span-2 text-xs">
                      {servicesData.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="font-bold text-slate-800">{entry.name}</span>
                          </div>
                          <span className="font-mono font-bold text-slate-600">{entry.value} Élèves ({Math.round((entry.value/eleves.length)*100)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'eleves' && (
              <motion.div
                key="eleves"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Search & Action bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchEleve}
                        onChange={(e) => setSearchEleve(e.target.value)}
                        placeholder="Rechercher élève ou chambre..."
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                        id="search-eleves-input"
                      />
                    </div>
                    
                    <select
                      value={filterStatut}
                      onChange={(e) => setFilterStatut(e.target.value)}
                      className="border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-600 focus:outline-none"
                    >
                      <option value="tous">Tous les statuts</option>
                      <option value="actif">Actifs</option>
                      <option value="suspendu">Suspendus</option>
                    </select>
                  </div>

                  <button
                    onClick={() => { setSelectedEleve(null); resetStudentForm(); setShowEleveModal(true); }}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-700/10"
                    id="btn-add-student"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un élève
                  </button>
                </div>

                {/* Table students list */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Élève</th>
                          <th className="p-4">Chambre</th>
                          <th className="p-4">Forfait</th>
                          <th className="p-4">Date Insc.</th>
                          <th className="p-4 text-center">Statut</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredEleves.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">Aucun élève ne correspond à votre recherche.</td>
                          </tr>
                        ) : (
                          filteredEleves.map((el) => (
                            <tr key={el.id} className="hover:bg-slate-50/40">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                                    {el.nom.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <span 
                                      className="font-bold text-slate-950 hover:text-emerald-700 transition-colors cursor-pointer block"
                                      onClick={() => viewStudentProfile(el)}
                                      id={`lnk-profile-${el.id}`}
                                    >
                                      {el.nom}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">{el.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-slate-900 block">Chambre {el.chambre}</span>
                                <span className="text-[10px] text-slate-500 block">Lit {el.typeLit}</span>
                              </td>
                              <td className="p-4">
                                <span className="text-slate-600 block max-w-[180px] truncate" title={el.forfait}>{el.forfait}</span>
                              </td>
                              <td className="p-4 text-slate-500">{el.dateInscription}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleToggleSuspend(el.id)}
                                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase transition-all cursor-pointer ${
                                    el.statut === 'actif' 
                                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' 
                                      : 'bg-red-50 text-red-800 hover:bg-red-100'
                                  }`}
                                  title="Cliquez pour changer le statut"
                                  id={`btn-status-toggle-${el.id}`}
                                >
                                  {el.statut === 'actif' ? 'Actif' : 'Suspendu'}
                                </button>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end items-center gap-2">
                                  <button
                                    onClick={() => handleEditStudentClick(el)}
                                    className="p-1.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:text-emerald-700 transition-colors cursor-pointer"
                                    title="Modifier la fiche"
                                    id={`btn-edit-eleve-${el.id}`}
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(el.id, el.chambre)}
                                    className="p-1.5 hover:bg-red-50 border border-slate-200 text-slate-600 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                    title="Supprimer l'élève"
                                    id={`btn-delete-eleve-${el.id}`}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'paiements' && (
              <motion.div
                key="paiements"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Search & Actions ledger */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchPaiement}
                        onChange={(e) => setSearchPaiement(e.target.value)}
                        placeholder="Rechercher par élève ou mois..."
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                        id="search-paiements-input"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleExportPayments}
                      className="w-full sm:w-auto px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      id="btn-export-csv"
                    >
                      <Download className="h-4 w-4" />
                      Exporter en CSV
                    </button>

                    <button
                      onClick={() => { setShowPaiementModal(true); }}
                      className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-700/10"
                      id="btn-record-payment"
                    >
                      <Plus className="h-4 w-4" />
                      Enregistrer un paiement
                    </button>
                  </div>
                </div>

                {/* Grid list late students and History ledger */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Late list */}
                  <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Élèves en Retard</h4>
                      <p className="text-[11px] text-slate-400">Suivi des factures impayées échues.</p>
                    </div>

                    <div className="space-y-3">
                      {eleves.filter(el => el.factures.some(f => f.statut === 'en_retard')).length === 0 ? (
                        <div className="text-center py-4 text-slate-400 text-xs">Aucun élève en retard de paiement. ✨</div>
                      ) : (
                        eleves
                          .filter(el => el.factures.some(f => f.statut === 'en_retard'))
                          .map((el) => {
                            const lateCount = el.factures.filter(f => f.statut === 'en_retard').length;
                            return (
                              <div key={el.id} className="flex justify-between items-center p-2.5 rounded-xl border border-red-100 bg-red-50/30">
                                <div>
                                  <span className="font-bold text-xs text-slate-950 block">{el.nom}</span>
                                  <span className="text-[10px] text-red-700 font-semibold block">{lateCount} facture(s) en retard</span>
                                </div>
                                <button
                                  onClick={() => handleSendReminder(el)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] rounded-lg transition-colors cursor-pointer"
                                  id={`btn-remind-${el.id}`}
                                >
                                  Rappeler
                                </button>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>

                  {/* Payment History ledger */}
                  <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Registre des Transactions</h4>
                      <p className="text-[11px] text-slate-400">Historique complet des paiements.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <th className="pb-3">Élève</th>
                            <th className="pb-3">Mois</th>
                            <th className="pb-3">Montant</th>
                            <th className="pb-3">Moyen</th>
                            <th className="pb-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredPaiements.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-slate-400">Aucune transaction trouvée.</td>
                            </tr>
                          ) : (
                            filteredPaiements.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-50/50">
                                <td className="py-3 font-bold text-slate-950">{p.eleveNom}</td>
                                <td className="py-3 text-slate-600">{p.mois}</td>
                                <td className="py-3 font-mono font-bold text-slate-800">{p.montant.toLocaleString('fr-FR')} F CFA</td>
                                <td className="py-3 text-slate-500 capitalize">{p.moyen.replace('_', ' ')}</td>
                                <td className="py-3 text-slate-400">{p.date}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {activeTab === 'chambres' && (
              <motion.div
                key="chambres"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
              >
                {/* Rooms Grid status Map */}
                <div className="md:col-span-7 bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Plan des Chambres de l'Internat</h4>
                    <p className="text-[11px] text-slate-400">Visualisation et gestion de l'état des chambres.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {chambres.map((ch) => (
                      <div 
                        key={ch.numero} 
                        className={`p-4 rounded-2xl border transition-all ${
                          ch.etat === 'occupee' ? 'bg-emerald-50/50 border-emerald-200' :
                          ch.etat === 'en_travaux' ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-extrabold text-slate-950 text-sm block">Chambre {ch.numero}</span>
                          <span className="text-[10px] text-slate-400 capitalize font-medium block">{ch.taille}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">
                            {ch.type.replace('_', ' ')}
                          </span>
                          
                          <div className="text-[11px]">
                            {ch.etat === 'occupee' ? (
                              <div className="space-y-0.5">
                                <span className="font-semibold text-emerald-800 block">Occupants ({ch.occupants.length}) :</span>
                                <div className="text-[10px] text-slate-600 line-clamp-2">
                                  {ch.occupants.map(id => eleves.find(e => e.id === id)?.nom || id).join(', ')}
                                </div>
                              </div>
                            ) : ch.etat === 'en_travaux' ? (
                              <span className="font-bold text-amber-700 block">⚠️ En travaux</span>
                            ) : (
                              <span className="font-bold text-slate-600 block">✔ Libre</span>
                            )}
                          </div>

                          <button
                            onClick={() => handleToggleChamberState(ch.numero, ch.etat)}
                            className="w-full mt-2 py-1 text-[9px] font-bold uppercase bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-600 transition-colors cursor-pointer"
                            id={`btn-chg-etat-ch-${ch.numero}`}
                          >
                            Changer d'état
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance Journal */}
                <div className="md:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Journal des Signalements & Pannes</h4>
                    <p className="text-[11px] text-slate-400">Tickets de pannes signalés par les résidents.</p>
                  </div>

                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                    {messages.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">Aucune panne signalée pour l'instant.</div>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block uppercase">{m.id} • {m.date}</span>
                              <h5 className="font-bold text-slate-900 text-xs mt-0.5">{m.sujet}</h5>
                              <span className="text-[10px] font-semibold text-slate-600">Par : {m.eleveNom}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              m.statut === 'repondu' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                            }`}>
                              {m.statut === 'repondu' ? 'Résolu' : 'À Traiter'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 italic">
                            "{m.message}"
                          </p>

                          {m.statut === 'repondu' && m.reponse ? (
                            <div className="bg-emerald-50/30 p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-700">
                              <span className="font-bold text-emerald-800 block text-[10px]">Résolu le {m.reponseDate} :</span>
                              <span>{m.reponse}</span>
                            </div>
                          ) : (
                            replyTicketId === m.id ? (
                              <form onSubmit={handleReplyTicket} className="space-y-2 pt-2 border-t border-slate-100">
                                <textarea
                                  required
                                  rows={2}
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Écrivez la solution ou réponse..."
                                  className="w-full text-xs p-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setReplyTicketId(null)}
                                    className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded cursor-pointer"
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded cursor-pointer"
                                    id={`btn-submit-reply-${m.id}`}
                                  >
                                    Résoudre
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => { setReplyTicketId(m.id); setReplyContent(''); }}
                                className="w-full py-1 text-[10px] font-bold bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-emerald-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                id={`btn-reply-${m.id}`}
                              >
                                <Wrench className="h-3.5 w-3.5" />
                                Répondre & Résoudre ticket
                              </button>
                            )
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* --- MODAL ADD / EDIT STUDENT --- */}
      {showEleveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl max-w-lg w-full p-6 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-md">
                {selectedEleve ? `Modifier la fiche de ${selectedEleve.nom}` : 'Ajouter un nouvel élève'}
              </h3>
              <button 
                onClick={() => { setShowEleveModal(false); setSelectedEleve(null); }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                id="btn-close-eleve-modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={studentForm.nom}
                    onChange={(e) => setStudentForm({ ...studentForm, nom: e.target.value })}
                    placeholder="Abdou Diallo"
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="abdou.diallo@ensae.sn"
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Téléphone</label>
                  <input
                    type="text"
                    required
                    value={studentForm.telephone}
                    onChange={(e) => setStudentForm({ ...studentForm, telephone: e.target.value })}
                    placeholder="+221 77 111 22 33"
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Attribuer Chambre</label>
                  <select
                    value={studentForm.chambre}
                    onChange={(e) => setStudentForm({ ...studentForm, chambre: e.target.value })}
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    {chambres.map(ch => (
                      <option key={ch.numero} value={ch.numero}>Chambre {ch.numero} ({ch.type.replace('_', ' ')})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Type de lit / Position</label>
                  <select
                    value={studentForm.typeLit}
                    onChange={(e) => setStudentForm({ ...studentForm, typeLit: e.target.value })}
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="Simple">Lit Simple (Chambre seule/double)</option>
                    <option value="Bas">Lit Superposé - Bas</option>
                    <option value="Haut">Lit Superposé - Haut</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Forfait souscrit</label>
                  <select
                    value={studentForm.forfait}
                    onChange={(e) => setStudentForm({ ...studentForm, forfait: e.target.value })}
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="Pension complète + Internet Haut Débit">Pension complète + Internet Haut Débit</option>
                    <option value="Demi-pension + Internet Standard">Demi-pension + Internet Standard</option>
                    <option value="Demi-pension seul">Demi-pension seul</option>
                    <option value="Logement seul + Wi-Fi Standard">Logement seul + Wi-Fi Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Mot de passe d'accès élève</label>
                <input
                  type="text"
                  required
                  value={studentForm.motDePasse}
                  onChange={(e) => setStudentForm({ ...studentForm, motDePasse: e.target.value })}
                  placeholder="password123"
                  className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowEleveModal(false); setSelectedEleve(null); }}
                  className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-center"
                  id="btn-submit-student-form"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL RECORD PAYMENT --- */}
      {showPaiementModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-md">Enregistrer un paiement manuel</h3>
              <button 
                onClick={() => setShowPaiementModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                id="btn-close-pay-modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Sélectionner l'Élève</label>
                <select
                  required
                  value={paymentForm.eleveId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, eleveId: e.target.value })}
                  className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="">-- Choisir un résident --</option>
                  {eleves.map(el => (
                    <option key={el.id} value={el.id}>{el.nom} (Chambre {el.chambre})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Période / Mois</label>
                  <input
                    type="text"
                    required
                    value={paymentForm.mois}
                    onChange={(e) => setPaymentForm({ ...paymentForm, mois: e.target.value })}
                    placeholder="Juin 2026"
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Montant (F CFA)</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.montant}
                    onChange={(e) => setPaymentForm({ ...paymentForm, montant: Number(e.target.value) })}
                    placeholder="35000"
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Moyen de paiement</label>
                  <select
                    value={paymentForm.moyen}
                    onChange={(e) => setPaymentForm({ ...paymentForm, moyen: e.target.value as any })}
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="mobile_money">Mobile Money (Wave/Orange)</option>
                    <option value="virement">Virement bancaire</option>
                    <option value="especes">Espèces</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Type Facture réglée</label>
                  <select
                    value={paymentForm.typeFacture}
                    onChange={(e) => setPaymentForm({ ...paymentForm, typeFacture: e.target.value })}
                    className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="Pension & Services">Forfait & Loyer Global</option>
                    <option value="Électricité">Électricité uniquement</option>
                    <option value="Eau">Eau uniquement</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaiementModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-center"
                  id="btn-submit-payment-form"
                >
                  Enregistrer paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL VIEW PROFILE / INDIVIDUAL SHEET --- */}
      {showProfileModal && profileEleve && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl max-w-2xl w-full p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Fiche Individuelle de Résidence</h3>
              <button 
                onClick={() => { setShowProfileModal(false); setProfileEleve(null); }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                id="btn-close-profile-modal"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Profile Details */}
              <div className="space-y-4 border-r border-slate-100 pr-0 sm:pr-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {profileEleve.nom.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{profileEleve.nom}</h4>
                    <span className="text-[10px] text-slate-400 block">{profileEleve.email}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-50 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Téléphone :</span>
                    <span className="font-bold text-slate-800">{profileEleve.telephone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chambre assignée :</span>
                    <span className="font-bold text-slate-800">Chambre {profileEleve.chambre} (Lit {profileEleve.typeLit})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Forfait académique :</span>
                    <span className="font-bold text-slate-800 text-right">{profileEleve.forfait}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date d'admission :</span>
                    <span className="font-bold text-slate-800">{profileEleve.dateInscription}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Statut compte :</span>
                    <span className={`font-bold uppercase text-[9px] px-2 py-0.5 rounded-full ${
                      profileEleve.statut === 'actif' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                    }`}>{profileEleve.statut}</span>
                  </div>
                </div>
              </div>

              {/* Invoices Status details */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">Bilan Facturation de l'Élève</h5>
                
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {profileEleve.factures.map((fac) => (
                    <div key={fac.id} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px]">
                      <div>
                        <span className="font-bold text-slate-800 block">{fac.type}</span>
                        <span className="text-slate-400 block">Échéance : {fac.echeance}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-700 block">{fac.montant.toLocaleString('fr-FR')} F CFA</span>
                        <span className={`font-bold uppercase text-[9px] block ${
                          fac.statut === 'paye' ? 'text-emerald-700' :
                          fac.statut === 'en_retard' ? 'text-red-700 font-extrabold animate-pulse' : 'text-slate-500'
                        }`}>
                          {fac.statut === 'paye' ? 'Réglé' : fac.statut === 'en_retard' ? 'En Retard' : 'En Attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Reste à payer :</span>
                    <span className="font-mono font-extrabold text-red-700">
                      {profileEleve.factures
                        .filter(f => f.statut !== 'paye')
                        .reduce((sum, f) => sum + f.montant, 0)
                        .toLocaleString('fr-FR')}{' '}
                      F CFA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <button
                onClick={() => { setShowProfileModal(false); setProfileEleve(null); }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
