const API_URL = "https://portfolio-backend-98qw.onrender.com/api/contact";   // change to the Render URL after deployment

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("status");
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed");
    status.textContent = "Thank you! Your message has been sent.";
    e.target.reset();
  } catch (err) {
    status.style.color = "#c0392b";
    status.textContent = "Something went wrong. Please try again.";
  }
});
