import {
  BooleanField,
  BooleanInput,
  DataTable,
  DateField,
  DateInput,
  List,
  NumberInput,
  TextInput,
  TextField,
  useRecordContext,
} from "react-admin";
import { Box } from "@mui/material";

// -------------------- FILTERS --------------------
const filters = [
  <TextInput source="id" />,
  <TextInput source="unique_user_id" />,
  <TextInput source="full_name" />,
  <TextInput source="application_status" />,
  <BooleanInput source="liveness_3d_performed" />,
  <TextInput source="first_name" />,
  <TextInput source="last_name" />,
  <TextInput source="fathers_name" />,
  <TextInput source="mothers_name" />,
  <TextInput source="place_of_birth" />,
  <DateInput source="date_of_birth" />,
  <TextInput source="gender" />,
  <TextInput source="place_of_registration" />,
  <TextInput source="registration_number" />,
  <TextInput source="governorate" />,
  <TextInput source="district" />,
  <TextInput source="town" />,
  <TextInput source="street" />,
  <TextInput source="phone_mobile" />,
  <TextInput source="document_lebanese_id" />,
  <TextInput source="document_civil_status" />,
  <TextInput source="document_passport_photo" />,
  <TextInput source="document_old_passport" />,
  <DateInput source="created_at" />,
  <DateInput source="updated_at" />,
];

const bucketMap = {
  document_lebanese_id: "lebanese_id",
  document_civil_status: "civil_status",
  document_passport_photo: "passport_photo",
  document_old_passport: "old_passport",
};

const StoredImageField = ({ source, bucket, sx }) => {
  const record = useRecordContext();
  const value = record?.[source];

  const defaultSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='160' height='96' viewBox='0 0 160 96'>
      <rect width='100%' height='100%' fill='#f3f4f6' />
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial, Helvetica, sans-serif' font-size='10'>No image</text>
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
    width: 160,
    height: 96,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 1,
    overflow: "hidden",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: value ? "cover" : "contain",
      display: "block",
    },
  };

  return (
    <Box sx={[defaultSx, sx]}>
      <img src={src} alt={value ? source : "no-image"} loading="lazy" />
    </Box>
  );
};

// -------------------- LIST --------------------
const PassportApplicationList = () => (
  <List filters={filters}>
    <DataTable>
      <DataTable.Col source="unique_user_id">
        <TextField source="unique_user_id" />
      </DataTable.Col>

      <DataTable.Col source="full_name">
        <TextField source="full_name" />
      </DataTable.Col>

      <DataTable.Col source="application_status">
        <TextField source="application_status" />
      </DataTable.Col>

      <DataTable.Col source="liveness_3d_performed">
        <BooleanField source="liveness_3d_performed" />
      </DataTable.Col>

      <DataTable.Col source="first_name">
        <TextField source="first_name" />
      </DataTable.Col>

      <DataTable.Col source="last_name">
        <TextField source="last_name" />
      </DataTable.Col>

      <DataTable.Col source="fathers_name">
        <TextField source="fathers_name" />
      </DataTable.Col>

      <DataTable.Col source="mothers_name">
        <TextField source="mothers_name" />
      </DataTable.Col>

      <DataTable.Col source="place_of_birth">
        <TextField source="place_of_birth" />
      </DataTable.Col>

      <DataTable.Col source="date_of_birth">
        <DateField source="date_of_birth" />
      </DataTable.Col>

      <DataTable.Col source="gender">
        <TextField source="gender" />
      </DataTable.Col>

      <DataTable.Col source="place_of_registration">
        <TextField source="place_of_registration" />
      </DataTable.Col>

      <DataTable.Col source="registration_number">
        <TextField source="registration_number" />
      </DataTable.Col>

      <DataTable.Col source="governorate">
        <TextField source="governorate" />
      </DataTable.Col>

      <DataTable.Col source="district">
        <TextField source="district" />
      </DataTable.Col>

      <DataTable.Col source="town">
        <TextField source="town" />
      </DataTable.Col>

      <DataTable.Col source="street">
        <TextField source="street" />
      </DataTable.Col>

      <DataTable.Col source="phone_mobile">
        <TextField source="phone_mobile" />
      </DataTable.Col>

      <DataTable.Col source="document_lebanese_id">
        <StoredImageField source="document_lebanese_id" />
      </DataTable.Col>

      <DataTable.Col source="document_civil_status">
        <StoredImageField source="document_civil_status" />
      </DataTable.Col>

      <DataTable.Col source="document_passport_photo">
        <StoredImageField source="document_passport_photo" />
      </DataTable.Col>

      <DataTable.Col source="document_old_passport">
        <StoredImageField source="document_old_passport" />
      </DataTable.Col>

      <DataTable.Col source="created_at">
        <DateField source="created_at" />
      </DataTable.Col>

      <DataTable.Col source="updated_at">
        <DateField source="updated_at" />
      </DataTable.Col>
    </DataTable>
  </List>
);

export default PassportApplicationList;
