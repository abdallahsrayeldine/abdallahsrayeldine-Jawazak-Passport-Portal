import {
  Show,
  SimpleShowLayout,
  TextField,
  FunctionField,
  BooleanField,
  DateField,
  ReferenceField,
  ImageField,
  useRecordContext,
} from "react-admin";
import { Card, CardContent, Grid, Typography, Divider } from "@mui/material";
import ApprovalPanel from "../ApprovalPanel/FaceTecProfileApprovalPanel";

const imageHoverStyle = {
  transition: "transform 0.3s ease",
  cursor: "pointer",
  "& img": {
    transition: "transform 0.3s ease",
  },
  "&:hover img": {
    transform: "scale(4)",
  },
};

const SectionTitle = ({ children }) => (
  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
    {children}
  </Typography>
);

const FaceTecProfileShow = ({ adminData }) => (
  <Show>
    <SimpleShowLayout>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          {/* === BASIC INFO === */}
          <SectionTitle>Basic Information</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Profile
              </Typography>
              <ReferenceField source="profile_id" reference="profiles" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Full Name
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Enrollment ID
              </Typography>
              <TextField source="enrollment_identifier" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                3D Liveness Check
              </Typography>
              <BooleanField source="liveness_3d_performed" />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* === DOCUMENT DETAILS === */}
          <SectionTitle>Document Details</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Document Type
              </Typography>
              <TextField source="id_document_type" />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Civil ID Number
              </Typography>
              <TextField source="civil_status_id_number" />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* === IMAGES === */}
          <SectionTitle>Images</SectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Reference 2D Image
              </Typography>
              <ImageField source="reference_2d_image" sx={imageHoverStyle} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Face Crop Image
              </Typography>
              <ImageField source="id_face_crop_image" sx={imageHoverStyle} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                ID Front
              </Typography>
              <ImageField source="id_front_image" sx={imageHoverStyle} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                ID Back
              </Typography>
              <ImageField source="id_back_image" sx={imageHoverStyle} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* === METADATA === */}
          <SectionTitle>Metadata</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Created At
              </Typography>
              <DateField source="created_at" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Updated At
              </Typography>
              <DateField source="updated_at" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ACTION PANEL */}
      <ApprovalPanel adminData={adminData} />
    </SimpleShowLayout>
  </Show>
);

export default FaceTecProfileShow;