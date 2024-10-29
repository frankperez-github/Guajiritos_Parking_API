import Log from '../models/Logs';

const createLog = async (action: "reservation" | "exit" | "entry" | "cancellation", userId: string, details: string) => {
  try {
    const log = new Log({ action, userId, details });
    await log.save();
  } catch (error) {
    console.error("Error saving log:", error);
  }
};

export default createLog
