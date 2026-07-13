/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Eleve, Chambre, Paiement, Message } from './types';

// Import initial data from the JSON files
import initialElevesJson from '../data/eleves.json';
import initialChambresJson from '../data/chambres.json';
import initialPaiementsJson from '../data/paiements.json';
import initialMessagesJson from '../data/messages.json';

const STORAGE_KEYS = {
  ELEVES: 'ensae_internat_eleves',
  CHAMBRES: 'ensae_internat_chambres',
  PAIEMENTS: 'ensae_internat_paiements',
  MESSAGES: 'ensae_internat_messages',
};

// Typed casts
const initialEleves = initialElevesJson as Eleve[];
const initialChambres = initialChambresJson as Chambre[];
const initialPaiements = initialPaiementsJson as Paiement[];
const initialMessages = initialMessagesJson as Message[];

export function getEleves(): Eleve[] {
  const data = localStorage.getItem(STORAGE_KEYS.ELEVES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.ELEVES, JSON.stringify(initialEleves));
    return initialEleves;
  }
  return JSON.parse(data);
}

export function saveEleves(eleves: Eleve[]): void {
  localStorage.setItem(STORAGE_KEYS.ELEVES, JSON.stringify(eleves));
}

export function getChambres(): Chambre[] {
  const data = localStorage.getItem(STORAGE_KEYS.CHAMBRES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CHAMBRES, JSON.stringify(initialChambres));
    return initialChambres;
  }
  return JSON.parse(data);
}

export function saveChambres(chambres: Chambre[]): void {
  localStorage.setItem(STORAGE_KEYS.CHAMBRES, JSON.stringify(chambres));
}

export function getPaiements(): Paiement[] {
  const data = localStorage.getItem(STORAGE_KEYS.PAIEMENTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PAIEMENTS, JSON.stringify(initialPaiements));
    return initialPaiements;
  }
  return JSON.parse(data);
}

export function savePaiements(paiements: Paiement[]): void {
  localStorage.setItem(STORAGE_KEYS.PAIEMENTS, JSON.stringify(paiements));
}

export function getMessages(): Message[] {
  const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
    return initialMessages;
  }
  return JSON.parse(data);
}

export function saveMessages(messages: Message[]): void {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}

export function resetDatabase(): void {
  localStorage.setItem(STORAGE_KEYS.ELEVES, JSON.stringify(initialEleves));
  localStorage.setItem(STORAGE_KEYS.CHAMBRES, JSON.stringify(initialChambres));
  localStorage.setItem(STORAGE_KEYS.PAIEMENTS, JSON.stringify(initialPaiements));
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
}
