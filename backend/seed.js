require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Employee = require('./models/Employee');
const Seat = require('./models/Seat');
const Holiday = require('./models/Holiday');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seat-allocation');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Employee.deleteMany({});
    await Seat.deleteMany({});
    await Holiday.deleteMany({});
    console.log('Cleared existing data');

    
    const admin = new Employee({
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'password',
      employeeId: 'ADMIN001',
      batch: null,
      role: 'admin',
      department: 'Management'
    });
    await admin.save();
    console.log('Admin created: admin@company.com / password');

    
    const seats = [];
    let seatNumber = 1;
    for (let floor = 1; floor <= 4; floor++) {
      for (let zone = 0; zone < 10; zone++) {
        const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        seats.push({
          seatNumber: `F${floor}-${zones[zone]}${String(seatNumber % 10).padStart(2, '0')}`,
          floor,
          zone: zones[zone],
          isFloater: false,
          features: zone % 3 === 0 ? ['Window', 'Quiet Zone'] : zone % 3 === 1 ? ['Collaboration'] : []
        });
        seatNumber++;
      }
    }
    await Seat.insertMany(seats);
    console.log('Regular seats created');

    
    const floaterSeats = [];
    for (let i = 1; i <= 10; i++) {
      floaterSeats.push({
        seatNumber: `FLOATER-${String(i).padStart(2, '0')}`,
        floor: 2,
        zone: 'Flex',
        isFloater: true,
        features: ['Flexible', 'Hot Desk']
      });
    }
    await Seat.insertMany(floaterSeats);
    console.log('Floater seats created');

    
    const holidays = [
      { date: new Date('2024-01-26'), name: 'Republic Day', type: 'holiday' },
      { date: new Date('2024-03-08'), name: 'Maha Shivaratri', type: 'holiday' },
      { date: new Date('2024-03-25'), name: 'Holi', type: 'holiday' },
      { date: new Date('2024-04-17'), name: 'Ram Navami', type: 'holiday' },
      { date: new Date('2024-04-21'), name: 'Mahavir Jayanti', type: 'holiday' },
      { date: new Date('2024-05-23'), name: 'Buddha Purnima', type: 'holiday' },
      { date: new Date('2024-08-15'), name: 'Independence Day', type: 'holiday' },
      { date: new Date('2024-08-26'), name: 'Janmashtami', type: 'holiday' },
      { date: new Date('2024-09-16'), name: 'Milad un-Nabi', type: 'holiday' },
      { date: new Date('2024-09-28'), name: 'Navratri Start', type: 'holiday' },
      { date: new Date('2024-10-02'), name: 'Gandhi Jayanti', type: 'holiday' },
      { date: new Date('2024-10-12'), name: 'Dussehra', type: 'holiday' },
      { date: new Date('2024-10-31'), name: 'Diwali', type: 'holiday' },
      { date: new Date('2024-11-01'), name: 'Diwali (Day 2)', type: 'holiday' },
      { date: new Date('2024-11-15'), name: 'Guru Nanak Jayanti', type: 'holiday' },
      { date: new Date('2024-12-25'), name: 'Christmas', type: 'holiday' }
    ];
    await Holiday.insertMany(holidays);
    console.log('Holidays created');

    console.log('Database seeding completed successfully!');
    console.log('\nSystem Setup:');
    console.log(' Admin account created: admin@company.com / password');
    console.log('50 seats created (40 regular + 10 floater)');
    console.log('16 holidays configured');
    console.log('\nEmployees: System is empty - employees will register themselves');
    console.log('Go to Register page and create employee accounts with:');
    console.log('   - Batch 1: Mon-Wed (Week 1), Thu-Fri (Week 2)');
    console.log('   - Batch 2: Thu-Fri (Week 1), Mon-Wed (Week 2)');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
