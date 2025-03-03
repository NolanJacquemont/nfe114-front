export interface Slot {
    id: number;
    time: Date;
    status: string;
    practitioner: string;
}

export interface Appointment {
    id?: number;
    time: Date;
    status: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    practitioner: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        speciality: string;
    };
}