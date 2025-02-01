import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { LocalStorageService, STORAGE_KEYS } from '../services/localStorage';
import { Room } from '../interfaces';

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({ number: '', type: 'individual', pricePerNight: 0, isAvailable: true });

  useEffect(() => {
    const storedRooms = LocalStorageService.getItem<Room[]>(STORAGE_KEYS.ROOMS) || [];
    setRooms(storedRooms);
  }, []);

  const handleSave = (room: Room) => {
    let newRooms: Room[];
    if (editingRoom) {
      newRooms = rooms.map(r => r.id === room.id ? room : r);
    } else {
      newRooms = [...rooms, { ...room, id: crypto.randomUUID() }];
    }
    setRooms(newRooms);
    LocalStorageService.setItem(STORAGE_KEYS.ROOMS, newRooms);
    setEditingRoom(null);
    setFormData({ number: '', type: 'individual', pricePerNight: 0, isAvailable: true });
  };

  const handleDelete = (id: string) => {
    const newRooms = rooms.filter(room => room.id !== id);
    setRooms(newRooms);
    LocalStorageService.setItem(STORAGE_KEYS.ROOMS, newRooms);
  };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingRoom ? 'Editar Habitación' : 'Nueva Habitación'}
          </Typography>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave({ id: editingRoom?.id || '', ...formData }); }}>
            <TextField
              label="Número de Habitación"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de Habitación</InputLabel>
              <Select
                value={formData.type}
                label="Tipo de Habitación"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Room['type'] })}
              >
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="double">Doble</MenuItem>
                <MenuItem value="suite">Suite</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Precio por Noche"
              type="number"
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              {editingRoom ? 'Actualizar' : 'Guardar'}
            </Button>
            {editingRoom && (
              <Button variant="outlined" onClick={() => setEditingRoom(null)} sx={{ ml: 2 }}>
                Cancelar
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Precio por Noche</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.number}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>${room.pricePerNight}</TableCell>
                <TableCell>{room.isAvailable ? 'Disponible' : 'Ocupada'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditingRoom(room); setFormData({ number: room.number, type: room.type, pricePerNight: room.pricePerNight, isAvailable: room.isAvailable }); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(room.id)}>
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

export default RoomManagement;