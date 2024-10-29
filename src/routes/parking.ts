import { Router } from 'express';
import {
  reserveParkingSpot,
  cancelReservation,
  enterParking,
  exitParking,
  getAllParkingSpots
} from '../controllers/parkingSpot'; 
import authenticate from '../middlewares/auth';
import isWorker from '../middlewares/isWorker';

const router = Router();
router.get('/', authenticate, isWorker, getAllParkingSpots);

router.post('/reserve', authenticate, reserveParkingSpot);

router.delete('/cancel/:id', authenticate, cancelReservation);

router.post('/enter', authenticate, enterParking);

router.post('/exit/:id', authenticate, exitParking);

export default router;
