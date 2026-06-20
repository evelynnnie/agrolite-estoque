import { AgriculturalSupplies } from "./types/agriculturalSupplies";

//Nomeclaturas
// S - Mineral Salt (sal mineral)
// F - Food (ração)
// V - Vaccine (vacina)
// D - Dewormers (vermífugos)
// M - Medicines (medicamentos)

export let supplies: Array<AgriculturalSupplies> = [
    {id: "S1", name:"Sal Mineral", quantity: 50, minimumQuantity: 10, expirationDate: '2026-08-15'},
    {id: "F1", name: "Ração", quantity: 3, minimumQuantity: 15, expirationDate: '2026-07-22'},
    {id: "V1", name: "Vacina", quantity: 20, minimumQuantity: 5, expirationDate: '2026-06-21'},
]