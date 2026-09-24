import styles from './SnacksPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlFood, faPlay, faHotdog, faBlender, faCandyCane, faMugHot, faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import LoadingElement from '../LoadingElement/LoadingElement';
import ErrorElement from '../ErrorElement/ErrorElement';

// popcorn, nachos, hot food, slushie, sweets, hot drinks, cold drinks, others

// const food = [
//   {
//     "categoryEN": "Popcorn",
//     "categoryAR": "فشار",
//     "faIcon": faBowlFood,
//     "items": [
//       {
//         "nameEN": "Small Salt Popcorn",
//         "nameAR": "فشار صغير مالح",
//         "price": 75.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3809.png"
//       },
//       {
//         "nameEN": "Medium Salt Popcorn",
//         "nameAR": "فشار وسط مالح",
//         "price": 85.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3809.png"
//       },
//       {
//         "nameEN": "Large Salt Popcorn",
//         "nameAR": "فشار كبير مالح",
//         "price": 100.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3809.png"
//       },
//       {
//         "nameEN": "Small Caramel Popcorn",
//         "nameAR": "فشار صغير كرامل",
//         "price": 85.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_8186_1736688087483.jpg"
//       },
//       {
//         "nameEN": "Medium Caramel Popcorn",
//         "nameAR": "فشار وسط كرامل",
//         "price": 95.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_8186_1736688087483.jpg"
//       },
//       {
//         "nameEN": "Large Caramel Popcorn",
//         "nameAR": "فشار كبير كرامل",
//         "price": 110.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_8186_1736688087483.jpg"
//       },
//       {
//         "nameEN": "Small Cheetos Popcorn",
//         "nameAR": "فشار صغير شيتوس",
//         "price": 85.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_5233.jpg"
//       },
//       {
//         "nameEN": "Medium Cheetos Popcorn",
//         "nameAR": "فشار وسط شيتوس",
//         "price": 95.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_5233.jpg"
//       },
//       {
//         "nameEN": "Large Cheetos Popcorn",
//         "nameAR": "فشار كبير شيتوس",
//         "price": 110.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_5233.jpg"
//       },
//       {
//         "nameEN": "Small Mixed Popcorn",
//         "nameAR": "فشار صغير مكس",
//         "price": 80.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_5233.jpg"
//       },
//       {
//         "nameEN": "Medium Mixed Popcorn",
//         "nameAR": "فشار وسط مكس",
//         "price": 90.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_5233.jpg"
//       },
//       {
//         "nameEN": "Large Mixed Popcorn",
//         "nameAR": "فشار كبير مكس",
//         "price": 105.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_5233.jpg"
//       },
//     ]
//   },
//   {
//     "categoryEN": "Nachos",
//     "categoryAR": "ناتشوز",
//     "faIcon": faPlay,
//     "items": [
//       {
//         "nameEN": "Regular Nachos",
//         "nameAR": "ناتشوز عادي",
//         "price": 130.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3832_1743538171813.jpg"
//       },
//       {
//         "nameEN": "Large Nachos",
//         "nameAR": "ناتشوز كبير",
//         "price": 150.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3832_1743538171813.jpg"
//       },
//     ]
//   },
//   {
//     "categoryEN": "Hot Food",
//     "categoryAR": "طعام ساخن",
//     "faIcon": faHotdog,
//     "items": [
//       {
//         "nameEN": "Hot Dog",
//         "nameAR": "هوت دوج",
//         "price": 85.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_18.png"
//       },
//       {
//         "nameEN": "French Fries",
//         "nameAR": "فنش فرنس",
//         "price": 45.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_6465_1743537529795.jpg"
//       },
//       {
//         "nameEN": "Beef Burger",
//         "nameAR": "سندوتش لحمة",
//         "price": 130.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_4029_1747214401923.jpg"
//       },
//       {
//         "nameEN": "Chicken Nuggets",
//         "nameAR": "قطع دجاج",
//         "price": 85.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_17172_1762856924518.png"
//       },
//     ]
//   },
//   {
//     "categoryEN": "Slushie",
//     "categoryAR": "سلشيه",
//     "faIcon": faBlender,
//     "items": [
//       {
//         "nameEN": "Regular Slushie",
//         "nameAR": "سلشيه عادي",
//         "price": 80.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_17295_1785912184971.png"
//       },
//       {
//         "nameEN": "Large Slushie",
//         "nameAR": "سلشيه كبير",
//         "price": 90.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_17295_1785912184971.png"
//       },
//     ]
//   },
//   {
//     "categoryEN": "Sweets",
//     "categoryAR": "حلويات",
//     "faIcon": faCandyCane,
//     "items": [
//       {
//         "nameEN": "Cotton Candy",
//         "nameAR": "غزل البنات",
//         "price": 30.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3623.jpg"
//       },
//       {
//         "nameEN": "M&Ms",
//         "nameAR": "إن بي إم إس",
//         "price": 45.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_5642.jpg"
//       },
//       {
//         "nameEN": "Galaxy Chocolate",
//         "nameAR": "جالاكسي شوكولاتة",
//         "price": 35.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3614.jpg"
//       },
//     ]
//   },
//   {
//     "categoryEN": "Hot Drinks",
//     "categoryAR": "مشروبات ساخنة",
//     "faIcon": faMugHot,
//     "items": [
//       {
//         "nameEN": "Coffee",
//         "nameAR": "قهوة",
//         "price": 40.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_5015_1743187062028.png"
//       },
//       {
//         "nameEN": "Hot Chocolate",
//         "nameAR": "هوت شوكولات",
//         "price": 50.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3994_1743188099739.png"
//       },
//     ]
//   },
//   {
//     "categoryEN": "Cold Drinks",
//     "categoryAR": "مشروبات باردة",
//     "faIcon": faSnowflake,
//     "items": [
//       {
//         "nameEN": "Water Bottle",
//         "nameAR": "زجاجة ماء",
//         "price": 10.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3661.jpg"
//       },
//       {
//         "nameEN": "Cola Can (Cola/Sprite/Fanta)",
//         "nameAR": "علبة كولا (كولا/سبرايت/فانتا)",
//         "price": 15.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_7946_1783928217455.jpeg"
//       },
//       {
//         "nameEN": "Red Bull",
//         "nameAR": "ريد بول",
//         "price": 45.00,
//         "imageURL": "https://assets.voxcinemas.com/concessions/C_3721_1743071898204.jpg"
//       },
//     ]
//   }
// ];

  const fontAwesomeIcons = {
    "faBowlFood": faBowlFood,
    "faPlay": faPlay,
    "faHotdog": faHotdog,
    "faBlender": faBlender,
    "faCandyCane": faCandyCane,
    "faMugHot": faMugHot,
    "faSnowflake": faSnowflake
  };

