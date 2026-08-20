import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban-test-backend';

  try {
    const connection = await mongoose.connect(mongoUri);

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
