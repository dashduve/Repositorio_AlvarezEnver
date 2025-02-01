import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { LocalStorageService, STORAGE_KEYS } from '../services/localStorage';
import { Client } from '../interfaces';

const ClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '' });

  useEffect(() => {
    const storedClients = LocalStorageService.getItem<Client[]>(STORAGE_KEYS.CLIENTS) || [];
    setClients(storedClients);
  }, []);

  const handleSave = (client: Client) => {
    let newClients: Client[];
    if (editingClient) {
      newClients = clients.map(c => c.id === client.id ? client : c);
    } else {
      newClients = [...clients, { ...client, id: crypto.randomUUID(), createdAt: new Date() }];
    }
    setClients(newClients);
    LocalStorageService.setItem(STORAGE_KEYS.CLIENTS, newClients);
    setEditingClient(null);
    setFormData({ fullName: '', email: '' });
  };

  const handleDelete = (id: string) => {
    const newClients = clients.filter(client => client.id !== id);
    setClients(newClients);
    LocalStorageService.setItem(STORAGE_KEYS.CLIENTS, newClients);
  };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Typography>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave({ id: editingClient?.id || '', ...formData, createdAt: editingClient?.createdAt || new Date() }); }}>
            <TextField
              label="Nombre Completo"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              {editingClient ? 'Actualizar' : 'Guardar'}
            </Button>
            {editingClient && (
              <Button variant="outlined" onClick={() => setEditingClient(null)} sx={{ ml: 2 }}>
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
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.fullName}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditingClient(client); setFormData({ fullName: client.fullName, email: client.email }); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(client.id)}>
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

export default ClientManagement;