interface ICalculatedForecast {
    materials:[{
        material_id:string;
        amount:number;
    }]
}

export const calculateMaterials = async ([{product_id, amount}]):Promise<ICalculatedForecast> => {



    return null; 

}