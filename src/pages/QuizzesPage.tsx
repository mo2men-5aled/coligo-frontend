import { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Container,
  Stack,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useQuizzes } from "../hooks/useQuizzes";
import { useAppDispatch } from "../store/hooks";
import {
  createQuizThunk,
  deleteQuizThunk,
  fetchQuizzesThunk,
  updateQuizThunk,
} from "../store/slices/quizSlice";
import { useSnackbar } from "notistack";
import type { Quiz } from "../types/quizType";

export default function QuizzesPage() {
  const { quizzes, isLoading, pagination, handlePageChange, isTeacher } =
    useQuizzes();

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  // State for create quiz dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  // Local loading state for create and delete
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for edit quiz dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editQuizId, setEditQuizId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle create quiz
  const handleCreateQuiz = async () => {
    if (!title || !description || !date) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }

    setIsCreating(true);
    try {
      await dispatch(
        createQuizThunk({
          title,
          description,
          date: date.toISOString(),
        })
      ).unwrap();

      enqueueSnackbar("Quiz created successfully", { variant: "success" });
      setOpenCreateDialog(false);
      setTitle("");
      setDescription("");
      setDate(new Date());
      // Refresh quizzes (go to first page maybe?)
      dispatch(fetchQuizzesThunk({ page: pagination.page }));
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to create quiz", { variant: "error" });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle delete quiz
  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteQuizThunk(quizToDelete)).unwrap();
      enqueueSnackbar("Quiz deleted successfully", { variant: "success" });
      setOpenDeleteDialog(false);
      setQuizToDelete(null);
      // Refresh quizzes on current page
      dispatch(fetchQuizzesThunk({ page: pagination.page }));
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to delete quiz", { variant: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (quiz: Quiz) => {
    setEditQuizId(quiz._id);
    setEditTitle(quiz.title);
    setEditDescription(quiz.description);
    setEditDate(new Date(quiz.date));
    setOpenEditDialog(true);
  };

  const handleUpdateQuiz = async () => {
    if (!editQuizId || !editTitle || !editDescription || !editDate) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }
    setIsUpdating(true);
    try {
      await dispatch(updateQuizThunk({ id: editQuizId, title: editTitle, description: editDescription, date: editDate.toISOString() })).unwrap();
      enqueueSnackbar("Quiz updated successfully", { variant: "success" });
      setOpenEditDialog(false);
      setEditQuizId(null);
      setEditTitle("");
      setEditDescription("");
      setEditDate(null);
    } catch {
      enqueueSnackbar("Failed to update quiz", { variant: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box
          sx={{
            display: "flex",
            // flexDirection: isSmDown ? "column" : "row",
            justifyContent: "space-between",

            alignItems: "center",
            mb: 3,
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            Quizzes
          </Typography>
          {isTeacher && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
            >
              Add Quiz
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Loading spinner */}
        {isLoading && (
          <Box textAlign="center" my={4}>
            <CircularProgress size="3rem" />
          </Box>
        )}

        {/* Quizzes list */}
        {!isLoading && quizzes.length === 0 && (
          <Typography color="text.secondary">No quizzes found.</Typography>
        )}

        {!isLoading && quizzes.length > 0 && (
          <Stack spacing={3}>
            {quizzes.map((quiz) => (
              <Paper
                key={quiz._id}
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: isSmDown ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isSmDown ? "flex-start" : "center",
                  gap: 2,
                  boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  bgcolor: "grey.50",
                  width: "100%",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.01)",
                    boxShadow: 3,
                  },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {quiz.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {quiz.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  >
                    Date: {new Date(quiz.date).toLocaleDateString()}
                  </Typography>
                </Box>

                {isTeacher && (
                  <Stack direction={{ xs: "row", sm: "row" }} spacing={1} flexWrap="wrap"
                  justifyContent={"start"}
                   >
                    <IconButton
                      color="primary"
                      aria-label="edit quiz"
                      sx={{ ml: 1, mb: { xs: 1, sm: 0 } }}
                      onClick={() => handleEditClick(quiz)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setQuizToDelete(quiz._id);
                        setOpenDeleteDialog(true);
                      }}
                      disabled={isDeleting}
                      sx={{ alignSelf: isSmDown ? "flex-end" : "center" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              </Paper>
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={(_, page) => handlePageChange(page)}
              color="primary"
              disabled={isLoading}
            />
          </Box>
        )}

        {/* Create Quiz Dialog */}
        <Dialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 3, p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Create New Quiz</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isCreating}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isCreating}
              />
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={date ? date.toISOString().split("T")[0] : ""}
                onChange={(e) => setDate(new Date(e.target.value))}
                disabled={isCreating}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setOpenCreateDialog(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateQuiz}
              variant="contained"
              disabled={isCreating}
            >
              {isCreating ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            sx: { borderRadius: 3, p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteQuiz}
              color="error"
              variant="contained"
              disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Quiz Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { borderRadius: 3, p: { xs: 0, sm: 1 } } }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>Edit Quiz</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Title"
                fullWidth
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={isUpdating}
                size="medium"
                inputProps={{ style: { fontSize: 16 } }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                disabled={isUpdating}
                size="medium"
                inputProps={{ style: { fontSize: 16 } }}
              />
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={editDate ? editDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setEditDate(new Date(e.target.value))}
                disabled={isUpdating}
                InputLabelProps={{ shrink: true }}
                size="medium"
                inputProps={{ style: { fontSize: 16 } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
            <Button onClick={() => setOpenEditDialog(false)} disabled={isUpdating} fullWidth={true} sx={{ minWidth: 120 }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuiz} variant="contained" disabled={isUpdating} fullWidth={true} sx={{ minWidth: 120 }}>
              {isUpdating ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
