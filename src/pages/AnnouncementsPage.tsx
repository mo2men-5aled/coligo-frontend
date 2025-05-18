import { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Container,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useAppDispatch } from "../store/hooks";
import {
  createAnnouncementThunk,
  deleteAnnouncementThunk,
  fetchAnnouncementsThunk,
  updateAnnouncementThunk,
} from "../store/slices/announcementSlice";
import { useSnackbar } from "notistack";
import type { Announcement } from "../types/announcementType";

export default function AnnouncementsPage() {
  const { announcements, isLoading, meta, handlePageChange, isTeacher } =
    useAnnouncements();

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // State for create announcement dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<
    string | null
  >(null);

  // State for edit announcement dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editAnnouncementId, setEditAnnouncementId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle create announcement
  const handleCreateAnnouncement = async () => {
    if (!title || !content) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }

    try {
      await dispatch(createAnnouncementThunk({ title, content })).unwrap();
      enqueueSnackbar("Announcement created successfully", {
        variant: "success",
      });
      setOpenCreateDialog(false);
      setTitle("");
      setContent("");
      // Refresh announcements
      dispatch(fetchAnnouncementsThunk({ page: meta.page }));
    } catch (error) {
      console.error("Failed to create announcement:", error);
      enqueueSnackbar("Failed to create announcement", { variant: "error" });
    }
  };

  // Handle delete announcement
  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;

    try {
      await dispatch(deleteAnnouncementThunk(announcementToDelete)).unwrap();
      enqueueSnackbar("Announcement deleted successfully", {
        variant: "success",
      });
      setOpenDeleteDialog(false);
      setAnnouncementToDelete(null);
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      enqueueSnackbar("Failed to delete announcement", { variant: "error" });
    }
  };

  // Open delete confirmation dialog
  const confirmDelete = (id: string) => {
    setAnnouncementToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = (announcement: Announcement) => {
    setEditAnnouncementId(announcement._id);
    setEditTitle(announcement.title);
    setEditContent(announcement.content);
    setOpenEditDialog(true);
  };

  const handleUpdateAnnouncement = async () => {
    if (!editAnnouncementId || !editTitle || !editContent) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }
    setIsUpdating(true);
    try {
      await dispatch(updateAnnouncementThunk({ id: editAnnouncementId, title: editTitle, content: editContent })).unwrap();
      enqueueSnackbar("Announcement updated successfully", { variant: "success" });
      setOpenEditDialog(false);
      setEditAnnouncementId(null);
      setEditTitle("");
      setEditContent("");
    } catch {
      enqueueSnackbar("Failed to update announcement", { variant: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  console.log(announcements)
  if (isLoading && announcements.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress size="4rem" />
      </Box>
    );
  }

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
          component="header"
          sx={{
            display: "flex",
            flexDirection: { xs: "row", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 3,
            gap: 2,
          }}
        >
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, fontSize: { xs: "2rem", sm: "2.2rem" } }}>
            Announcements
          </Typography>

          {isTeacher && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{ minWidth: 200 }}
            >
              New Announcement
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Stack component="section" spacing={3}>
          {announcements?.map((announcement: Announcement) => (
            <Paper
              key={announcement._id}
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                border: "1px solid rgba(0, 0, 0, 0.08)",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
                bgcolor: "grey.50",
                boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)",
                width: "100%",
                "&:hover": {
                  transform: "translateY(-2px) scale(1.01)",
                  boxShadow: 3,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  gap: 2,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  fontWeight={600}
                  sx={{ flex: 1, wordBreak: "break-word", pr: 2 }}
                >
                  {announcement.title}
                </Typography>
                {isTeacher && (
                  <Stack direction={{ xs: "row", sm: "row" }} spacing={1} flexWrap="wrap">
                    <IconButton
                      aria-label="edit announcement"
                      color="primary"
                      sx={{ ml: 1, mb: { xs: 1, sm: 0 } }}
                      onClick={() => handleEditClick(announcement)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete announcement"
                      color="error"
                      sx={{
                        ml: 1,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "error.light",
                          color: "white",
                        },
                      }}
                      onClick={() => confirmDelete(announcement._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              </Box>
              <Typography sx={{ mb: 2 }} color="text.secondary">
                {announcement.content}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Posted: {new Date(announcement.postedAt).toLocaleDateString()}
              </Typography>
            </Paper>
          ))}

          {announcements?.length === 0 && (
            <Typography color="text.secondary">No announcements found.</Typography>
          )}
        </Stack>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              disabled={meta.page === 1}
              onClick={() => handlePageChange(meta.page - 1)}
            >
              Previous
            </Button>
            <Typography>
              {meta.page} of {meta.totalPages}
            </Typography>
            <Button
              variant="outlined"
              disabled={meta.page === meta.totalPages}
              onClick={() => handlePageChange(meta.page + 1)}
            >
              Next
            </Button>
          </Box>
        )}

        {/* Create Announcement Dialog */}
        <Dialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Create New Announcement</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
            <Button
              onClick={handleCreateAnnouncement}
              variant="contained"
              color="primary"
            >
              Create
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
              Are you sure you want to delete this announcement?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteAnnouncement} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Announcement Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, p: { xs: 0, sm: 1 } } }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>Edit Announcement</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                fullWidth
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                disabled={isUpdating}
                size="medium"
                inputProps={{ style: { fontSize: 16 } }}
              />
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={4}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
                disabled={isUpdating}
                size="medium"
                inputProps={{ style: { fontSize: 16 } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
            <Button onClick={() => setOpenEditDialog(false)} disabled={isUpdating} fullWidth={true} sx={{ minWidth: 120 }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAnnouncement} variant="contained" color="primary" disabled={isUpdating} fullWidth={true} sx={{ minWidth: 120 }}>
              {isUpdating ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
