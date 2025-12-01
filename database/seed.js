require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Project, Task } = require('./setup');

async function seed() {
  try {
    await sequelize.authenticate();

    const hashedPassword = await bcrypt.hash('password123', 10);

    const john = await User.create({
      username: 'John Employee',
      email: 'john@company.com',
      password: hashedPassword,
      role: 'employee'
    });

    const sarah = await User.create({
      username: 'Sarah Manager',
      email: 'sarah@company.com',
      password: hashedPassword,
      role: 'manager'
    });

    const mike = await User.create({
      username: 'Mike Admin',
      email: 'mike@company.com',
      password: hashedPassword,
      role: 'admin'
    });

    const projectA = await Project.create({
      name: 'Website Redesign',
      description: 'Redesign the company website',
      userId: sarah.id
    });

    const projectB = await Project.create({
      name: 'Internal Tooling',
      description: 'Build internal tools for employees',
      userId: mike.id
    });

    await Task.bulkCreate([
      { title: 'Create wireframes', completed: false, projectId: projectA.id },
      { title: 'Set up CI pipeline', completed: false, projectId: projectB.id },
      { title: 'Fix login bug', completed: false, projectId: projectB.id }
    ]);

    console.log('✅ Seeded users with roles, projects, and tasks');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  seed();
}
