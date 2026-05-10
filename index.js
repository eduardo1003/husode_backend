const app = require('./src/app');
const { sequelize, Admin } = require('./src/models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ alter: true }); // Automatically updates table schema to match models
    console.log('Models synchronized.');

    // Create default superadmin if not exists
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        name: 'SuperAdmin',
        email: 'admin@husode.org',
        password: hashedPassword
      });
      console.log('Default SuperAdmin created: admin@husode.org / admin123');
    }
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initDb();
});
