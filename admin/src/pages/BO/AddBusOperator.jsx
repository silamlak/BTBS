import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { addBusOperatorFun } from '../../features/busOperator/busOeratorApi';
import { useNavigate } from 'react-router-dom';
const AddBusOperator = () => {
    const navigate = useNavigate()
   const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    position: '',
    department: '',
    hire_date: '',
    salary: '',
    street: '',
    city: '',
    employment_status: '',
    // profile_picture_url: '',
    // id_url: '',
    education: ''
  });

  const [errors, setErrors] = useState({});
    const mutation = useMutation({
      mutationFn: addBusOperatorFun,
      onSuccess: (data) => {
        navigate('/bus-operator')
      }
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
      if (!value && key !== "profile_picture_url" && key !== "education" && key !== "hire_date") {
        errors[key] = `${key.replace('_', ' ')} is required.`;
      }
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
        console.log('object')
      mutation.mutate(formData);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Bus Operator Officer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Fields */}
        {['first_name', 'middle_name', 'last_name', 'email', 'phone', 'password', 'position', 'department', 'salary', 'employment_status'].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 capitalize">{field.replace('_', ' ')}</label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              type={field === 'password' ? 'password' : 'text'}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[field] && <p className="text-red-500">{errors[field]}</p>}
          </div>
        ))}

        {/* Address Fields */}
        <div>
          <label className="block text-gray-700">Street</label>
          <input
            name="street"
            value={formData.street}
            onChange={handleChange}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Profile Picture URL */}
        {/* <div>
          <label className="block text-gray-700">Profile Picture URL</label>
          <input
            name="profile_picture_url"
            value={formData.profile_picture_url}
            onChange={handleChange}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}



        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          {mutation.isLoading ? "Submitting..." : "Submit"}
        </button>

        {/* Success Message */}
        {mutation.isSuccess && <p className="text-green-500 mt-4">Officer added successfully!</p>}
      </form>
    </div>
  )
}

export default AddBusOperator
