import { useRecordContext, useNotify } from "react-admin";
import {
  Card,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField as MuiTextField,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const rejectionReasons = [
  "Image too blurry",
  "Document unreadable",
  "Face mismatch",
  "Fake/invalid ID",
  "Incomplete data",
];

const FaceTecProfileApprovalPanel = ({ adminData }) => {
  const record = useRecordContext();
  const notify = useNotify();
  const navigate = useNavigate();

  const [selectedReasons, setSelectedReasons] = useState([]);
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async (adminData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch(import.meta.env.VITE_EDGE_FUNCTION_APPROVE_REJECT_NEW_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,
        },
        body: JSON.stringify({
          unique_user_id: record.id,
          action: "approve",
          action_by_id: adminData?.id || "unknown",
          action_by_email: adminData?.email || "unknown",
        }),
      });

      navigate("/verified_signed_up_new_user_view");
      notify("Profile approved", { type: "success", undoable: true });
    } catch (err) {
      setIsSubmitting(false);
      notify("Approval failed", { type: "error" });
    }
  };

  const handleReject = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const reason =
      (customReason ? "Admin message " + customReason + "; " : "") +
      (selectedReasons && selectedReasons.length
        ? selectedReasons.join("; ")
        : "");

    if (!reason) {
      notify("Please choose or write a reason", { type: "warning" });
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch(import.meta.env.VITE_EDGE_FUNCTION_APPROVE_REJECT_NEW_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,
        },
        body: JSON.stringify({
          unique_user_id: record.id,
          action: "reject",
          reason: reason,
          action_by_id: adminData?.id || "unknown",
          action_by_email: adminData?.email || "unknown",
        }),
      });

      navigate("/rejected_signed_up_new_user_view");
      notify("Profile rejected", { type: "error", undoable: true });
    } catch (err) {
      setIsSubmitting(false);
      notify("Rejection failed", { type: "error" });
    }
  };

  return (
    <Card sx={{ p: 3, mt: 4, borderRadius: 3, boxShadow: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Verification Actions
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Choose a reason for rejection or write a custom message.
      </Typography>

      <FormGroup>
        {rejectionReasons.map((reason) => (
          <FormControlLabel
            key={reason}
            control={
              <Checkbox
                checked={selectedReasons.includes(reason)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSelectedReasons((prev) =>
                    checked
                      ? [...prev, reason]
                      : prev.filter((r) => r !== reason),
                  );
                }}
              />
            }
            label={reason}
          />
        ))}
      </FormGroup>

      <MuiTextField
        label="Custom Explanation (optional)"
        multiline
        minRows={3}
        fullWidth
        sx={{ mt: 2 }}
        value={customReason}
        onChange={(e) => setCustomReason(e.target.value)}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleReject}
          disabled={isSubmitting}
          sx={{ flex: 1 }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              Rejecting...
            </>
          ) : (
            "Reject"
          )}
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={() => handleApprove(adminData)}
          disabled={isSubmitting}
          sx={{ flex: 1 }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            "Approve"
          )}
        </Button>
      </Stack>
    </Card>
  );
};

export default FaceTecProfileApprovalPanel;
