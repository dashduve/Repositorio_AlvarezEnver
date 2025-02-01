import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalStorageService, STORAGE_KEYS } from '../services/localStorage';
import { Reservation, Client, Room } from '../interfaces';
import { isRoomAvailable } from '../utils';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [formData, setFormData] = useState({
    clientId: '',
    roomIds: [] as string[],
    startDate: null as Date | null,
    endDate: null as Date | null,
    status: 'pending' as Reservation['status'],
  });

  useEffect(() => {
    const storedReservations = LocalStorageService.getItem<Reservation[]>(STORAGE_KEYS.RESERVATIONS) || [];
    const storedClients = LocalStorageService.getItem<Client[]>(STORAGE_KEYS.CLIENTS) || [];
    const storedRooms = LocalStorageService.getItem<Room[]>(STORAGE_KEYS.ROOMS) || [];
    setReservations(storedReservations);
    setClients(storedClients);
    setRooms(storedRooms);
  }, []);

  const handleSave = (reservation: Reservation) => {
    let newReservations: Reservation[];
    if (editingReservation) {
      newReservations = reservations.map(r => r.id === reservation.id ? reservation : r);
    } else {
      newReservations = [...reservations, { ...reservation, id: crypto.randomUUID() }];
    }
    setReservations(newReservations);
    LocalStorageService.setItem(STORAGE_KEYS.RESERVATIONS, newReservations);
    setEditingReservation(null);
    setFormData({
      clientId: '',
      roomIds: [],
      startDate: null,
      endDate: null,
      status: 'pending',
    });
  };

  const handleDelete = (id: string) => {
    const newReservations = reservations.filter(reservation => reservation.id !== id);
    setReservations(newReservations);
    LocalStorageService.setItem(STORAGE_KEYS.RESERVATIONS, newReservations);
  };

  const calculateTotalPrice = () => {
    if (!formData.startDate || !formData.endDate || formData.roomIds.length === 0) return 0;
    const days = Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalRoomPrice = formData.roomIds.reduce((total, roomId) => {
      const room = rooms.find(r => r.id === roomId);
      return total + (room?.pricePerNight || 0);
    }, 0);
    return days * totalRoomPrice;
  };

  const validateForm = () => {
    const newErrors = {
      clientId: '',
      roomIds: '',
      dates: '',
    };

    if (!formData.clientId) {
      newErrors.clientId = 'Debe seleccionar un cliente';
    }

    if (formData.roomIds.length === 0) {
      newErrors.roomIds = 'Debe seleccionar al menos una habitación';
    }

    if (!formData.startDate || !formData.endDate) {
      newErrors.dates = 'Debe seleccionar fechas válidas';
    } else if (formData.endDate <= formData.startDate) {
      newErrors.dates = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (formData.startDate && formData.endDate && formData.roomIds.length > 0) {
      const unavailableRooms = formData.roomIds.filter(roomId => 
        !isRoomAvailable(
          roomId,
          formData.startDate!,
          formData.endDate!,
          reservations.filter(r => r.id !== editingReservation?.id)
        )
      );

      if (unavailableRooms.length > 0) {
        newErrors.roomIds = 'Algunas habitaciones no están disponibles para las fechas seleccionadas';
      }
    }

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const totalPrice = calculateTotalPrice();
      handleSave({
        id: editingReservation?.id || '',
        ...formData,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        totalPrice,
      });
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingReservation ? 'Editar Reserva' : 'Nueva Reserva'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl error={!!formData.clientId}>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value as string })}
                label="Cliente"
              >
                {clients.map(client => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl error={!!formData.roomIds}>
              <InputLabel>Habitaciones</InputLabel>
              <Select
                multiple
                value={formData.roomIds}
                onChange={(e) => setFormData({ ...formData, roomIds: e.target.value as string[] })}
                input={<OutlinedInput label="Habitaciones" />}
                renderValue={(selected) => {
                  return selected
                    .map(id => rooms.find(room => room.id === id)?.number)
                    .join(', ');
                }}
              >
                {rooms.map(room => (
                  <MenuItem key={room.id} value={room.id}>
                    <Checkbox checked={formData.roomIds.indexOf(room.id) > -1} />
                    <ListItemText primary={`${room.number} - ${room.type} ($${room.pricePerNight}/noche)`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Fecha de inicio"
                value={formData.startDate}
                onChange={(date) => setFormData({ ...formData, startDate: date })}
              />
              <DatePicker
                label="Fecha de fin"
                value={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date })}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary">
                {editingReservation ? 'Actualizar' : 'Crear Reserva'}
              </Button>
              {editingReservation && (
                <Button variant="outlined" onClick={() => setEditingReservation(null)}>
                  Cancelar
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Habitaciones</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Precio Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{clients.find(client => client.id === reservation.clientId)?.fullName || 'Cliente no encontrado'}</TableCell>
                <TableCell>{reservation.roomIds.map(id => rooms.find(room => room.id === id)?.number).join(', ')}</TableCell>
                <TableCell>{new Date(reservation.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(reservation.endDate).toLocaleDateString()}</TableCell>
                <TableCell>${reservation.totalPrice}</TableCell>
                <TableCell>{reservation.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditingReservation(reservation); setFormData({ clientId: reservation.clientId, roomIds: reservation.roomIds, startDate: new Date(reservation.startDate), endDate: new Date(reservation.endDate), status: reservation.status }); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(reservation.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReservationManagement;