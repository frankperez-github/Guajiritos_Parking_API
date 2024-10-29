import supertest from 'supertest';
import app from '../../app';
import User from '../../models/Users';
import bcrypt from 'bcrypt';
import { adminToken, clientToken } from './testsConfiguration';


describe('Users endpoint with roles', () => {
  it('Should create a new user successfully (Admin only)', async () => {
    const response = await supertest(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'cliente',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.name).toBe('Test User');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('Should retrieve all users (Admin only)', async () => {
    await User.destroy({ where: {}, cascade: true });
    await User.create({ name: 'User 1', email: 'user1@example.com', password: 'password', role: 'cliente' });
    await User.create({ name: 'User 2', email: 'user2@example.com', password: 'password', role: 'cliente' });

    const response = await supertest(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(2);
    expect(response.body.users[0].email).toBe('user1@example.com');
    expect(response.body.users[1].email).toBe('user2@example.com');
  });

  it('Should retrieve a user by ID (Any authenticated user)', async () => {
    const user = await User.create({ name: 'Test User', email: 'testuser@example.com', password: 'password', role: 'cliente' });

    const response = await supertest(app)
      .get(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${clientToken}`); 

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe('testuser@example.com');
  });

  it('Should return 404 if user is not found (Any authenticated user)', async () => {
    const nonExistentUserId = 'b3b495e1-1b7b-46e0-9af2-b8d21f5d7d1f';

    const response = await supertest(app)
      .get(`/api/users/${nonExistentUserId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('Should update an existing user (Admin only)', async () => {
    const user = await User.create({ name: 'Old Name', email: 'old@example.com', password: 'password', role: 'cliente' });

    const response = await supertest(app)
      .put(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpassword123',
        role: 'admin',
      });

    expect(response.status).toBe(200);
    expect(response.body.user.name).toBe('Updated Name');
    expect(response.body.user.email).toBe('updated@example.com');

    const updatedUser = await User.findByPk(user.id);
    const isPasswordCorrect = await bcrypt.compare('newpassword123', updatedUser?.password!);
    expect(isPasswordCorrect).toBe(true);
  });

  it('Should delete an existing user (Admin only)', async () => {
    const user = await User.create({ name: 'Delete Me', email: 'delete@example.com', password: 'password', role: 'cliente' });

    const response = await supertest(app)
      .delete(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted');

    const deletedUser = await User.findByPk(user.id);
    expect(deletedUser).toBeNull();
  });

  it('Should return 404 when deleting a non-existent user (Admin only)', async () => {
    const nonExistentUserId = 'b3b495e1-1b7b-46e0-9af2-b8d21f5d7d1f';

    const response = await supertest(app)
      .delete(`/api/users/${nonExistentUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});
