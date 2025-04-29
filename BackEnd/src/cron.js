import cron from 'node-cron';
import User from './models/User.js';

// Update user activity status every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    // Update users who haven't been active in the last 5 minutes
    await User.updateMany(
      { lastActivity: { $lt: fiveMinutesAgo }, isActive: true },
      { $set: { isActive: false } }
    );
    
    console.log('User activity status updated');
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
}); 