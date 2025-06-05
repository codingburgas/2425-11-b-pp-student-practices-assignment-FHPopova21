
import { BodyMeasurements, ClothingItem, SizeRecommendation, ClothingSize } from '@/types';

export const calculateSizeRecommendation = (
  bodyMeasurements: BodyMeasurements,
  clothingItem: ClothingItem
): SizeRecommendation => {
  // This is a simplified AI algorithm - in a real app this would be more sophisticated
  
  const { height, weight, chest, waist, bodyType, gender } = bodyMeasurements;
  const { type, material, measurements, size } = clothingItem;

  // Base calculations
  const bmi = weight / Math.pow(height / 100, 2);
  
  // Size mapping based on measurements
  const sizeMapping: Record<ClothingSize, number> = {
    'XS': 0,
    'S': 1,
    'M': 2,
    'L': 3,
    'XL': 4,
    'XXL': 5
  };

  let recommendedSizeIndex = sizeMapping[size];
  let confidence = 85;
  let explanation = '';
  let alternativeSize: ClothingSize | undefined;
  let alternativeExplanation: string | undefined;

  // Adjust based on clothing type
  if (type === 'shirt' || type === 'sweater') {
    const chestDifference = measurements.width - chest;
    
    if (chestDifference < -5) {
      recommendedSizeIndex = Math.min(recommendedSizeIndex + 1, 5);
      explanation = `Препоръчваме размер ${Object.keys(sizeMapping)[recommendedSizeIndex]} защото гръдната ви обиколка (${chest}см) изисква по-голям размер за комфорт.`;
    } else if (chestDifference > 10) {
      recommendedSizeIndex = Math.max(recommendedSizeIndex - 1, 0);
      explanation = `Препоръчваме размер ${Object.keys(sizeMapping)[recommendedSizeIndex]} защото дрехата е твърде широка за вашите мерки.`;
      alternativeSize = size;
      alternativeExplanation = `Размер ${size} също може да пасне, но ще бъде по-свободен.`;
    } else {
      explanation = `Размер ${size} е перфектен за вашите мерки. Дрехата ще пасне комфортно.`;
    }
  } else if (type === 'pants') {
    const waistDifference = measurements.width - waist;
    
    if (waistDifference < -3) {
      recommendedSizeIndex = Math.min(recommendedSizeIndex + 1, 5);
      explanation = `Препоръчваме размер ${Object.keys(sizeMapping)[recommendedSizeIndex]} защото обиколката на талията ви (${waist}см) изисква по-голям размер.`;
    } else if (waistDifference > 8) {
      recommendedSizeIndex = Math.max(recommendedSizeIndex - 1, 0);
      explanation = `Препоръчваме размер ${Object.keys(sizeMapping)[recommendedSizeIndex]} защото панталонът ще бъде твърде широк за вас.`;
    } else {
      explanation = `Размер ${size} е подходящ за вашата талия.`;
    }
  }

  // Adjust for material elasticity
  if (material === 'elastic') {
    confidence += 10;
    explanation += ' Еластичният материал ще осигури допълнителен комфорт.';
  } else if (material === 'non-elastic') {
    if (bodyType === 'large') {
      recommendedSizeIndex = Math.min(recommendedSizeIndex + 1, 5);
      explanation += ' Поради нееластичния материал, препоръчваме размер по-голям за комфорт.';
    }
    confidence -= 5;
  }

  // Adjust for body type
  if (bodyType === 'slim' && recommendedSizeIndex > 0) {
    alternativeSize = Object.keys(sizeMapping)[recommendedSizeIndex - 1] as ClothingSize;
    alternativeExplanation = `За по-тесен fit можете да опитате размер ${alternativeSize}.`;
  } else if (bodyType === 'large') {
    if (recommendedSizeIndex < 5) {
      alternativeSize = Object.keys(sizeMapping)[recommendedSizeIndex + 1] as ClothingSize;
      alternativeExplanation = `За по-свободен комфорт можете да изберете размер ${alternativeSize}.`;
    }
  }

  // Gender-specific adjustments
  if (gender === 'female' && (type === 'shirt' || type === 'dress')) {
    confidence += 5;
    explanation += ' Препоръката отчита специфичните женски пропорции.';
  }

  const finalRecommendedSize = Object.keys(sizeMapping)[recommendedSizeIndex] as ClothingSize;

  return {
    recommendedSize: finalRecommendedSize,
    confidence: Math.min(confidence, 98),
    explanation,
    alternativeSize,
    alternativeExplanation
  };
};
