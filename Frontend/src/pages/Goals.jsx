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
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Flag,
  CheckCircle,
  HourglassEmpty,
  PlayArrow,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuth } from '../context/AuthContext';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../services/api';

dayjs.extend(relativeTime);

const MotionCard = motion.create(Card);

const emptyForm = { title: '', description: '', deadline: '', status: 'pending' };

const statusConfig = {
  pending: { color: 'warning', icon: <HourglassEmpty fontSize="small" />, label: 'Pending' },
  'in-progress': { color: 'primary', icon: <PlayArrow fontSize="small" />, label: 'In Progress' },
  completed: { color: 'success', icon: <CheckCircle fontSize="small" />, label: 'Completed' },
};

export default function Goals() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchGoals = useCallback(async () => {
    try {
      const { data } = await getGoals();
      setGoals(data.filter((g) => g.userId === user._id));
    } catch {
      enqueueSnackbar('Failed to load goals', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user._id, enqueueSnackbar]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (goal) => {
    setEditing(goal);
    setForm({
      title: goal.title,
      description: goal.description,
      deadline: dayjs(goal.deadline).format('YYYY-MM-DD'),
      status: goal.status,
    });
    setDialogOpen(true);
  };

  const confirmDelete = (goal) => {
    setToDelete(goal);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateGoal(editing._id, form);
        enqueueSnackbar('Goal updated!', { variant: 'success' });
      } else {
        await createGoal({ ...form, userId: user._id });
        enqueueSnackbar('Goal created!', { variant: 'success' });
      }
      setDialogOpen(false);
      fetchGoals();
    } catch {
      enqueueSnackbar('Failed to save goal', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(toDelete._id);
      enqueueSnackbar('Goal deleted', { variant: 'info' });
      setDeleteDialogOpen(false);
      fetchGoals();
    } catch {
      enqueueSnackbar('Failed to delete goal', { variant: 'error' });
    }
  };

  const quickStatusUpdate = async (goal, newStatus) => {
    try {
      await updateGoal(goal._id, { status: newStatus });
      fetchGoals();
      enqueueSnackbar(`Goal marked as ${newStatus}`, { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    }
  };

  const getDeadlineInfo = (deadline) => {
    const d = dayjs(deadline);
    const now = dayjs();
    const isPast = d.isBefore(now, 'day');
    const daysLeft = d.diff(now, 'day');
    return { formatted: d.format('MMM D, YYYY'), isPast, daysLeft, relative: d.fromNow() };
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={50} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={220} />
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
          <Typography variant="h4">My Goals</Typography>
          <Typography variant="body2" color="text.secondary">
            Set targets and track your achievements
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            Add Goal
          </Button>
        </motion.div>
      </Box>

      {goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <Flag sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No goals yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Set your first goal and start achieving great things
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
                Create First Goal
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Grid container spacing={2}>
          <AnimatePresence>
            {goals.map((goal, index) => {
              const dl = getDeadlineInfo(goal.deadline);
              const progressValue =
                goal.status === 'completed' ? 100 : goal.status === 'in-progress' ? 50 : 0;

              return (
                <Grid key={goal._id} size={{ xs: 12, sm: 6, md: 4 }}>
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
                          {goal.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={statusConfig[goal.status].label}
                          icon={statusConfig[goal.status].icon}
                          color={statusConfig[goal.status].color}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
                        {goal.description}
                      </Typography>

                      {/* Deadline */}
                      <Box mb={2}>
                        <Chip
                          size="small"
                          label={`📅 ${dl.formatted}`}
                          variant="outlined"
                          color={dl.isPast && goal.status !== 'completed' ? 'error' : 'default'}
                        />
                        <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                          {goal.status === 'completed'
                            ? 'Completed!'
                            : dl.isPast
                            ? 'Overdue'
                            : `${dl.daysLeft} days left`}
                        </Typography>
                      </Box>

                      {/* Progress bar */}
                      <Box mb={2}>
                        <LinearProgress
                          variant="determinate"
                          value={progressValue}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: '#f1f5f9',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              background:
                                goal.status === 'completed'
                                  ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                                  : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                            },
                          }}
                        />
                      </Box>

                      {/* Quick status actions */}
                      {goal.status !== 'completed' && (
                        <Box display="flex" gap={1} mb={1}>
                          {goal.status === 'pending' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => quickStatusUpdate(goal, 'in-progress')}
                              startIcon={<PlayArrow />}
                            >
                              Start
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => quickStatusUpdate(goal, 'completed')}
                            startIcon={<CheckCircle />}
                          >
                            Complete
                          </Button>
                        </Box>
                      )}

                      <Box display="flex" justifyContent="flex-end" gap={0.5} mt="auto">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(goal)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => confirmDelete(goal)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? 'Edit Goal' : 'New Goal'}</DialogTitle>
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
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            sx={{ mb: 2 }}
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
          {editing && (
            <TextField
              fullWidth
              select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !form.title || !form.description || !form.deadline}
          >
            {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Goal?</DialogTitle>
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
