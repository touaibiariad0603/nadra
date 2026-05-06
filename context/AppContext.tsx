'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Study, AnalysisResult, User } from '@/types';
import { generateMockStudies } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

interface AppState {
  studies: Study[];
  currentStudy: Study | null;
  analysisResults: Record<string, AnalysisResult>;
  currentUser: User | null;
  isLoading: boolean;
}

interface AppContextType extends AppState {
  setStudies: React.Dispatch<React.SetStateAction<Study[]>>;
  setCurrentStudy: (study: Study | null) => void;
  updateStudy: (study: Study) => void;
  createStudy: (study: Omit<Study, 'id' | 'createdAt' | 'updatedAt' | 'participants'>) => Study;
  deleteStudy: (studyId: string) => void;
  addParticipant: (studyId: string, participant: import('@/types').Participant) => void;
  updateParticipant: (studyId: string, participant: import('@/types').Participant) => void;
  removeParticipant: (studyId: string, participantId: string) => void;
  setAnalysisResult: (studyId: string, result: AnalysisResult) => void;
  getAnalysisResult: (studyId: string) => AnalysisResult | undefined;
  setCurrentUser: (user: User | null) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [studies, setStudies] = useState<Study[]>([]);
  const [currentStudy, setCurrentStudy] = useState<Study | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage or use mock data
  useEffect(() => {
    const loadData = () => {
      try {
        const storedStudies = localStorage.getItem('researchfit_studies');
        const storedAnalysis = localStorage.getItem('researchfit_analysis');
        const storedUser = localStorage.getItem('researchfit_user');

        if (storedStudies) {
          const parsed = JSON.parse(storedStudies);
          // Convert date strings back to Date objects
          const studiesWithDates = parsed.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt),
          }));
          setStudies(studiesWithDates);
        } else {
          // Use mock data on first load
          setStudies(generateMockStudies());
        }

        if (storedAnalysis) {
          const parsed = JSON.parse(storedAnalysis);
          const analysisWithDates = Object.entries(parsed).reduce((acc, [key, value]: [string, any]) => {
            acc[key] = {
              ...value,
              analyzedAt: new Date(value.analyzedAt),
            };
            return acc;
          }, {} as Record<string, AnalysisResult>);
          setAnalysisResults(analysisWithDates);
        }

        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setCurrentUser({
            ...parsed,
            createdAt: new Date(parsed.createdAt),
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setStudies(generateMockStudies());
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save studies to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('researchfit_studies', JSON.stringify(studies));
    }
  }, [studies, isLoading]);

  // Save analysis results to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('researchfit_analysis', JSON.stringify(analysisResults));
    }
  }, [analysisResults, isLoading]);

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('researchfit_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const updateStudy = useCallback((updatedStudy: Study) => {
    setStudies(prev => prev.map(s => 
      s.id === updatedStudy.id 
        ? { ...updatedStudy, updatedAt: new Date() }
        : s
    ));
  }, []);

  const createStudy = useCallback((studyData: Omit<Study, 'id' | 'createdAt' | 'updatedAt' | 'participants'>) => {
    const newStudy: Study = {
      ...studyData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [],
    };
    setStudies(prev => [newStudy, ...prev]);
    return newStudy;
  }, []);

  const deleteStudy = useCallback((studyId: string) => {
    setStudies(prev => prev.filter(s => s.id !== studyId));
    if (currentStudy?.id === studyId) {
      setCurrentStudy(null);
    }
  }, [currentStudy]);

  const addParticipant = useCallback((studyId: string, participant: import('@/types').Participant) => {
    setStudies(prev => prev.map(s => 
      s.id === studyId
        ? { ...s, participants: [...s.participants, participant], updatedAt: new Date() }
        : s
    ));
  }, []);

  const updateParticipant = useCallback((studyId: string, updatedParticipant: import('@/types').Participant) => {
    setStudies(prev => prev.map(s => 
      s.id === studyId
        ? {
            ...s,
            participants: s.participants.map(p => 
              p.id === updatedParticipant.id ? updatedParticipant : p
            ),
            updatedAt: new Date(),
          }
        : s
    ));
  }, []);

  const removeParticipant = useCallback((studyId: string, participantId: string) => {
    setStudies(prev => prev.map(s => 
      s.id === studyId
        ? { ...s, participants: s.participants.filter(p => p.id !== participantId), updatedAt: new Date() }
        : s
    ));
  }, []);

  const setAnalysisResult = useCallback((studyId: string, result: AnalysisResult) => {
    setAnalysisResults(prev => ({ ...prev, [studyId]: result }));
  }, []);

  const getAnalysisResult = useCallback((studyId: string) => {
    return analysisResults[studyId];
  }, [analysisResults]);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    const storedStudies = localStorage.getItem('researchfit_studies');
    if (storedStudies) {
      const parsed = JSON.parse(storedStudies);
      const studiesWithDates = parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      }));
      setStudies(studiesWithDates);
    }
    setIsLoading(false);
  }, []);

  const value: AppContextType = {
    studies,
    currentStudy,
    analysisResults,
    currentUser,
    isLoading,
    setStudies,
    setCurrentStudy,
    updateStudy,
    createStudy,
    deleteStudy,
    addParticipant,
    updateParticipant,
    removeParticipant,
    setAnalysisResult,
    getAnalysisResult,
    setCurrentUser,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}