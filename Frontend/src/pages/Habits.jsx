import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
  Skeleton,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  Cancel,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/AuthContext';
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} from '../services/api';

const MotionCard = motion.create(Card);

const emptyForm = { title: '', description: '', time: '', status: 'active' };

const statusConfig = {
  active: { color: 'primary', icon: <Schedule fontSize="small" /> },
  completed: { color: 'success', icon: <CheckCircle fontSize="small" /> },
  skipped: { color: 'error', icon: <Cancel fontSize="small" /> },
};

export default function Habits() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchHabits = useCallback(async () => {
    try {
      const { data } = await getHabits();
      setHabits(data.filter((h) => h.userId === user._id));
    } catch {
      enqueueSnackbar('Failed to load habits', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user._id, enqueueSnackbar]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (habit) => {
    setEditing(habit);
    setForm({
      title: habit.title,
      description: habit.description,
      time: habit.time,
      status: habit.status,
    });
    setDialogOpen(true);
  };

  const confirmDelete = (habit) => {
    setToDelete(habit);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateHabit(editing._id, form);
        enqueueSnackbar('Habit updated!', { variant: 'success' });
      } else {
        await createHabit({ ...form, userId: user._id });
        enqueueSnackbar('Habit created!', { variant: 'success' });
      }
      setDialogOpen(false);
      fetchHabits();
    } catch {
      enqueueSnackbar('Failed to save habit', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHabit(toDelete._id);
      enqueueSnackbar('Habit deleted', { variant: 'info' });
      setDeleteDialogOpen(false);
      fetchHabits();
    } catch {
      enqueueSnackbar('Failed to delete habit', { variant: 'error' });
    }
  };

  const quickStatusUpdate = async (habit, newStatus) => {
    try {
      await updateHabit(habit._id, { status: newStatus });
      fetchHabits();
      enqueueSnackbar(`Habit marked as ${newStatus}`, { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={50} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Typography variant="h4">My Habits</Typography>
          <Typography variant="body2" color="text.secondary">
            Build better daily routines
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            Add Habit
          </Button>
        </motion.div>
      </Box>

      {habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <Schedule sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No habits yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first habit to start building better routines
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
                Create First Habit
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Grid container spacing={2}>
          <AnimatePresence>
            {habits.map((habit, index) => (
              <Grid key={habit._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardContent sx={{ p: 3, flex: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" sx={{ flex: 1, mr: 1 }}>
                        {habit.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={habit.status}
                        icon={statusConfig[habit.status]?.icon}
                        color={statusConfig[habit.status]?.color}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
                      {habit.description}
                    </Typography>
                    <Chip
                      size="small"
                      label={`⏰ ${habit.time}`}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />

                    {/* Quick status actions */}
                    {habit.status === 'active' && (
                      <Box display="flex" gap={1} mb={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => quickStatusUpdate(habit, 'completed')}
                          startIcon={<CheckCircle />}
                        >
                          Complete
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => quickStatusUpdate(habit, 'skipped')}
                          startIcon={<Cancel />}
                        >
                          Skip
                        </Button>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="flex-end" gap={0.5} mt="auto">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(habit)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => confirmDelete(habit)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          transition: {
            onEnter: () => {},
          },
        }}
      >
        <DialogTitle>{editing ? 'Edit Habit' : 'New Habit'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            multiline
            rows={3}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Time (e.g., 7:00 AM, Morning)"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          {editing && (
            <TextField
              fullWidth
              select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="skipped">Skipped</MenuItem>
            </TextField>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !form.title || !form.description || !form.time}
          >
            {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Habit?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{toDelete?.title}&quot;? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
