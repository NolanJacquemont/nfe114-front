import {Practitioner, User} from "../models/User";
import { post, get } from "./restUtils";
import {Appointment, Slot} from "../models/Slot.ts";

export const createAccount = async (account: User) => {
    return await post<User, User>('api/users', account, false);
}

export const createPractitionerAccount = async (account: Practitioner) => {
    return await post<Practitioner, Practitioner>('api/practitioners', account, false);
}

export const login = async (username: string, password: string) => {
    return await post<{ email: string, password: string }, { token: string }>('login', { email: username, password }, false);
}

export const loginPractitioner = async (username: string, password: string) => {
    return await post<{ email: string, password: string }, { token: string }>('loginPractitioner', { email: username, password }, false);
}

export const getMe = async (id: string) => {
    return await get<User>('api/users/' + id, false);
}

export const getMePractitioner = async (id: string) => {
    return await get<Practitioner>('api/practitioners/' + id, false);
}

export const getPractitioners = async () => {
    return await get<{ member: Practitioner[] }>('api/practitioners', false);
}

export const getFreeSlots = async (practitionerId: number) => {
    return await get<Slot[]>('freeSlots/' + practitionerId, false);
}

export const getSlots = async (practitionerId: number) => {
    return await get<Slot[]>('slots/' + practitionerId, false);
}

export const getPractitioner = async (practitionerId: string) => {
    return await get<Practitioner>('api/practitioners/' + practitionerId, false);
}

export const postSlot = async (practitionerId: number, datetime: Date) => {
    return await post<{ datetime: Date }, Slot>('slots/' + practitionerId, { datetime: datetime }, false);
}

export const createAppointment = async (data: { userId: number, practitionerId: number, datetime: Date }) => {
    return await post<{ userId: number, practitionerId: number, datetime: Date }, string>('appointments',
    { userId: data.userId, practitionerId: data.practitionerId, datetime: data.datetime }, false);
}

export const getAppointments = async (userId?: number, practitionerId?: number) => {
    let url = 'appointments';
    if (userId) {
        url += '?userId=' + userId;
    }
    if (practitionerId) {
        url += '?practitionerId=' + practitionerId;
    }
    console.log("url", url)
    return await get<Appointment[]>(url, false);
}