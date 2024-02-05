import { allowedOrigins } from "./allowedOrigins";
import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like curl requests, mobile apps, etc.)
        if (!origin) {
            callback(null, true);
            return;
        }

        // Check if the request origin is allowed
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
