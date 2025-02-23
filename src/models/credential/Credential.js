import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/index.js'; // Adjust the path based on your project structure

const CredSchema = sequelize.define('Cred', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'creds', // This will map to the 'creds' table in your database
  timestamps: false, // Disable createdAt and updatedAt columns if not needed
});

export default CredSchema;
