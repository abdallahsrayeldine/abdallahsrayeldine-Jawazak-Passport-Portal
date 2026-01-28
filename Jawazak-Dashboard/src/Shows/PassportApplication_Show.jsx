import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  DateField,
  ImageField,
  useRecordContext,
} from "react-admin";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import ApprovalPanel from "../ApprovalPanel/PassportApplicationApprovalPanel";

const imageHoverStyle = {
  transition: "transform 0.3s ease",
  cursor: "pointer",
  "& img": {
    transition: "transform 0.3s ease",
  },
  "&:hover img": {
    transform: "scale(2)",
  },
};

const bucketMap = {
  document_lebanese_id: "lebanese_id",
  document_civil_status: "civil_status",
  document_passport_photo: "passport_photo",
  document_old_passport: "old_passport",
};

const StoredImageField = ({ source, bucket, sx }) => {
  const record = useRecordContext();
  const value = record?.[source];

  // Inline SVG used as a lightweight default placeholder when no image is provided
  const defaultSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='420' height='220' viewBox='0 0 420 220'>
      <rect width='100%' height='100%' fill='#f3f4f6' />
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial, Helvetica, sans-serif' font-size='18'>No image available</text>
    </svg>
  `;
  const defaultDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(defaultSvg)}`;

  const isFull = value && /^https?:\/\//.test(value);
  const base = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const finalBucket = bucket || bucketMap[source] || "";
  const src = value
    ? isFull
      ? value
      : `${base}/storage/v1/object/public/${finalBucket}/${value}`
    : defaultDataUrl;

  const defaultSx = {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 1,
    "& img": {
      width: "100%",
      height: 220,
      objectFit: value ? "cover" : "contain",
      display: "block",
      borderRadius: 8,
      transition: "transform 0.3s ease, box-shadow 0.2s ease",
      transform: "scale(1)",
      willChange: "transform",
      backfaceVisibility: "hidden",
    },
    "&:hover": {
      zIndex: 1200,
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      "& img": {
        transform: value ? "scale(2)" : "scale(1)",
      },
    },
  };

  return (
    <Box sx={[defaultSx, sx]}>
      <img src={src} alt={value ? source : "no-image"} loading="lazy" />
    </Box>
  );
};

const SectionTitle = ({ children }) => (
  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
    {children}
  </Typography>
);

const PassportApplicationShow = ({ adminData }) => (
  <Show>
    <SimpleShowLayout>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <SectionTitle>Basic</SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Unique User ID
              </Typography>
              <TextField source="unique_user_id" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Full Name
              </Typography>
              <TextField source="full_name" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Application Status
              </Typography>
              <TextField source="application_status" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                3D Liveness Performed
              </Typography>
              <BooleanField source="liveness_3d_performed" />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <SectionTitle>Personal Details</SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                First Name
              </Typography>
              <TextField source="first_name" />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Last Name
              </Typography>
              <TextField source="last_name" />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Parent Names
              </Typography>
              <div>
                <TextField source="fathers_name" />
                <br />
                <TextField source="mothers_name" />
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Place of Birth
              </Typography>
              <TextField source="place_of_birth" />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Date of Birth
              </Typography>
              <DateField source="date_of_birth" />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Gender
              </Typography>
              <TextField source="gender" />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <SectionTitle>Registration & Location</SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Place of Registration
              </Typography>
              <TextField source="place_of_registration" />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Registration Number
              </Typography>
              <TextField source="registration_number" />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Governorate / District
              </Typography>
              <div>
                <TextField source="governorate" />
                <br />
                <TextField source="district" />
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Town / Street
              </Typography>
              <div>
                <TextField source="town" />
                <br />
                <TextField source="street" />
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Mobile Phone
              </Typography>
              <TextField source="phone_mobile" />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <SectionTitle>Documents</SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Lebanese ID
              </Typography>
              <StoredImageField
                source="document_lebanese_id"
                sx={imageHoverStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Civil Status
              </Typography>
              <StoredImageField
                source="document_civil_status"
                sx={imageHoverStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Passport Photo
              </Typography>
              <StoredImageField
                source="document_passport_photo"
                sx={imageHoverStyle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Old Passport
              </Typography>
              <StoredImageField
                source="document_old_passport"
                sx={imageHoverStyle}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <SectionTitle>Metadata</SectionTitle>
          <Grid container spacing={2}>
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

      <ApprovalPanel adminData={adminData} />
    </SimpleShowLayout>
  </Show>
);

export default PassportApplicationShow;
