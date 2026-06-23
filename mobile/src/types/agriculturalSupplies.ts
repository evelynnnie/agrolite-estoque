export interface AgriculturalSupplies{
    id: string;
    name: string;
    quantity: number;
    minimumQuantity: number;
    expirationDate: string;
}

const isoDate = new Date().toISOString();
const atualDate = isoDate.split('T');

const formattedExpiration: string = atualDate[0];