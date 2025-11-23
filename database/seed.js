require('dotenv').config();
const { sequelize, User, Project, Task } = require('./setup');

async function seed() {
  try {
    await sequelize.authenticate();

    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'TEMP_PLAIN_PASSWORD' // will not be used for real login
    });

    const project1 = await Project.create({
      name: 'School Tasks',
      description: 'Assignments and projects',
      userId: user.id
    });

    const project2 = await Project.create({
      name: 'Personal Tasks',
      description: 'Random life stuff',
      userId: user.id
    });

    await Task.bulkCreate([
      { title: 'Finish backend homework', completed: false, projectId: project1.id },
      { title: 'Clean room', completed: false, projectId: project2.id },
      { title: 'Go to the gym', completed: false, projectId: project2.id }
    ]);

    console.log('✅ Seeded user, projects, and tasks');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await sequelize.close();
  }
}

// Only run when called directly: 
ode database/seed.js
if (require.main === module) {
  seed();
}
