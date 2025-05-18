import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Container,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { useQuizzes } from "../hooks/useQuizzes";
import { useAnnouncements } from "../hooks/useAnnouncements";

const DashboardPage: React.FC = () => {
  const {
    quizzes,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useQuizzes();
  const {
    announcements,
    isLoading: announcementsLoading,
    error: announcementsError,
  } = useAnnouncements();

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  if (quizzesLoading || announcementsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  if (quizzesError || announcementsError) {
    return <Alert severity="error">{quizzesError || announcementsError}</Alert>;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 2, sm: 4 },
        px: { xs: 0, sm: 0 },
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: { xs: 3, sm: 4 },
            fontWeight: 700,
            fontSize: { xs: "2rem", sm: "2.5rem" },
          }}
        >
          Dashboard
        </Typography>

        <Grid container spacing={2}>
          <Grid>
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                minHeight: 320,
                bgcolor: "#fff",
                boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                }}
              >
                Upcoming Quizzes
              </Typography>

              {quizzes?.length === 0 ? (
                <Typography color="text.secondary">
                  No upcoming quizzes found.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {quizzes?.map((quiz) => (
                    <Paper
                      key={quiz._id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        bgcolor: "grey.50",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px) scale(1.01)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        {quiz.title}
                      </Typography>
                      <Typography sx={{ mb: 1 }} color="text.secondary">
                        {quiz.description}
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 500, color: "primary.main" }}
                      >
                        Date: {new Date(quiz.date).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          {isSmDown && (
            <Grid>
              <Divider sx={{ my: 3 }} />
            </Grid>
          )}

          <Grid>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                minHeight: 320,
                bgcolor: "#fff",
                boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                }}
              >
                Latest Announcements
              </Typography>

              {announcements?.length === 0 ? (
                <Typography color="text.secondary">
                  No announcements found.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {announcements?.slice(0, 5).map((announcement) => (
                    <Paper
                      key={announcement._id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        bgcolor: "grey.50",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px) scale(1.01)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        {announcement.title}
                      </Typography>
                      <Typography sx={{ mb: 1 }} color="text.secondary">
                        {announcement.content}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Posted:{" "}
                        {new Date(announcement.postedAt).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
