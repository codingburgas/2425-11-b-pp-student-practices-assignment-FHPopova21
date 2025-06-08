import { BodyMeasurements } from '@/types';

const API_URL = 'http://localhost:5001/api';

export const measurementsService = {
    saveMeasurements: async (measurements: BodyMeasurements) => {
        const response = await fetch(`${API_URL}/measurements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(measurements),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save measurements');
        }

        return response.json();
    },

    getMeasurements: async () => {
        const response = await fetch(`${API_URL}/measurements`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok && response.status !== 404) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get measurements');
        }

        return response.json();
    },
}; 