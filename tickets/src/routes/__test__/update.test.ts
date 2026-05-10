import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/tickets/${id}`).set('Cookie', global.signin()).send({
    title: 'concert',
    price: 10
  });
  expect(response.status).toEqual(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/tickets/${id}`).send({
    title: 'concert',
    price: 10
  });
  expect(response.status).toEqual(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app).post(`/api/tickets`).set('Cookie', global.signin()).send({
    title: 'concert2',
    price: 100
  });

  const updateResponse = await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', global.signin()).send({
    title: 'concert3',
    price: 150
  });

  expect(updateResponse.status).toEqual(401);
});

it('returns a 400 if the provided title is empty', async () => {
  const cookie = global.signin();

  const response = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
    title: 'concert',
    price: 10
  });

  const updateResponse = await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
    title: '',
    price: 10
  });

  expect(updateResponse.status).toEqual(400);
});

it('returns a 400 if the provided price is less than 0', async () => {
  const cookie = global.signin();

  const response = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
    title: 'concert',
    price: 10
  });

  const updateResponse = await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
    title: 'concert',
    price: -10
  }).expect(400);

  expect(updateResponse.status).toEqual(400);
});

it('updates the ticket if the provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
    title: 'concert',
    price: 10
  });

  const updateResponse = await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
    title: 'new concert',
    price: 100
  });

  expect(updateResponse.status).toEqual(200);
  expect(updateResponse.body.title).toEqual('new concert');
  expect(updateResponse.body.price).toEqual(100);
});