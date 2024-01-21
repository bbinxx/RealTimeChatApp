function addData() {
  const data = document.getElementById('data').value;

  // Validate data (optional, but recommended)
  // ...

  fetch('/addData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  })
  .then(() => {
    // Handle successful data addition
    alert('Data added successfully!');
  })
  .catch(error => {
    console.error(error);
    alert('Failed to add data!');
  });
}