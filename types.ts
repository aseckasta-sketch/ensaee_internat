/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Facture {
  id: string;
  type: string;
  montant: number;
  statut: 'paye' | 'en_attente' | 'en_retard';
  echeance: string;
}

export interface Eleve {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  chambre: string;
  typeLit: string;
  forfait: string;
  dateInscription: string;
  statut: 'actif' | 'suspendu';
  motDePasse: string;
  factures: Facture[];
}

export interface Chambre {
  numero: string;
  type: 'simple' | 'double' | 'lits_superposes';
  taille: string;
  occupants: string[];
  etat: 'libre' | 'occupee' | 'en_travaux';
  equipements: string[];
}

export interface Paiement {
  id: string;
  eleveId: string;
  eleveNom: string;
  mois: string;
  montant: number;
  date: string;
  moyen: 'especes' | 'virement' | 'mobile_money';
  typeFacture: string;
}

export interface Message {
  id: string;
  eleveId: string;
  eleveNom: string;
  sujet: string;
  message: string;
  date: string;
  statut: 'recu' | 'en_cours' | 'repondu';
  reponse: string;
  reponseDate: string;
}

export interface UserSession {
  role: 'public' | 'eleve' | 'admin';
  user: Eleve | null;
}
