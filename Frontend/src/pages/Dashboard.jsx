import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import {
  CheckCircle,
  TrendingUp,
  Flag,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getHabits, getGoals } from '../services/api';

const MotionCard = motion.create(Card);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [hRes, gRes] = await Promise.all([getHabits(), getGoals()]);
        const userHabits = hRes.data.filter((h) => h.userId === user._id);
        const userGoals = gRes.data.filter((g) => g.userId === user._id);
        setHabits(userHabits);
        setGoals(userGoals);
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user._id]);

  const completedHabits = habits.filter((h) => h.status === 'completed').length;
  const activeHabits = habits.filter((h) => h.status === 'active').length;
  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const inProgressGoals = goals.filter((g) => g.status === 'in-progress').length;
  const habitRate = habits.length ? Math.round((completedHabits / habits.length) * 100) : 0;
  const goalRate = goals.length ? Math.round((completedGoals / goals.length) * 100) : 0;

  const stats = [
    {
      title: 'Active Habits',
      value: activeHabits,
      icon: <Schedule />,
      color: '#6366f1',
      bg: '#eef2ff',
    },
    {
      title: 'Completed Habits',
      value: completedHabits,
      icon: <CheckCircle />,
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      title: 'Goals In Progress',
      value: inProgressGoals,
      icon: <TrendingUp />,
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      title: 'Goals Completed',
      value: completedGoals,
      icon: <Flag />,
      color: '#06b6d4',
      bg: '#ecfeff',
    },
  ];

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={50} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rounded" height={140} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome back, {user.name} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Here&apos;s your progress overview
        </Typography>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={3} mb={4}>
          {stats.map((stat) => (
            <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <MotionCard variants={cardVariants} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: stat.bg,
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Progress Bars */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Habit Completion
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box flex={1}>
                    <LinearProgress
                      variant="determinate"
                      value={habitRate}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#eef2ff',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {habitRate}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {completedHabits} of {habits.length} habits completed
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Goal Progress
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box flex={1}>
                    <LinearProgress
                      variant="determinate"
                      value={goalRate}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#ecfdf5',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    {goalRate}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {completedGoals} of {goals.length} goals completed
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Habits
            </Typography>
            {habits.length === 0 ? (
              <Typography color="text.secondary">
                No habits yet. Start by adding your first habit!
              </Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={1.5}>
                {habits.slice(0, 5).map((habit) => (
                  <Box
                    key={habit._id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">{habit.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {habit.time}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={habit.status}
                      color={
                        habit.status === 'completed'
                          ? 'success'
                          : habit.status === 'skipped'
                          ? 'error'
                          : 'primary'
                      }
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
