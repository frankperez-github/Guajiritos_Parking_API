import { Request, Response } from 'express';
import ParkingSpot from '../models/ParkingSpots'; 
import Reservation from '../models/Reservation';
import createLog from '../utils/LogService'; 
import IUserRequest from '../types/UserRequest';
import { where } from 'sequelize';
const { Op } = require('sequelize');

export const getAllParkingSpots = async (req: IUserRequest, res: Response): Promise<void> => {
  try {
    const spots = await ParkingSpot.findAll();
    res.status(200).json({ spots });
  } catch (error) {
    res.status(500).json({ message: 'Error getting parking spots', error });
  }
};

export const reserveParkingSpot = async (req: IUserRequest, res: Response): Promise<void> => {
  const { vehicleDetails, reservationStart, reservationEnd } = req.body;

  try {
    const availableSpot = await ParkingSpot.findOne({
      where: {
        isAvailable: true
      },
    });

    if (!availableSpot) {
      res.status(400).json({ message: 'No parking spots available for the selected time' });
      return;
    }

    const userId = req.user?.id

    const reservation = await Reservation.create({
      reservationStart,
      reservationEnd,
      userId,
      parkingSpotId: availableSpot.id,
    });

    availableSpot.isAvailable = true;
    await availableSpot.save();

    res.status(201).json({ reservation });
    await createLog('reservation', userId!, `Reserved parking spot for vehicle: ${vehicleDetails}`);
  } catch (error) {
    res.status(500).json({ message: 'Error reserving parking spot', error });
  }
};

export const cancelReservation = async (req: Request, res: Response): Promise<void> => {
  const reservationId = req.params.id;

  try {
    const reservation = await Reservation.findByPk(reservationId);

    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }

    const parkingSpot = await ParkingSpot.findByPk(reservation.parkingSpotId);
    if (parkingSpot) {
      parkingSpot.isAvailable = true;
      await parkingSpot.save();
    }

    await reservation.destroy();
    res.status(200).json({ message: 'Reservation cancelled successfully' });
    await createLog('cancellation', reservation.userId, `Cancelled reservation: ${reservationId}`);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling reservation', error });
  }
};

export const enterParking = async (req: IUserRequest, res: Response): Promise<void> => {
    const { vehicleDetails, entryTime } = req.body;
    const userId = req.user?.id;
  
    try {
      const reservedSpotsIds = (await Reservation.findAll({
        where: {
          userId: userId
        }
      })).map((x) =>{
        if(
          new Date(entryTime) >= new Date(x.reservationStart) 
          && new Date(entryTime) < new Date(x.reservationEnd)
        ) return x.dataValues.parkingSpotId
      }).filter((x) => x!==undefined)


      const availableReservationSpot = (await ParkingSpot.findAll()).map(x=>{
        if(x.isAvailable === true && reservedSpotsIds.includes(x.id)) return x
      }).find(x=>x!==undefined)


      const vehicleInParking = await ParkingSpot.findOne({
        where: {
          isAvailable: false,
          vehicleDetails
        }
      });

      if(vehicleInParking)
      {
        res.status(404).json({ message: 'There is a vehicle inside the parking with received description. Parking spot: '+vehicleInParking.id });
        return;
      }
      

      if (availableReservationSpot) {
          availableReservationSpot.isAvailable = false;
          availableReservationSpot.vehicleDetails = vehicleDetails;
          await availableReservationSpot.save();
  
          res.status(200).json({ message: `Vehicle with description "${vehicleDetails}" entered the reserved parking spot ${availableReservationSpot.id}` });
          await createLog('entry', userId!, `Vehicle with description "${vehicleDetails}" entered reserved parking spot: ${availableReservationSpot.id}`);
          return;
      }
  
      const availableSpot = await ParkingSpot.findOne({
        where: { isAvailable: true }
      });
  
      if (!availableSpot) {
        res.status(404).json({ message: 'No available parking spots found at the requested time' });
        return;
      }
  
      availableSpot.isAvailable = false;
      availableSpot.vehicleDetails = vehicleDetails;

      await availableSpot.save();

  
      res.status(200).json({ message: `Vehicle entered the parking spot ${availableSpot.id}` });
      await createLog('entry', userId!, `Vehicle with description \"${vehicleDetails}\" entered available parking spot: ${availableSpot.id}`);
    } catch (error) {
      res.status(500).json({ message: 'Error entering parking: '+error });
    }
  };

export const exitParking = async (req: IUserRequest, res: Response): Promise<void> => {
  const parkingSpotId = req.params.id;

  try {
    const parkingSpot = await ParkingSpot.findByPk(parkingSpotId);

    if (!parkingSpot || parkingSpot.isAvailable) {
      res.status(404).json({ message: 'Parking spot not found or already available' });
      return;
    }

    parkingSpot.isAvailable = true;
    await parkingSpot.save();

    res.status(200).json({ message: 'Vehicle exited the parking spot' });
    await createLog('exit', req.user?.id!, `Vehicle exited parking spot ID: ${parkingSpotId}`);
  } catch (error) {
    res.status(500).json({ message: 'Error exiting parking', error });
  }
};