export default function SnacksPage() {

  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSnacks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/snacks');
      const data = await response.json();
      setSnacks(data);
      console.log('Fetched snacks:', data);
    } catch (error) {
      console.error('Error fetching snacks:', error);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  const { lang } = useLanguage();

  return (
    <div className="w-5/6 lg:w-3/4 mx-auto min-h-screen flex flex-col justify-start items-start gap-4 px-8 py-4 my-8" >
      <div className="w-full p-4 flex justify-center items-center gap-4">
        <FontAwesomeIcon icon={faBowlFood} size='3x' />
        <h2 className='font-bold text-5xl'>Snacks</h2>
        <FontAwesomeIcon icon={faBowlFood} size='3x' />
      </div>
      <div className="flex flex-col gap-8 justify-start items-start max-w-7xl mx-auto w-full">
        {loading && <LoadingElement/>}
        {error && <ErrorElement/>}
        {!loading && !error && snacks.map((items, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex justify-start items-center gap-2 w-full">
              <FontAwesomeIcon icon={fontAwesomeIcons[items.category.faIcon]} size='xl' />
              <h3 className='font-bold text-3xl'>{lang === 'en' ? items.category.nameEN : items.category.nameAR}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {items.snacks.map((item, itemIndex) => (
                <div key={itemIndex} className="flex flex-col gap-2 justify-start items-start p-4 border-tertiary border-4 bg-secondary rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img src={item.image} alt={lang === 'en' ? item.nameEN : item.nameAR} className="w-full h-50 object-cover rounded-lg" />
                  <h4 className='font-bold text-xl'>{lang === 'en' ? item.nameEN : item.nameAR}</h4>
                  <p className='text-lg font-semibold'>{lang === 'en' ? `EGP ${item.price.toFixed(2)}` : `${item.price.toFixed(2)} جنيه`}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}