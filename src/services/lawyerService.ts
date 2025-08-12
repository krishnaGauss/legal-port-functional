
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Lawyer {
  id: string;
  name: string;
  specializations: string[];
  rating: number;
  reviews: number;
  experience: number;
  isOnline: boolean;
  pricing: {
    audio: number;
    video: number;
    chat: number;
  };
  image: string;
  connections: number;
  verified: boolean;
}

export const fetchLawyers = async (): Promise<Lawyer[]> => {
  try {
    const lawyersRef = collection(db, 'lawyer_profiles');
    const q = query(lawyersRef, orderBy('rating', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const lawyers: Lawyer[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      lawyers.push({
        id: doc.id,
        name: data.name || '',
        specializations: data.specializations || [],
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        experience: data.experience || 0,
        isOnline: data.isOnline || false,
        pricing: {
          audio: data.pricing?.audio || 0,
          video: data.pricing?.video || 0,
          chat: data.pricing?.chat || 0,
        },
        image: data.image || '',
        connections: data.connections || 0,
        verified: data.verified || false,
      });
    });
    
    return lawyers;
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    throw new Error('Failed to fetch lawyers from database');
  }
};
