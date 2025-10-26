import { expect, test } from '@jest/globals';
import main from '../index.js';

test('basic route', () => {
  const routes = [
  {
    method: 'POST',
    path: '/courses',
    handler: {
      body: 'created courses!'
    },
  },
  {
    method: 'GET',
    path: '/courses',
    handler: {
      body: 'courses!'
    },
  },
  {
    path: '/courses/basics',
    handler: {
      body: 'basics'
    },
  },
];
  const obj = main(routes, { path: '/courses', method: 'GET' });
  expect(obj.serve().body).toEqual('courses!');
});

test('wrong route', () => {
  const routes = [
  {
    method: 'GET',
    path: '/courses',
    handler: {
      body: 'courses'
    },
  },
  {
    method: 'GET',
    path: '/courses/basics',
    handler: {
      body: 'basics'
    },
  },
];
  const obj = main(routes, { path: '/wrong'});
  expect(obj.serve().body).toEqual('Wrong route!');
});

test('dynamic route', () => {
  const routes = [
  {
    path: '/courses/:id',
    handler: {
      body: 'course'
    },
    constraints: { id: '\\d+' },
  },
  {
    path: '/courses/:course_id/exercises/:id',
    handler: {
      body: 'exercise'
    },
    constraints: { id: '\\d+', course_id: '^[a-z]+$' },
  },
];
  const obj = main(routes, { path: '/courses/slon/exercises/1' });
  expect(obj.serve().body).toEqual('exercise');
});

test('dynamic route2', () => {
  const routes = [
  {
    path: '/courses/:id',
    handler: {
      body: 'course'
    },
    constraints: { id: '\\d+' },
  },
  {
    path: '/courses/:course_id/exercises/:id',
    handler: {
      body: 'exercise'
    },
    constraints: { course_id: '^[a-z]+$' },
  },
];

  //console.log('slon'.match('^([^/]+)$'));
  const obj = main(routes, { path: '/courses/slon/exercises/1' });
  console.log(obj.serve());
  expect(obj.serve().body).toEqual('exercise');
});

test('root case', () => {
  const routes = [
  {
    path: '/courses/:id',
    handler: {
      body: 'course'
    },
    constraints: { id: '\\d+' },
  },
  {
    path: '/courses/:course_id/exercises/:id',
    handler: {
      body: 'exercise'
    },
    constraints: { course_id: '^[a-z]+$' },
  },
  {
    path: '/',
    handler: {
      body: 'root'
    },
  },
];

  const obj = main(routes, { path: '/' });
  expect(obj.serve().body).toEqual('root');
});