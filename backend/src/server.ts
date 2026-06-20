import 'dotenv/config';
import express, {Request, Response} from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(router);

app.get('/', (req: Request, res: Response) => {
    res.send("Servidor rodando na porta 3000");
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});