import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.post('/users', async (req, res) => {
  const {name, age, email} = req.body

  const user = await prisma.user.create({
    data: {
      age: age,
      name: name,
      email: email,
    }
  })

  res.status(201).json(user);
});

app.get('/users', async (req, res) => {
  const params = req.query;

  const where = Object.keys(params).reduce((acc, key) => {
    acc[key] = key === 'name'
     ? {equals : params[key], mode: 'insensitive'}
     : params[key];
    return acc;
  }, {});

  const users = await prisma.user.findMany({
    where
  });
  res.status(200).json(users);
});

app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body

  await prisma.user.update({
    where: {
      id
    },
    data
  })

  res.status(200).send(req.body);
});

app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;

  await prisma.user.delete({
    where: {
      id
    },
  })

  res.status(200).json({message: 'Usuário excluido com sucesso'});
});


app.listen(3003, () => {
  console.log('server running on port http://localhost:3003');
});