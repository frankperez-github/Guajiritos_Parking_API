import app from '../../app';
import ParkingSpot from '../../models/ParkingSpots';
import Reservation from '../../models/Reservation';
import supertest from 'supertest';
import Logs from '../../models/Logs';
import { adminToken, adminUserId } from './testsConfiguration';

describe('ParkingSpot Endpoints', () => {

  describe('Reserve', () => {
      it('Should reserve an available parking spot and create a log.', async () => {
        const response = await supertest(app)
          .post('/api/parking/reserve')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            vehicleDetails: 'Test Vehicle',
            reservationStart: new Date(),
            reservationEnd: new Date(new Date().getTime() + 60 * 60 * 1000),
          });
  
        expect(response.statusCode).toBe(201);
        expect(response.body.reservation.parkingSpotId).toBeDefined();
  
        const createLog = await Logs.findOne({
          where: { details: `Reserved parking spot for vehicle: Test Vehicle` },
        });
        expect(createLog).toBeDefined();
      });
   
  });
  
  describe('Cancel', () => {
      it('Should cancel a previously created reservation and create a cancellation log.', async () => {
        const spot = await ParkingSpot.create({ isAvailable: false, vehicleDetails: 'Test Vehicle' });
        try {
          const reservation = await Reservation.create({
            userId: adminUserId,
            parkingSpotId: spot.id,
            reservationStart: new Date(),
            reservationEnd: new Date(new Date().getTime() + 60 * 60 * 1000),
          });
          const response = await supertest(app)
            .delete(`/api/parking/cancel/${reservation.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
      
          expect(response.status).toBe(200);
          const updatedSpot = await ParkingSpot.findByPk(spot.id);
          expect(updatedSpot?.isAvailable).toBe(true);
      
          const cancelLog = await Logs.findOne({
            where: { details: `Cancelled reservation: ${reservation.id}` },
          });
          expect(cancelLog).toBeDefined();
        } catch (error) {
console.log(error)
        }
    
      });
  });

  describe('Enter', () => {
    it('Should allow entry to a reserved parking spot and create a log.', async () => {
      const spot = await ParkingSpot.create({ isAvailable: true, vehicleDetails: '' });
      
      await Reservation.create({
        userId: adminUserId,
        parkingSpotId: spot.id,
        reservationStart: new Date(),
        reservationEnd: new Date(new Date().getTime() + 60 * 60 * 1000),
      });
  
      const response = await supertest(app)
        .post('/api/parking/enter')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vehicleDetails: 'Test Vehicle',
          entryTime: new Date(),
        });
  
      expect(response.status).toBe(200);
  
      const updatedSpot = await ParkingSpot.findByPk(spot.id);
      expect(updatedSpot?.isAvailable).toBe(false);
  
      const logDetails = `Vehicle with description "Test Vehicle" entered available parking spot: ${updatedSpot?.id}`;
      const vehicleInParkingLog = await Logs.findOne({
        where: {
          details: logDetails,
        },
      });
      expect(vehicleInParkingLog).toBeDefined();
    });

    it('Should reject entry when all parking spots are occupied.', async () => {
      // Poner todos los ParkingSpots en la base de datos como ocupados
      await ParkingSpot.update({ isAvailable: false }, { where: {} });
    
      // Intentar entrar en el aparcamiento
      const response = await supertest(app)
        .post('/api/parking/enter')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vehicleDetails: 'Test Vehicle 4',
          entryTime: new Date(),
        });
    
      // Verificar que la respuesta indique que no hay plazas disponibles
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No available parking spots found at the requested time');
    
      // Verificar que no se haya creado un log con un detalle de entrada exitosa
      const logDetails = `Vehicle with description "Test Vehicle 4" entered available parking spot: ${response.body.reservation?.parkingSpotId}`;
      const vehicleInParkingLog = await Logs.findOne({
        where: { details: logDetails },
      });
      expect(vehicleInParkingLog).toBeNull();
    });
  
    it('Should reject entry to a reserved parking spot after the reservation time has ended when all spots are occupied.', async () => {
      await ParkingSpot.update({ isAvailable: false }, { where: {} });
    
      const spot = await ParkingSpot.create({ isAvailable: true, vehicleDetails: '' });
    
      const reservationStart = new Date();
      const reservationEnd = new Date(reservationStart.getTime() + 60 * 60 * 1000);
    
      await Reservation.create({
        userId: adminUserId,
        parkingSpotId: spot.id,
        reservationStart,
        reservationEnd,
      });
    
      await ParkingSpot.update(
        { isAvailable: false },
        { where: { id: spot.id, isAvailable: true } }
      );
    
      const response = await supertest(app)
        .post('/api/parking/enter')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vehicleDetails: 'Test Vehicle',
          entryTime: new Date(reservationEnd.getTime() + 1000),
        });
    
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No available parking spots found at the requested time');
    
      const logDetails = `Vehicle with description "Test Vehicle" entered available parking spot: ${response.body.reservation?.parkingSpotId}`;
      const vehicleInParkingLog = await Logs.findOne({
        where: { details: logDetails },
      });
      expect(vehicleInParkingLog).toBeNull();
    });

    it('Should reject a second entry attempt with the same vehicle description.', async () => {
      await ParkingSpot.update({ isAvailable: false }, { where: {} });
    
      const spot = await ParkingSpot.create({ isAvailable: true, vehicleDetails: '' });
    
      const reservationStart = new Date();
      const reservationEnd = new Date(reservationStart.getTime() + 60 * 60 * 1000);
    
      await Reservation.create({
        userId: adminUserId,
        parkingSpotId: spot.id,
        reservationStart,
        reservationEnd,
      });
    
      const firstResponse = await supertest(app)
        .post('/api/parking/enter')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vehicleDetails: 'Test Vehicle',
          entryTime: reservationStart,
        });
    
      expect(firstResponse.status).toBe(200);
    
      const firstLogDetails = `Vehicle with description "Test Vehicle" entered reserved parking spot: ${spot?.id}`;
      const firstVehicleInParkingLog = await Logs.findOne({ details: firstLogDetails });
      expect(firstVehicleInParkingLog).toBeDefined();
    
      const secondResponse = await supertest(app)
        .post('/api/parking/enter')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vehicleDetails: 'Test Vehicle',
          entryTime: reservationStart,
        });
    
      expect(secondResponse.status).toBe(404);
      expect(secondResponse.body.message).toBe(
        `There is a vehicle inside the parking with received description. Parking spot: ${spot.id}`
      );
    
      const logDetails = `Vehicle with description "Test Vehicle" entered reserved parking spot: ${spot.id}`;
      const vehicleInParkingLogs = await Logs.find({ details: logDetails });
      expect(vehicleInParkingLogs.length).toBe(1); 
    });
  });

  describe('Exit', () => {
    it('Should allow exit from an occupied parking spot and create a log.', async () => {
      const spot = await ParkingSpot.create({ isAvailable: false, vehicleDetails: 'Test Vehicle' });
  
      const response = await supertest(app)
        .post(`/api/parking/exit/${spot.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
  
      expect(response.status).toBe(200);
  
      const updatedSpot = await ParkingSpot.findByPk(spot.id);
      expect(updatedSpot?.isAvailable).toBe(true);
  
      const logDetails = `Vehicle exited parking spot ID: ${spot.id}`;
      const exitLog = await Logs.findOne({
        where: {
          details: logDetails,
        },
      });
      expect(exitLog).toBeDefined();
    });
  });
});