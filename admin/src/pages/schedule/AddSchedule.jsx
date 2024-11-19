import React from 'react'

const AddSchedule = () => {
const navigate = useNavigate();
const [formData, setFormData] = useState({
  name: "",
  location: "",
  contact_number: "",
  //  year_of_manufacture: "",
  //  model: "",
  //  make: "",
  //  license_plate: "",
  //  bus_id: "",
});

const [errors, setErrors] = useState({});
const mutation = useMutation({
  mutationFn: addStationFun,
  onSuccess: (data) => {
    navigate("/station");
    console.log(data.msg);
  },
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const validate = () => {
  const errors = {};
  for (const [key, value] of Object.entries(formData)) {
    if (!value) {
      errors[key] = `${key.replace("_", " ")} is required.`;
    }
  }
  setErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validate()) {
    mutation.mutate(formData);
  }
};

return (
  <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Add Bus</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input Fields */}
      {[
        "name",
        "location",
        "contact_number",
        //  "year_of_manufacture",
        //  "model",
        //  "make",
        //  "license_plate",
        //  "bus_id",
      ].map((field) => (
        <div key={field}>
          <label className="block text-gray-700 capitalize">
            {field.replace("_", " ")}
          </label>
          <input
            name={field}
            value={formData[field]}
            onChange={handleChange}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors[field] && <p className="text-red-500">{errors[field]}</p>}
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        {mutation.isLoading ? "Submitting..." : "Submit"}
      </button>

      {/* Success Message */}
      {mutation.isSuccess && (
        <p className="text-green-500 mt-4">Bus added successfully!</p>
      )}
    </form>
  </div>
);
}

export default AddSchedule
