const form = document.getElementById('signupForm');

form.addEventListener('submit', async e => {
  e.preventDefault();
  
  // Create a new FormData object
  const formData = new FormData(form);

  try {
    // Use fetch to send the FormData object directly
    const response = await fetch('/api/sessions/signup', {
      method: 'POST',
      body: formData
    });

    if (response.status === 200) {
      window.location.replace('/profile');
    } else {
      // Handle other response statuses here
      console.error('Error during signup:', response.statusText);
    }
  } catch (error) {
    console.error('Error during signup:', error);
  }
});
