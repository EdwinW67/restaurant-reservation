export interface Reservation {
    name: string;
    email: string;
    guests: number;
    date: Date;
    time: string;
    id?: number;
}
