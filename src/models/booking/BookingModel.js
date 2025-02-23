import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";
import { User } from "../user/User.js";
import { ServicesModel } from "../services/ServicesModel.js";


export const BookingModel = sequelize.define("BookingModel", {
    Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Day: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ServicesModel,
            key: "id"
        }
    },
    userId: {   // Foreign key for User
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    }
});
BookingModel.belongsTo(User, { foreignKey: 'userId' });
BookingModel.belongsTo(ServicesModel, { foreignKey: 'serviceId' });

User.hasMany(BookingModel, { foreignKey: 'userId' });
ServicesModel.hasMany(BookingModel, { foreignKey: 'serviceId' });