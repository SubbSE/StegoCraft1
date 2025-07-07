// src/utils/userDatabase.js
export const UserDatabase = {
  // Initialize database with demo users
  initialize() {
    const demoUsers = [
      { username: 'demo', password: 'stegocraft2024', email: 'demo@stegocraft.com' },
      { username: 'admin', password: 'hidden123', email: 'admin@stegocraft.com' },
      { username: 'guest', password: 'secret456', email: 'guest@stegocraft.com' }
    ];

    const existingUsers = localStorage.getItem('stegoCraftUsers');
    if (!existingUsers) {
      localStorage.setItem('stegoCraftUsers', JSON.stringify(demoUsers));
    }
  },

  // Get all users
  getUsers() {
    this.initialize();
    return JSON.parse(localStorage.getItem('stegoCraftUsers') || '[]');
  },

  // Add new user
  addUser(user) {
    const users = this.getUsers();
    const newUser = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('stegoCraftUsers', JSON.stringify(users));
    return newUser;
  },

  // Check if user exists
  userExists(username, email) {
    const users = this.getUsers();
    return users.find(user => 
      user.username.toLowerCase() === username.toLowerCase() || 
      user.email.toLowerCase() === email.toLowerCase()
    );
  },

  // Validate user credentials
  validateUser(username, password) {
    const users = this.getUsers();
    return users.find(user => 
      user.username === username && user.password === password
    );
  },

  // Get user by username
  getUser(username) {
    const users = this.getUsers();
    return users.find(user => user.username === username);
  },

  // Clear all users (for testing)
  clearUsers() {
    localStorage.removeItem('stegoCraftUsers');
  },

  // Export users (for backup)
  exportUsers() {
    return this.getUsers();
  }
};
