import React from "react";
import Button from '@mui/material/Button';

const ReadOnlyRow = ({ contact, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{contact.fullName}</td>
      <td>{contact.address}</td>
      <td>{contact.phoneNumber}</td>
      <td>{contact.email}</td>
      <td>
        <Button
          variant="contained"
          onClick={(event) => handleEditClick(event, contact)}
        >
          Muokkaa
        </Button>
        <Button variant="contained" onClick={() => handleDeleteClick(contact.id)}>
          Poista
        </Button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;

