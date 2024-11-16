import React, { useState, useEffect } from "react";
import axios from "axios";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    jobTitle: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContactId, setEditContactId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        await axios.put(`http://localhost:5000/contacts/${editContactId}`, formData);
        fetchContacts();
        resetForm();
        setSuccessMessage("Contact updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrorMessage("Failed to update contact. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } else {
      try {
        await axios.post("http://localhost:5000/contacts", formData);
        fetchContacts();
        resetForm();
        setSuccessMessage("Contact added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        if (error.response && error.response.data.message === "Phone number already exists") {
          setErrorMessage("This phone number is already in use. Please use a different phone number.");
        } else {
          setErrorMessage("Failed to add contact. Please try again.");
        }
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      company: contact.company,
      jobTitle: contact.jobTitle,
    });
    setIsEditing(true);
    setEditContactId(contact._id);
    setShowForm(true); // Show form when editing
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      company: "",
      jobTitle: "",
    });
    setIsEditing(false);
    setEditContactId(null);
    setShowForm(false); // Hide form after adding or updating
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Contact Management</h1>
      
      {/* Button to Toggle Form */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mb-6"
      >
        {showForm ? "Close Form" : "Add New Contact"}
      </button>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="mb-4 text-green-600 bg-green-100 p-3 rounded-lg border border-green-400">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg border border-red-400">
          {errorMessage}
        </div>
      )}

      {/* Contact Form - Visible only if showForm is true */}
      {showForm && (
        <form onSubmit={handleAddOrUpdate} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Contact" : "Add New Contact"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              className="border rounded-lg p-2"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="border rounded-lg p-2"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <input
              name="email"
              placeholder="Email"
              className="border rounded-lg p-2"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              className="border rounded-lg p-2"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
            <input
              name="company"
              placeholder="Company"
              className="border rounded-lg p-2 col-span-2"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <input
              name="jobTitle"
              placeholder="Job Title"
              className="border rounded-lg p-2 col-span-2"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />
          </div>
          <button className={`w-full mt-4 py-2 rounded-lg ${isEditing ? "bg-blue-500" : "bg-green-500"} text-white font-bold`}>
            {isEditing ? "Update Contact" : "Add Contact"}
          </button>
        </form>
      )}

      {/* Contacts Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone Number</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Job Title</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id} className="border-b">
              <td className="px-6 py-4 whitespace-nowrap">{contact.firstName} {contact.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.phoneNumber}</td>
              <td className="px-6 py-4 max-w-xs whitespace-normal break-words">{contact.company}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.jobTitle}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600"
                  onClick={() => handleEdit(contact)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  //  yha galti hmesha hoti hai id and _id me show please keep in mind always 
                  onClick={() => handleDelete(contact._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Contacts;







