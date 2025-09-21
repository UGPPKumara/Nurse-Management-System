// File: Backend/seedAdmin.js

const sequelize = require('./config/database');
const User = require('./models/User');

// --- SET YOUR ADMIN CREDENTIALS HERE ---
const ADMIN_EMAIL = 'nuvooraitsolution@gmail.com';
const ADMIN_PASSWORD = 'admin'; // Change this to a secure password
// -----------------------------------------

const createAdmin = async () => {
    try {
        await sequelize.sync(); // Make sure the User table exists

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email: ADMIN_EMAIL } });

        if (existingUser) {
            console.log('Admin user already exists.');
            return;
        }

        // Create the new user. The 'beforeCreate' hook in your User model
        // will automatically hash the password before saving.
        await User.create({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
        });

        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await sequelize.close();
    }
};

createAdmin();