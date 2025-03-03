
export interface User {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    secuNumber: number;
    birthDate: Date;
    phoneNumber: number;
    password?: string;
    // appointments: Appointment[];
}

export interface Practitioner extends User {
    description: string;
    speciality: string;
    address: string;
}