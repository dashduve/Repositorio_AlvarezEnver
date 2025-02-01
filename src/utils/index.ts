import { Reservation } from '../interfaces';

export const isRoomAvailable = (
  roomId: string,
  startDate: Date,
  endDate: Date,
  existingReservations: Reservation[]
): boolean => {
  return !existingReservations.some(reservation => {
    if (!reservation.roomIds.includes(roomId)) return false;
    const reservationStart = new Date(reservation.startDate);
    const reservationEnd = new Date(reservation.endDate);
    return (
      (startDate >= reservationStart && startDate < reservationEnd) ||
      (endDate > reservationStart && endDate <= reservationEnd) ||
      (startDate <= reservationStart && endDate >= reservationEnd)
    );
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString();
};

export const calculateNights = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

export const getDateRangeArray = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};