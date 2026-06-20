import {supplies} from "./database";
import { Router, Request, Response } from "express";
import { AgriculturalSupplies } from "./types/agriculturalSupplies";

const router = Router();

router.get('/supplies', (req: Request, res: Response) => {
    res.json(supplies)
});

router.post('/supplies', (req: Request<{}, {}, AgriculturalSupplies >, res: Response) => {
    const {name, quantity, minimumQuantity, expirationDate } = req.body;

    const newSupply = { id: Date.now().toString(), name, quantity: Number(quantity), minimumQuantity: Number(minimumQuantity), expirationDate };
    supplies.push(newSupply);

    console.log(`Produto criado: ${name}, Id: ${newSupply.id}, Quantidade: ${quantity}, Quantidade Mínima: ${minimumQuantity}, Data de Expiração: ${expirationDate}`);

    res.status(201).json(newSupply);
});

router.put('/supplies/:id', (req: Request<{id: string}, {}, Partial<AgriculturalSupplies>>, res: Response) => {
    const suppliesId = req.params.id;
    const {name, quantity, minimumQuantity, expirationDate} = req.body;

    const index = supplies.findIndex(supply => supply.id === suppliesId); 

    if(index === -1){
        return res.status(404).json({error: "Produto não encontrado"});
    }
    
    const currentSupply = supplies[index];

    supplies[index] = { 
        id: suppliesId,
        name: name!== undefined ? name : currentSupply.name,
        quantity: quantity !== undefined ? Number(quantity) : currentSupply.quantity,
        minimumQuantity: minimumQuantity !== undefined ? Number(minimumQuantity) : currentSupply.minimumQuantity,
        expirationDate: expirationDate !== undefined ? expirationDate : currentSupply.expirationDate
    };


    res.json(supplies[index]);
});

router.delete('/supplies/:id', (req: Request<{id: string}>, res: Response) => {
    const suppliesId = req.params.id;

    const index = supplies.findIndex(supply => supply.id === suppliesId);

    if (index === -1){
        return res.status(404).json({error: "Produto não encontrado"})
    };

    supplies.splice(index, 1);

    return res.status(204).send();
});

export default router;