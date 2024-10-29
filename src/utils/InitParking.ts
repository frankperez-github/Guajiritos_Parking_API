import ParkingSpot from '../models/ParkingSpots';

const initializeParkingSpots = async (totalSpots: number) => {
  try {
    const existingSpots = await ParkingSpot.count();
    if (existingSpots === 0) {
      const spots = [];
      for (let i = 1; i <= totalSpots; i++) {
        spots.push({ location: `Spot ${i}`, isAvailable: true });
      }
      await ParkingSpot.bulkCreate(spots);
      console.log(`${totalSpots} parking spots created.`);
    } else {
      console.log('Parking spots already initialized.');
    }
  } catch (error) {
    console.error('Error initializing parking spots:', error);
  }
};

export default initializeParkingSpots;
