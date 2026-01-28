export default function PageUploadDocuments({
  form,
  handleChange,
  back,
  submit,
}) {
  const docFields = [
    "document_lebanese_id",
    "document_civil_status",
    "document_passport_photo", // required
    "document_old_passport",
  ];

  return (
    <form onSubmit={submit}>
      <h3>Upload Documents</h3>

      {docFields.map((field) => (
        <div key={field} style={{ marginBottom: 10 }}>
          <label>
            {field.replaceAll("_", " ")}
            {field === "document_passport_photo" && (
              <span style={{ color: "red", marginLeft: 6 }}>*</span>
            )}
            :
            <input
              type="file"
              name={field}
              accept="image/*"
              required={field === "document_passport_photo"}
              onChange={handleChange}
            />
          </label>

          {form[field] && (
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Selected: {form[field].name}
            </div>
          )}
        </div>
      ))}

      <button type="button" onClick={back}>
        Back
      </button>
      <button type="submit" style={{ marginLeft: 10 }}>
        Submit
      </button>
    </form>
  );
}

