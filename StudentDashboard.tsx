/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, LogOut, FileText, Send, Bell, CheckCircle2, 
  Clock, AlertTriangle, MessageSquare, CreditCard, User, 
  HelpCircle, Sparkles, Laptop, ShieldAlert, Check
} from 'lucide-react';
import { Eleve, Chambre, Paiement, Message } from '../types';
import EnsaeLogo from './EnsaeLogo';
import { 
  getChambres, 
  getPaiements, 
  getMessages, 
  saveMessages, 
  getEleves, 
  saveEleves 
} from '../data';

interface StudentDashboardProps {
  student: Eleve;
  onLogout: () => void;
}

export default function StudentDashboard({ student: initialStudent, onLogout }: StudentDashboardProps) {
  const [student, setStudent] = useState<Eleve>(initialStudent);
  const [chambre, setChambre] = useState<Chambre | null>(null);
  const [colocataires, setColocataires] = useState<string[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'tableau' | 'factures' | 'messagerie'>('tableau');

  // New Message State
  const [msgSujet, setMsgSujet] = useState('');
  const [msgContenu, setMsgContenu] = useState('');
  const [msgSuccess, setMsgSuccess] = useState(false);

  // Load and refresh student specific details
  useEffect(() => {
    // Reload state from local storage to keep edits synced
    const allStudents = getEleves();
    const updatedStudent = allStudents.find((el) => el.id === student.id) || student;
    setStudent(updatedStudent);

    // Get chamber details
    const allChambres = getChambres();
    const myChambre = allChambres.find((ch) => ch.numero === updatedStudent.chambre);
    setChambre(myChambre || null);

    if (myChambre) {
      // Find roommates (exclude self)
      const roommateNames: string[] = [];
      myChambre.occupants.forEach((occId) => {
        if (occId !== updatedStudent.id) {
          const occStudent = allStudents.find((el) => el.id === occId);
          if (occStudent) roommateNames.push(occStudent.nom);
        }
      });
      setColocataires(roommateNames);
    }

    // Get student payments
    const allPaiements = getPaiements();
    const myPaiements = allPaiements.filter((p) => p.eleveId === updatedStudent.id);
    setPaiements(myPaiements);

    // Get student messages
    const allMessages = getMessages();
    const myMessages = allMessages.filter((m) => m.eleveId === updatedStudent.id);
    setMessages(myMessages);
  }, [student.id, activeTab]);

  // Handle message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSujet || !msgContenu) return;

    const allMessages = getMessages();
    const newMsg: Message = {
      id: 'm_' + Date.now(),
      eleveId: student.id,
      eleveNom: student.nom,
      sujet: msgSujet,
      message: msgContenu,
      date: new Date().toISOString().split('T')[0],
      statut: 'recu',
      reponse: '',
      reponseDate: ''
    };

    const updatedMessages = [newMsg, ...allMessages];
    saveMessages(updatedMessages);
    setMessages(updatedMessages.filter((m) => m.eleveId === student.id));
    
    setMsgSujet('');
    setMsgContenu('');
    setMsgSuccess(true);
    setTimeout(() => setMsgSuccess(false), 3000);
  };

  // Pay invoice simulation
  const handlePayInvoice = (invoiceId: string) => {
    const allStudents = getEleves();
    const updatedStudents = allStudents.map((el) => {
      if (el.id === student.id) {
        const updatedFactures = el.factures.map((f) => {
          if (f.id === invoiceId) {
            return { ...f, statut: 'paye' as const };
          }
          return f;
        });

        // Also add to payments history!
        const unpaidInvoice = el.factures.find((f) => f.id === invoiceId);
        if (unpaidInvoice) {
          const allPaiements = getPaiements();
          const newPaiement: Paiement = {
            id: 'p_' + Date.now(),
            eleveId: student.id,
            eleveNom: student.nom,
            mois: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            montant: unpaidInvoice.montant,
            date: new Date().toISOString().split('T')[0],
            moyen: 'mobile_money',
            typeFacture: unpaidInvoice.type
          };
          localStorage.setItem('ensae_internat_paiements', JSON.stringify([newPaiement, ...allPaiements]));
        }

        return { ...el, factures: updatedFactures };
      }
      return el;
    });

    saveEleves(updatedStudents);
    const updatedSelf = updatedStudents.find((el) => el.id === student.id);
    if (updatedSelf) {
      setStudent(updatedSelf);
    }
    
    // Refresh payments list
    const allPaiements = getPaiements();
    setPaiements(allPaiements.filter((p) => p.eleveId === student.id));
  };

  // Extract statistics
  const overdueBills = student.factures.filter((f) => f.statut === 'en_retard');
  const pendingBills = student.factures.filter((f) => f.statut === 'en_attente');
  const totalDue = student.factures
    .filter((f) => f.statut !== 'paye')
    .reduce((sum, f) => sum + f.montant, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top Banner */}
      <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-40 px-4 lg:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <EnsaeLogo size={38} />
            <div>
              <span className="font-extrabold text-sm text-slate-900 block uppercase tracking-tight">ESPACE ÉLÈVE ENSAE</span>
              <span className="text-[10px] text-emerald-700 font-bold block -mt-1">Connecté en tant que Résident</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="font-bold text-xs text-slate-900 block">{student.nom}</span>
              <span className="text-[10px] text-slate-500 font-medium block">Chambre {student.chambre} • Lit {student.typeLit}</span>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
              id="btn-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-extrabold text-xs">
                {student.nom.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-slate-900">{student.nom}</h3>
                <span className="text-[10px] text-slate-400 block">{student.email}</span>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('tableau')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'tableau' 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                }`}
                id="student-menu-tableau"
              >
                <Building className="h-4 w-4" />
                Tableau de bord
              </button>
              
              <button
                onClick={() => setActiveTab('factures')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'factures' 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                }`}
                id="student-menu-factures"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4" />
                  Factures & Paiements
                </div>
                {overdueBills.length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {overdueBills.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('messagerie')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'messagerie' 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                }`}
                id="student-menu-messagerie"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="h-4 w-4" />
                  Messagerie administrative
                </div>
                {messages.length > 0 && (
                  <span className="bg-slate-200 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {messages.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Quick billing status helper */}
          {overdueBills.length > 0 && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 shadow-inner">
              <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
              <div className="space-y-1">
                <span className="font-bold text-xs text-red-950 block">Paiement en retard !</span>
                <p className="text-[10px] text-red-700 leading-relaxed">
                  Vous avez {overdueBills.length} facture(s) en retard. Veuillez régulariser votre situation rapidement pour éviter la suspension de vos accès.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Panels */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'tableau' && (
              <motion.div
                key="tableau"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Notifications section / Banner */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                    <Bell className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1 flex-grow">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      Message global de l'administration
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      "Chers résidents, les états de lieux intermédiaires débuteront la semaine prochaine. Veuillez vous assurer que vos chambres sont prêtes." - Asta Seck, Administratrice.
                    </p>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">Aujourd'hui</span>
                </div>

                {/* Grid Chamber details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chamber Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mon Hébergement</span>
                        <h4 className="font-extrabold text-2xl text-slate-950">Chambre {student.chambre}</h4>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100 shadow-sm">
                        <Building className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Type de chambre</span>
                        <span className="font-bold text-slate-900">
                          {chambre?.type === 'simple' ? 'Chambre Seule' : 
                           chambre?.type === 'double' ? 'Chambre Double' : 'Lits Superposés'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Position du Lit</span>
                        <span className="font-bold text-slate-900">Lit {student.typeLit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Superficie</span>
                        <span className="font-bold text-slate-900">{chambre?.taille || '16 m²'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Statut Chambre</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                          Conforme
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Roommates Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mes Colocataires</span>
                      <h4 className="font-extrabold text-slate-950 text-lg mt-1">
                        {chambre?.type === 'simple' ? 'Aucun colocataire' : `${colocataires.length} Personne(s)`}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {chambre?.type === 'simple' ? 'Vous occupez une chambre individuelle.' : 'Élève(s) partageant la même chambre que vous.'}
                      </p>
                    </div>

                    {colocataires.length > 0 && (
                      <div className="space-y-2 border-t border-slate-100 pt-4">
                        {colocataires.map((nom, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-[11px]">
                              {nom.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-950 block">{nom}</span>
                              <span className="text-[10px] text-slate-400 block">Élève Ingénieur ENSAE</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Forfait Card & Invoices Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Forfait info */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3 col-span-1 md:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mon Forfait & Services</span>
                    <h4 className="font-extrabold text-sm text-slate-950">{student.forfait}</h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-xs">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-700" />
                        <span>Cantine Incluse</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-700" />
                        <span>Fibre Optique</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-700" />
                        <span>Laverie Libre</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Balance Overview */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Solde à payer</span>
                      <h4 className="font-extrabold text-xl text-slate-950 mt-1">{totalDue.toLocaleString('fr-FR')} F CFA</h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('factures')}
                      className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                      id="btn-quick-view-bills"
                    >
                      Détail des factures
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'factures' && (
              <motion.div
                key="factures"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Current bills table */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-md">Factures Courantes</h3>
                    <p className="text-xs text-slate-400">Suivez l'état de vos règlements de loyer et charges de l'internat.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="pb-3">Type Facture</th>
                          <th className="pb-3">Montant</th>
                          <th className="pb-3">Échéance</th>
                          <th className="pb-3 text-center">Statut</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {student.factures.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 font-bold text-slate-950">{f.type}</td>
                            <td className="py-3.5 font-mono text-slate-600">{f.montant.toLocaleString('fr-FR')} F CFA</td>
                            <td className="py-3.5 text-slate-500">{f.echeance}</td>
                            <td className="py-3.5 text-center">
                              {f.statut === 'paye' && (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="h-3 w-3" /> Payé
                                </span>
                              )}
                              {f.statut === 'en_attente' && (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  <Clock className="h-3 w-3" /> En attente
                                </span>
                              )}
                              {f.statut === 'en_retard' && (
                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  <AlertTriangle className="h-3 w-3" /> En retard
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 text-right">
                              {f.statut !== 'paye' ? (
                                <button
                                  onClick={() => handlePayInvoice(f.id)}
                                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                  id={`btn-pay-bill-${f.id}`}
                                >
                                  Payer en ligne
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="px-2.5 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-lg cursor-not-allowed"
                                >
                                  Réglé
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Receipts history */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-md">Historique des Paiements de l'année</h3>
                    <p className="text-xs text-slate-400">Reçus de paiement certifiés et téléchargeables.</p>
                  </div>

                  {paiements.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">Aucun paiement enregistré pour l'instant.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <th className="pb-3">Réf</th>
                            <th className="pb-3">Période / Mois</th>
                            <th className="pb-3">Libellé</th>
                            <th className="pb-3">Moyen</th>
                            <th className="pb-3">Montant</th>
                            <th className="pb-3 text-right">Reçu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paiements.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50">
                              <td className="py-3.5 font-mono text-slate-400 uppercase">{p.id}</td>
                              <td className="py-3.5 font-bold text-slate-950">{p.mois}</td>
                              <td className="py-3.5 text-slate-600">{p.typeFacture}</td>
                              <td className="py-3.5 text-slate-500 capitalize">{p.moyen.replace('_', ' ')}</td>
                              <td className="py-3.5 font-mono text-slate-600 font-semibold">{p.montant.toLocaleString('fr-FR')} F CFA</td>
                              <td className="py-3.5 text-right">
                                <a
                                  href="#"
                                  onClick={(e) => { e.preventDefault(); alert(`Téléchargement simulé du reçu officiel ${p.id} en PDF.`); }}
                                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-[11px]"
                                  id={`btn-download-receipt-${p.id}`}
                                >
                                  PDF
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'messagerie' && (
              <motion.div
                key="messagerie"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
              >
                {/* Form Message */}
                <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-md">Nouveau Message</h3>
                    <p className="text-xs text-slate-400">Signalez une panne ou demandez un document administratif.</p>
                  </div>

                  {msgSuccess ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-bounce" id="student-msg-success-banner">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      <span>Votre message a bien été envoyé à l'administration.</span>
                    </div>
                  ) : null}

                  <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sujet</label>
                      <input
                        type="text"
                        required
                        value={msgSujet}
                        onChange={(e) => setMsgSujet(e.target.value)}
                        placeholder="Ex: Problème de lumière chambre 101"
                        className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Message</label>
                      <textarea
                        rows={5}
                        required
                        value={msgContenu}
                        onChange={(e) => setMsgContenu(e.target.value)}
                        placeholder="Détaillez votre problème ou demande ici..."
                        className="block w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      id="btn-student-send-msg"
                    >
                      Envoyer
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </div>

                {/* History Message */}
                <div className="md:col-span-7 space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-md">Historique de vos échanges</h3>
                  
                  {messages.length === 0 ? (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm text-center text-slate-400 text-xs">
                      Aucun message échangé pour l'instant.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((m) => (
                        <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block uppercase">REF: {m.id}</span>
                              <h4 className="font-bold text-slate-900 text-xs mt-0.5">{m.sujet}</h4>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              m.statut === 'repondu' ? 'bg-emerald-50 text-emerald-800' :
                              m.statut === 'en_cours' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {m.statut === 'repondu' ? 'Répondu' : m.statut === 'en_cours' ? 'En cours' : 'Reçu'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl italic">
                            "{m.message}"
                          </p>
                          <span className="text-[9px] text-slate-400 block">Envoyé le {m.date}</span>

                          {m.statut === 'repondu' && m.reponse && (
                            <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Réponse de l'administration :</span>
                              <p className="text-xs text-slate-700 bg-emerald-50/50 p-3 rounded-xl">
                                {m.reponse}
                              </p>
                              <span className="text-[9px] text-slate-400 block">Répondu le {m.reponseDate}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
