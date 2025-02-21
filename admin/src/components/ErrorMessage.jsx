import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const ErrorMessage = ({ error }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 bg-red-100 text-red-800 p-4 rounded-lg shadow-md border border-red-300"
    >
      <AlertTriangle className="w-6 h-6 text-red-600" />
      <span>
        {error?.data ?? "An unexpected error occurred. Please try again."}
      </span>
    </motion.div>
  );
};

export default ErrorMessage; 