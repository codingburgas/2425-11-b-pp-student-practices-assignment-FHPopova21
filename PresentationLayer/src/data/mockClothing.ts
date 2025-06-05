
import { ClothingItem } from '@/types';

export const mockClothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'Класическа бизнес риза',
    type: 'shirt',
    material: 'non-elastic',
    size: 'M',
    measurements: {
      width: 52,
      length: 75,
      sleeves: 65
    },
    merchantId: '2',
    merchantName: 'Fashion Store BG',
    price: 89,
    description: 'Елегантна бяла риза за официални случаи'
  },
  {
    id: '2',
    name: 'Спортна тениска',
    type: 'shirt',
    material: 'elastic',
    size: 'L',
    measurements: {
      width: 55,
      length: 70,
      sleeves: 25
    },
    merchantId: '2',
    merchantName: 'Sport World',
    price: 45,
    description: 'Комфортна тениска за тренировки'
  },
  {
    id: '3',
    name: 'Дамска рокля',
    type: 'dress',
    material: 'semi-elastic',
    size: 'S',
    measurements: {
      width: 46,
      length: 95,
      sleeves: 60
    },
    merchantId: '2',
    merchantName: 'Elegant Lady',
    price: 120,
    description: 'Стилна рокля за специални поводи'
  },
  {
    id: '4',
    name: 'Джинсов панталон',
    type: 'pants',
    material: 'non-elastic',
    size: 'M',
    measurements: {
      width: 42,
      length: 100
    },
    merchantId: '2',
    merchantName: 'Denim Co.',
    price: 95,
    description: 'Класически дънки с перфектен крой'
  },
  {
    id: '5',
    name: 'Зимно яке',
    type: 'jacket',
    material: 'non-elastic',
    size: 'L',
    measurements: {
      width: 58,
      length: 68,
      sleeves: 68
    },
    merchantId: '2',
    merchantName: 'Winter Wear',
    price: 180,
    description: 'Топло яке за студените дни'
  },
  {
    id: '6',
    name: 'Къс панталон',
    type: 'pants',
    material: 'elastic',
    size: 'M',
    measurements: {
      width: 40,
      length: 45
    },
    merchantId: '2',
    merchantName: 'Summer Style',
    price: 55,
    description: 'Лек панталон за лятото'
  },
  {
    id: '7',
    name: 'Пуловер от вълна',
    type: 'sweater',
    material: 'semi-elastic',
    size: 'L',
    measurements: {
      width: 54,
      length: 65,
      sleeves: 63
    },
    merchantId: '2',
    merchantName: 'Cozy Knits',
    price: 110,
    description: 'Мек вълнен пуловер'
  },
  {
    id: '8',
    name: 'Дамска пола',
    type: 'skirt',
    material: 'non-elastic',
    size: 'S',
    measurements: {
      width: 38,
      length: 55
    },
    merchantId: '2',
    merchantName: 'Elegant Lady',
    price: 65,
    description: 'Елегантна пола за офиса'
  }
];
