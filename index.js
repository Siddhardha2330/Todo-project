const express = require('express');
const bodyParser = require('body-parser');
const { Todo } = require('./models');

const app = express();
app.use(bodyParser.json());


app.get('/todos', async (request, response) => {
    try {
        const todos = await Todo.findAll();
        return response.json(todos);
    } catch (error) {
        return response.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/todos', async (request, response) => {
    try {
        const todo = await Todo.addTodo({ title: request.body.title, dueDate: request.body.dueDate });
        return response.json(todo);
    } catch (error) {
        return response.status(422).json(error);
    }
});

app.put('/todos/:id/markAsCompleted', async (request, response) => {
    try {
        const todo = await Todo.findByPk(request.params.id);
        if (todo) {
            const updatedTodo = await todo.markAsCompleted();
            await todo.save();
            return response.json(updatedTodo);
        } else {
            return response.status(404).json({ error: "Todo not found" });
        }
    } catch (error) {
        return response.status(422).json(error);
    }
});


app.delete('/todos/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const deleted = await Todo.destroy({ where: { id } });
        if (deleted) {
            return response.json(true);
        } else {
            return response.status(404).json(false);
        }
    } catch (error) {
        return response.status(500).json({ error: "Internal Server Error" });
    }
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server }; 
