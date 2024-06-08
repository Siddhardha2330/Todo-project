// __tests__/todo.test.js
const request = require('supertest');
const { sequelize, Todo } = require('../models');
const { app, server } = require('../index'); 

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
    server.close();
});

describe('DELETE /todos/:id', () => {
    test('should delete a todo and return true', async () => {
       
        const todo = await Todo.create({ title: 'Test todo', dueDate: new Date(), completed: false });

        const response = await request(app).delete(`/todos/${todo.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(true);

        const deletedTodo = await Todo.findByPk(todo.id);
        expect(deletedTodo).toBeNull();
    });

    test('should return 404 and false if todo not found', async () => {
        const response = await request(app).delete('/todos/99999'); 
        expect(response.statusCode).toBe(404);
        expect(response.body).toBe(false);
    });
});
