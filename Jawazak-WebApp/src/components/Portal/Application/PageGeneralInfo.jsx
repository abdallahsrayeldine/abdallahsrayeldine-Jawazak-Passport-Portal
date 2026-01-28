export default function PageGeneralInfo({ form, handleChange, next }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (e.target.reportValidity()) next();
      }}
    >
      <h3>General Information</h3>

      {[
        "first_name",
        "last_name",
        "fathers_name",
        "mothers_name",
        "place_of_birth",
      ].map((field) => (
        <div key={field} style={{ marginBottom: 10 }}>
          <label>
            {field.charAt(0).toUpperCase() +
              field.slice(1).replaceAll("_", " ")}
            <span style={{ color: "red", marginLeft: 6 }}>*</span>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </label>
        </div>
      ))}

      <div style={{ marginBottom: 10 }}>
        <label>
          Date of birth *
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          Gender *
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
      </div>

      <button type="submit">Next</button>
      <button onClick={() => next()} style={{ margin: 10, display: "none" }}>
        TEMP SKIP
      </button>
    </form>
  );
}
