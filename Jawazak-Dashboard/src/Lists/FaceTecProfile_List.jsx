import {
  BooleanField,
  BooleanInput,
  DataTable,
  DateField,
  DateInput,
  ImageField,
  List,
  NumberInput,
  TextInput,
  TextField,

} from "react-admin";

// -------------------- FILTERS --------------------
const filters = [
  <TextInput source="id" />,
  <TextInput source="auth_user_id" />,
  <TextInput source="full_name" />,
  <TextInput source="enrollment_identifier" />,
  <BooleanInput source="liveness_3d_performed" />,
  <TextInput source="reference_2d_image" />,
  <TextInput source="id_face_crop_image" />,
  <TextInput source="id_document_type" />,
  <TextInput source="id_front_image" />,
  <TextInput source="id_back_image" />,
  <NumberInput source="national_id_number" />,
];

// -------------------- LIST --------------------
const Facetec_profileList = () => (
  <List filters={filters}>
    <DataTable>
      <DataTable.Col source="full_name">
        <TextField source="full_name" />
      </DataTable.Col>

      <DataTable.Col source="liveness_3d_performed">
        <BooleanField source="liveness_3d_performed" />
      </DataTable.Col>

      <DataTable.Col source="reference_2d_image">
        <ImageField source="reference_2d_image" />
      </DataTable.Col>

      <DataTable.Col source="id_face_crop_image">
        <ImageField source="id_face_crop_image" />
      </DataTable.Col>

      <DataTable.Col source="id_document_type">
        <TextField source="id_document_type" />
      </DataTable.Col>

      <DataTable.Col source="id_front_image">
        <ImageField source="id_front_image" />
      </DataTable.Col>

      <DataTable.Col source="id_back_image">
        <ImageField source="id_back_image" />
      </DataTable.Col>

      <DataTable.NumberCol source="national_id_number" />

      <DataTable.Col source="id">
        <TextField source="id" />
      </DataTable.Col>
    </DataTable>
  </List>
);

export default Facetec_profileList;
