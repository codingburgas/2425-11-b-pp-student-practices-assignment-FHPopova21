export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'seller';
  bodyMeasurements?: BodyMeasurements;
}

export interface BodyMeasurements {
  height: number; // cm
  weight: number; // kg
  gender: 'male' | 'female';
  waist: number; // cm
  chest: number; // cm
  bodyType: 'slim' | 'medium' | 'large';
  age?: number;
}

export interface ClothingItem {
  id: string;
  name: string;
  type: ClothingType;
  material: MaterialType;
  size: ClothingSize;
  measurements: ClothingMeasurements;
  merchantId: string;
  merchantName: string;
  price?: number;
  image?: string;
  description?: string;
}

export interface ClothingMeasurements {
  width: number; // cm
  length: number; // cm
  sleeves?: number; // cm
}

export type ClothingType = 'shirt' | 'pants' | 'dress' | 'jacket' | 'skirt' | 'sweater';
export type MaterialType = 'elastic' | 'non-elastic' | 'semi-elastic';
export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface SizeRecommendation {
  recommendedSize: ClothingSize;
  confidence: number; // 0-100%
  explanation: string;
  alternativeSize?: ClothingSize;
  alternativeExplanation?: string;
}

export interface AIRecommendationHistory {
  id: string;
  userId: string;
  clothingItemId: string;
  recommendation: SizeRecommendation;
  timestamp: Date;
}
