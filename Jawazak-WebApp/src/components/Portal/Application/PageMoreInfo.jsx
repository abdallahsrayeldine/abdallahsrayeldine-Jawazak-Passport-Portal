export default function PageMoreInfo({ form, handleChange, next, back }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (e.target.reportValidity()) next();
      }}
    >
      <h3>More Information</h3>

      {[
        "place_of_registration",
        "registration_number",
        "governorate",
        "district",
        "town",
        "street",
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

      {/* phone_mobile is required */}
      <div style={{ marginBottom: 10 }}>
        <label>
          Phone mobile <span style={{ color: "red", marginLeft: 6 }}>*</span>
          <input
            type="tel"
            name="phone_mobile"
            value={form.phone_mobile}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      {/* phone_home is optional */}
      <div style={{ marginBottom: 10 }}>
        <label>
          Phone home
          <input
            type="tel"
            name="phone_home"
            value={form.phone_home}
            onChange={handleChange}
          />
        </label>
      </div>

      <button type="button" onClick={back}>
        Back
      </button>
      <button type="submit" style={{ marginLeft: 10 }}>
        Next
      </button>
      <button onClick={() => next()} style={{margin: 10, display: "none"}}>TEMP SKIP</button>
    </form>
  );
}
