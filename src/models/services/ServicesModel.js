import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";


export const ServicesModel=sequelize.define("ServicesModel",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Servicename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
      Description:{
        type:DataTypes.STRING
      },
      Price:{
        type:DataTypes.INTEGER
        
      }

})