export interface Client {
    id: string;
    fullName: string;
    email: string;
    createdAt: Date;
  }
  
  export interface Room {
    id: string;
    type: 'individual' | 'double' | 'suite';
    pricePerNight: number;
    number: string;
    isAvailable: boolean;
  }
  
  export interface Reservation {
    id: string;
    clientId: string;
    roomIds: string[];
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  }