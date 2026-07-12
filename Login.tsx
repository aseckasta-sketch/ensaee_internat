/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Eye, EyeOff, GraduationCap, Shield, ArrowRight, Building2 } from 'lucide-react';
import { Eleve } from '../types';
import { getEleves } from '../data';
import EnsaeLogo from './EnsaeLogo';

interface LoginProps {
  onLogin: (role: 'eleve' | 'admin', user: Eleve | null) => void;
  onBackToPublic: () => void;
}

export default function Login({ onLogin, onBackToPublic }: LoginProps) {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifiant || !motDePasse) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    // Check for admin login
    if (identifiant.toLowerCase() === 'admin.ensae' && motDePasse === 'admin123') {
      onLogin('admin', null);
      return;
    }

    // Check for student login
    const eleves = getEleves();
    const eleve = eleves.find(
      (el) =>
        el.id.toLowerCase() === identifiant.toLowerCase() ||
        el.email.toLowerCase() === identifiant.toLowerCase()
    );

    if (eleve && eleve.motDePasse === motDePasse) {
      if (eleve.statut === 'suspendu') {
        setError('Votre compte a été suspendu par l\'administration.');
        return;
      }
      onLogin('eleve', eleve);
    } else {
      setError('Identifiant ou mot de passe incorrect.');
    }
  };

  const handleQuickDemoLogin = (role: 'eleve' | 'admin') => {
    if (role === 'admin') {
      setIdentifiant('admin.ensae');
      setMotDePasse('admin123');
      onLogin('admin', null);
    } else {
      const eleves = getEleves();
      const student = eleves.find((el) => el.id === 'm.diouf') || eleves[0];
      setIdentifiant(student.id);
      setMotDePasse(student.motDePasse);
      onLogin('eleve', student);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-4 left-4">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm"
          id="btn-back-to-public"
        >
          ← Retour au site public
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <div className="flex justify-center mb-4">
          <EnsaeLogo size={64} className="shadow-md rounded-xl bg-white border border-slate-100/80 p-0.5" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Portail Internat ENSAE
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Connectez-vous pour accéder à votre espace personnel ou administratif
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white py-8 px-4 shadow-md rounded-2xl border border-slate-100 sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            {error && (
              <div
                className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2 animate-pulse"
                id="login-error-alert"
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="identifiant" className="block text-sm font-semibold text-slate-700">
                Identifiant ou Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="identifiant"
                  name="identifiant"
                  type="text"
                  required
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  placeholder="m.diouf ou admin.ensae"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="motdepasse" className="block text-sm font-semibold text-slate-700">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="motdepasse"
                  name="motdepasse"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 sm:text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  id="btn-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all cursor-pointer items-center gap-2 group shadow-emerald-700/10 hover:shadow-emerald-700/20"
                id="btn-login-submit"
              >
                Se connecter
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Quick Demo Accounts section */}
          <div className="mt-8 border-t border-slate-200/80 pt-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-4">
              🎯 Accès Rapide Évaluateur (Comptes de Démo)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('eleve')}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-100 hover:border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all cursor-pointer group"
                id="btn-demo-eleve"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900 group-hover:text-emerald-950 transition-colors">
                    Espace ÉLÈVE
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">Mamadou Diouf</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-amber-100 hover:border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left transition-all cursor-pointer group"
                id="btn-demo-admin"
              >
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-900 group-hover:text-amber-950 transition-colors">
                    Espace ADMIN
                  </div>
                  <div className="text-[10px] text-amber-700 font-medium">Asta Seck</div>
                </div>
              </button>
            </div>
            <div className="mt-3 text-center text-[10px] text-slate-400 font-medium">
              Note : Mots de passe chiffrés conformément aux exigences de sécurité du projet.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
