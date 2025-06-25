// Updated script.js to distribute salary using weighted allocation

const form = document.getElementById("finance-form");
const resultDiv = document.getElementById("result");
const kidsInput = document.getElementById("kids");
const emiSelect = document.getElementById("emi");
const childrenSelect = document.getElementById("children");
const houseSelect = document.getElementById("house");

childrenSelect.onchange = () => {
  kidsInput.style.display = childrenSelect.value === "yes" ? "block" : "none";
};

houseSelect.onchange = () => {
  emiSelect.style.display = houseSelect.value === "own" ? "block" : "none";
};

form.onsubmit = (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const salary = parseFloat(document.getElementById("salary").value);
  const members = parseInt(document.getElementById("members").value);
  const kids = childrenSelect.value === "yes" ? parseInt(kidsInput.value || 0) : 0;

  const house = houseSelect.value;
  const emi = emiSelect.value;
  const vehicle = document.getElementById("vehicle").value;
  const insurance = document.getElementById("insurance").value;

  // Define weights (importance) for each category
  const weights = {};

  if (house === "rent") {
    weights["Rent"] = 30;
  } else if (emi === "yes") {
    weights["EMI"] = 25;
  } else {
    weights["Maintenance"] = 8;
  }

  weights["Utilities"] = 5;
  weights["Transportation"] = vehicle === "public" ? 8 : 5;
  weights["Food & Groceries"] = 10 + (members - 1) * 2;
  weights["Internet & Subscriptions"] = 2;
  if (insurance === "yes") weights["Insurance"] = 6;
  weights["Emergency Fund"] = 12;
  weights["Miscellaneous"] = 5;
  if (kids > 0) weights["Child Expenses"] = kids * 3;
  weights["Savings & Investment"] = 15;

  // Calculate total weight
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  // Allocate amounts
  const breakdown = {};
  for (let key in weights) {
    breakdown[key] = Math.round((weights[key] / totalWeight) * salary);
  }

  // Final total
  breakdown["TOTAL"] = salary;

  let html = `
    <h2>${name}'s Monthly Budget</h2>
    <p>Your personalized monthly budget breakdown</p>
    <div class="result-grid">
  `;

  for (let key in breakdown) {
    const amount = breakdown[key];
    const percent = key !== "TOTAL" ? ((amount / salary) * 100).toFixed(1) : "";

    html += `
      <div class="result-card">
        <h4>${key}</h4>
        <p>₹${amount.toLocaleString()}</p>
        <span>${key !== "TOTAL" ? `${percent}% of income` : ""}</span>
      </div>
    `;
  }

  html += `</div>
    <div class="buttons">
      <button class="pdf-btn" onclick='downloadPDF("${name}", ${JSON.stringify(
        breakdown
      ).replace(/"/g, "&quot;")})'>📄 Download as PDF</button>
      <a href="#dashboard" class="new-btn">🔄 Create New Plan</a>
    </div>
  `;

  resultDiv.innerHTML = html;
  resultDiv.style.display = "block";
};

function downloadPDF(name, breakdown) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`${name}'s Monthly Budget`, 10, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  let y = 30;
  for (let key in breakdown) {
    doc.text(`${key}: ₹${Math.round(breakdown[key])}`, 10, y);
    y += 10;
  }

  doc.save(`${name}_budget.pdf`);
}
function downloadPDF(name, breakdown) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`${name}'s Monthly Budget`, 10, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  let y = 30;
  for (let key in breakdown) {
    doc.text(`${key}: ₹${Math.round(breakdown[key])}`, 10, y);
    y += 10;
  }

  doc.save(`${name}_budget.pdf`);
}
