import bcrypt from 'bcrypt';
import User from "../../models/Users";
import jwt from 'jsonwebtoken';
import Logs from '../../models/Logs';
import Reservation from '../../models/Reservation';
import ParkingSpot from '../../models/ParkingSpots';


export let adminToken: string;
export let clientToken: string;
export let adminUserId: string;
export let clientUserId: string;

beforeEach(async () => {
    const adminPassword = await bcrypt.hash('adminpassword', 10);
    const clientPassword = await bcrypt.hash('clientpassword', 10);

    const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
    });

    const clientUser = await User.create({
        name: 'Client User',
        email: 'client@example.com',
        password: clientPassword,
        role: 'cliente',
    });

    adminUserId = adminUser.id;
    clientUserId = clientUser.id;

    adminToken = jwt.sign({ id: adminUser.id, role: adminUser.role }, process.env.JWT_SECRET as string);
    clientToken = jwt.sign({ id: clientUser.id, role: clientUser.role }, process.env.JWT_SECRET as string);
});

afterEach(async () => {
    await Logs.deleteMany({});
    await Reservation.destroy({ where: {}, cascade: true });
  
    await ParkingSpot.update(
      { isAvailable: true, vehicleDetails: '' },
      { where: {} }
    );
    await User.destroy({ where: {}, cascade: true });
});