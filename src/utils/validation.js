const validateProfileEditData = (dataToUpdate) => {
  const editAllowedFields = ["firstName", "lastName", "email", "age"];

  for (const field of Object.keys(dataToUpdate)) {
    if (!editAllowedFields.includes(field)) {
      return false; 
    }
  }

  return true;
};

module.exports = { validateProfileEditData };
