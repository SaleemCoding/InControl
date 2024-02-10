// Arrays for Transactions:
let incomeTransactions = [];
let expenseTransactions = [];

// Add Income Function:
function addIncome() {
  const incomeSourceInput = document.getElementById("income-source");
  const incomeAmountInput = document.getElementById("income-amount");
  const source = incomeSourceInput.value.trim();
  const amount = parseFloat(incomeAmountInput.value);
  const date = new Date().toLocaleDateString();

  if (source === "" || isNaN(amount)) {
    alert("Please enter valid income details");
    return;
  }

  incomeTransactions.push({ source, amount, date });
  updateTotalIncome();
  updateChartWithTotal();
  updateRemainingBalance();
  // Save income transactions to local storage
  localStorage.setItem(
    "incomeTransactions",
    JSON.stringify(incomeTransactions)
  );

  incomeSourceInput.value = "";
  incomeAmountInput.value = "";

  // Toggle visibility of searchBlock based on the number of income transactions
  toggleSearchBlock(incomeTransactions.length > 0);

  // Show all income transactions after adding a new one
  updateIncomeList();
  updatePieCharts(); // Add this line to update pie charts
}

// Update Income List Function:
function updateIncomeList(filteredIncome) {
  const incomeList = document.getElementById("income-list");
  incomeList.innerHTML = "";

  const transactionsToDisplay = filteredIncome || incomeTransactions;

  transactionsToDisplay.forEach((transaction, index) => {
    const listItem = document.createElement("li");
    listItem.className = "transaction";
    listItem.innerHTML = `
            <span class="material-symbols-outlined">check_circle</span>
            <span>${transaction.source}:</span>
            <span>$${transaction.amount.toFixed(2)}</span>
            <span>Date: ${transaction.date}</span>
            <button onclick="editIncome(${index})">Edit</button>
            <button onclick="deleteIncome(${index})">Delete</button>
        `;
    // Save income transactions to local storage
    localStorage.setItem(
      "incomeTransactions",
      JSON.stringify(incomeTransactions)
    );
    incomeList.appendChild(listItem);
  });
}

// Update Total Income Function:
function updateTotalIncome() {
  const totalIncomeElement = document.getElementById("total-income");
  const totalIncome = incomeTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  totalIncomeElement.textContent = totalIncome.toFixed(2);

  // Save total income to local storage
  localStorage.setItem("totalIncome", totalIncome.toFixed(2));
}

// Define the chart variable outside the functions
let incomeExpenseChart;

// Show Total Income and Expenses on Chart:
function updateChartWithTotal() {
  if (typeof Chart !== "undefined") {
    const chartCanvas = document.getElementById("incomeExpenseChart");
    const ctx = chartCanvas.getContext("2d");

    const totalIncome = incomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    const total = totalIncome + totalExpenses;
    const incomePercentage = (totalIncome / total) * 100; // Calculate income percentage

    if (!incomeExpenseChart) {
      incomeExpenseChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Total Income", "Total Expenses"],
          datasets: [
            {
              label: "Income",
              data: [totalIncome, 0],
              backgroundColor: "#36A2EB",
            },
            {
              label: "Expenses",
              data: [0, totalExpenses],
              backgroundColor: "#FF6384",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  var label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += "$" + context.parsed.y.toFixed(2);
                  }
                  const percentage =
                    (context.parsed.y / total) * 100;
                  label += " (" + percentage.toFixed(2) + "% of total)";
                  return label;
                },
              },
            },
          },
        },
      });
    } else {
      incomeExpenseChart.data.labels = ["Total Income", "Total Expenses"];
      incomeExpenseChart.data.datasets[0].data = [totalIncome, 0];
      incomeExpenseChart.data.datasets[1].data = [0, totalExpenses];
      incomeExpenseChart.update();
    }
  } else {
    console.error("Chart.js is not loaded.");
  }
}

// Add Expense Function:
function addExpense() {
  const expenseCategoryInput = document.getElementById("expense-category");
  const expenseAmountInput = document.getElementById("expense-amount");
  const category = expenseCategoryInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const date = new Date().toLocaleDateString();

  if (category === "" || isNaN(amount)) {
    alert("Please enter valid expense details");
    return;
  }

  expenseTransactions.push({ category, amount, date });
  updateTotalExpenses();
  updateChartWithTotal();
  updateRemainingBalance();
  // Save expense transactions to local storage
  localStorage.setItem(
    "expenseTransactions",
    JSON.stringify(expenseTransactions)
  );

  expenseCategoryInput.value = "";
  expenseAmountInput.value = "";

  // Toggle visibility of searchBlocks based on the number of expense transactions
  toggleSearchBlocks(expenseTransactions.length > 0);

  // Show all expense transactions after adding a new one
  updateExpensesList();
  updatePieCharts(); // Add this line to update pie charts
}

// Update Expenses List Function:
function updateExpensesList(filteredExpenses) {
  const expensesList = document.getElementById("expenses-list");
  expensesList.innerHTML = "";

  const transactionsToDisplay = filteredExpenses || expenseTransactions;

  transactionsToDisplay.forEach((transaction, index) => {
    const listItem = document.createElement("li");
    listItem.className = "transaction";
    listItem.innerHTML = `
            <span class="material-symbols-outlined">cancel</span>
            <span>${transaction.category}:</span>
            <span>$${transaction.amount.toFixed(2)}</span>
            <span>Date: ${transaction.date}</span>
            <button onclick="editExpense(${index})">Edit</button>
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
    // Save expense transactions to local storage
    localStorage.setItem(
      "expenseTransactions",
      JSON.stringify(expenseTransactions)
    );
    expensesList.appendChild(listItem);
  });
}

// Update Total Expenses Function:
function updateTotalExpenses() {
  const totalExpensesElement = document.getElementById("total-expenses");
  const totalExpenses = expenseTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  totalExpensesElement.textContent = totalExpenses.toFixed(2);

  // Save total expenses to local storage
  localStorage.setItem("totalExpenses", totalExpenses.toFixed(2));
}

// Update Remaining Balance Function:
function updateRemainingBalance() {
  const remainingBalanceElement = document.getElementById("remaining-balance");
  const totalIncome = incomeTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const totalExpenses = expenseTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const remainingBalance = totalIncome - totalExpenses;

  // Show "good" or "bad" emoji based on the remaining balance
  const emogiContainer = document.getElementById("emogi");
  const goodEmogi = document.getElementById("good");
  const badEmogi = document.getElementById("bad");

  // Determine color based on remaining balance
  let color = "black"; // Default color

  if (remainingBalance > 0) {
    color = "#007bff"; // Positive balance, set color to blue
  } else if (remainingBalance < 0) {
    color = "#FF476F"; // Negative balance, set color to red
  }

  // Apply color to the remaining balance
  remainingBalanceElement.style.color = color;

  // Check if there are transactions
  const hasTransactions =
    incomeTransactions.length > 0 || expenseTransactions.length > 0;

  if (hasTransactions) {
    // Display "good" or "bad" emoji only if there are transactions
    if (remainingBalance > 0) {
      // Display "good" emoji
      goodEmogi.style.display = "block";
      badEmogi.style.display = "none";
    } else if (remainingBalance < 0) {
      // Display "bad" emoji
      goodEmogi.style.display = "none";
      badEmogi.style.display = "block";
    } else {
      // If total expenses equal total income, do not change color and hide emojis
      remainingBalanceElement.style.color = "black"; // Reset color to default
      goodEmogi.style.display = "none";
      badEmogi.style.display = "none";
    }

    // Show the emogi container
    emogiContainer.style.display = "flex";
  } else {
    // Hide emojis and the emogi container if there are no transactions
    goodEmogi.style.display = "none";
    badEmogi.style.display = "none";
    emogiContainer.style.display = "none";
  }
  remainingBalanceElement.textContent = remainingBalance.toFixed(2);
  if (remainingBalance > 0) {
    color = "#007bff"; // Positive balance, set color to blue
    goodEmogi.title = "Everything looks great";
    badEmogi.title = ""; // Clear the title
  } else if (remainingBalance < 0) {
    color = "#FF476F"; // Negative balance, set color to red
    badEmogi.title = "The situation is disturbing";
    goodEmogi.title = ""; // Clear the title
  }
}

// Add an editIncome function to handle editing income data
function editIncome(index) {
  const transaction = incomeTransactions[index];
  const incomeSourceInput = document.getElementById("income-source");
  const incomeAmountInput = document.getElementById("income-amount");

  incomeSourceInput.value = transaction.source;
  incomeAmountInput.value = transaction.amount;

  incomeTransactions.splice(index, 1);

  updateIncomeList();
  updateTotalIncome();
  updateChartWithTotal();
  updateRemainingBalance();
  updatePieCharts();
}

// Add an editExpense function for editing expense data
function editExpense(index) {
  const transaction = expenseTransactions[index];
  const expenseCategoryInput = document.getElementById("expense-category");
  const expenseAmountInput = document.getElementById("expense-amount");

  expenseCategoryInput.value = transaction.category;
  expenseAmountInput.value = transaction.amount;

  expenseTransactions.splice(index, 1);

  updateExpensesList();
  updateTotalExpenses();
  updateChartWithTotal();
  updateRemainingBalance();
  updatePieCharts();
}

// Add a deleteIncome function for deleting income data
function deleteIncome(index) {
  incomeTransactions.splice(index, 1);
  updateIncomeList();
  updateTotalIncome();
  updateChartWithTotal();
  updateRemainingBalance();
  // Save updated income transactions to local storage
  localStorage.setItem(
    "incomeTransactions",
    JSON.stringify(incomeTransactions)
  );
  updatePieCharts();
}

// Add a deleteExpense function for deleting expense data
function deleteExpense(index) {
  expenseTransactions.splice(index, 1);
  updateExpensesList();
  updateTotalExpenses();
  updateChartWithTotal();
  updateRemainingBalance();
  // Save updated expense transactions to local storage
  localStorage.setItem(
    "expenseTransactions",
    JSON.stringify(expenseTransactions)
  );
  updatePieCharts();
}

// Modify the toggleSearchBlock function to ensure it is displayed when search results are shown
function toggleSearchBlock(showSearchBlock) {
  const searchBlock = document.querySelector(".searchBlock");
  searchBlock.style.display = showSearchBlock ? "block" : "none";

  // Save the visibility state to local storage
  localStorage.setItem(
    "searchBlockVisibility",
    showSearchBlock ? "visible" : "hidden"
  );
}
// Modify the toggleSearchBlocks function to ensure it is displayed when search results are shown
function toggleSearchBlocks(showSearchBlocks) {
  const searchBlocks = document.querySelector(".searchBlocks");
  searchBlocks.style.display = showSearchBlocks ? "block" : "none";
  // Save the visibility state to local storage
  localStorage.setItem(
    "searchBlocksVisibility",
    showSearchBlocks ? "visible" : "hidden"
  );
}

function searchData(value, type) {
  const searchValue = value.toLowerCase();
  let filteredTransactions;

  if (type === "income") {
    filteredTransactions = incomeTransactions.filter((transaction) =>
      transaction.source.toLowerCase().includes(searchValue)
    );
    updateIncomeList(filteredTransactions);
    toggleSearchBlock(filteredTransactions.length > 0);
  } else if (type === "expense") {
    filteredTransactions = expenseTransactions.filter((transaction) =>
      transaction.category.toLowerCase().includes(searchValue)
    );
    updateExpensesList(filteredTransactions); // Update the list with filtered transactions
    toggleSearchBlocks(filteredTransactions.length > 0);
  }
}

// Update the getSearchMood function to handle both income and expense searches
function getSearchMood(type) {
  const searchValue =
    type === "income"
      ? document.getElementById("searchIncome").value
      : document.getElementById("searchExpense").value;
  searchData(searchValue, type);
}

function getAdvice() {
  const totalIncome = incomeTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const totalExpenses = expenseTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const balancePercentage = ((totalIncome - totalExpenses) / totalIncome) * 100;

  if (balancePercentage < -50) {
    alert(
      "You're facing a significant financial challenge. Take immediate action to reassess your budget, prioritize essential expenses, and explore options such as debt consolidation or increasing your income through additional work or side hustles. Seeking financial counseling may also be beneficial in this situation."
    );
  } else if (balancePercentage < -20) {
    alert(
      "Reevaluate your spending habits and financial priorities, and consider seeking ways to increase your income or reduce expenses significantly to avoid accumulating debt or depleting savings."
    );
  } else if (balancePercentage < -5) {
    alert(
      "Take proactive steps to adjust your budget, such as cutting unnecessary expenses or exploring additional income streams, to close the gap and improve your financial stability."
    );
  } else if (balancePercentage === 0) {
    alert(
      "Evaluate your budget carefully and consider ways to increase your income or reduce expenses to create a financial cushion and avoid living paycheck to paycheck."
    );
  } else if (balancePercentage <= 5) {
    alert(
      "Be cautious and look for opportunities to increase your income or decrease expenses to avoid slipping further into financial strain."
    );
  } else if (balancePercentage <= 20) {
    alert(
      "Consider tightening your budget and finding areas where you can trim expenses or increase income slightly to achieve a healthier financial buffer."
    );
  } else if (balancePercentage <= 50) {
    alert(
      "Congrats on managing your finances well! Consider allocating the surplus towards savings, investments, or paying off debts faster to secure your financial future."
    );
  } else {
    alert(
      "You're in a strong financial position! Focus on maximizing savings, investing for the long term, and enjoying some well-deserved rewards while maintaining a balanced approach to spending."
    );
  }
}


// Define the Chart instances outside the function
let incomePieChart;
let expensePieChart;

function updatePieCharts() {
  const incomeSources = {};
  const expenseCategories = {};

  // Calculate amounts for each unique source in the income list
  incomeTransactions.forEach((transaction) => {
    const source = transaction.source;
    incomeSources[source] = (incomeSources[source] || 0) + transaction.amount;
  });

  // Calculate amounts for each unique category in the expense list
  expenseTransactions.forEach((transaction) => {
    const category = transaction.category;
    expenseCategories[category] =
      (expenseCategories[category] || 0) + transaction.amount;
  });

  // Prepare data for the income pie chart
  const incomePieData = {
    labels: Object.keys(incomeSources),
    datasets: [
      {
        data: Object.values(incomeSources),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ], // You can customize the colors
      },
    ],
  };

  // Prepare data for the expense pie chart
  const expensePieData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ], // You can customize the colors
      },
    ],
  };

  // Get the canvas elements for the pie charts
  const incomePieCanvas = document.getElementById("source-pie-chart");
  const expensePieCanvas = document.getElementById("expense-pie-chart");

  // Check if Chart.js is loaded
  if (typeof Chart !== "undefined") {
    // Create or update the income pie chart
    if (!incomePieChart) {
      incomePieChart = new Chart(incomePieCanvas, {
        type: "pie",
        data: incomePieData,
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || "";
                  const value =
                    context.parsed || context.parsed === 0
                      ? context.parsed.toFixed(2)
                      : "";
                  const percent =
                    (context.parsed /
                      context.dataset.data.reduce((a, b) => a + b)) *
                    100;
                  return `${label}: $${value} (${percent.toFixed(2)}%)`;
                },
              },
            },
          },
        },
      });
    } else {
      incomePieChart.data = incomePieData;
      incomePieChart.update();
    }

    // Create or update the expense pie chart
    if (!expensePieChart) {
      expensePieChart = new Chart(expensePieCanvas, {
        type: "pie",
        data: expensePieData,
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || "";
                  const value =
                    context.parsed || context.parsed === 0
                      ? context.parsed.toFixed(2)
                      : "";
                  const percent =
                    (context.parsed /
                      context.dataset.data.reduce((a, b) => a + b)) *
                    100;
                  return `${label}: $${value} (${percent.toFixed(2)}%)`;
                },
              },
            },
          },
        },
      });
    } else {
      expensePieChart.data = expensePieData;
      expensePieChart.update();
    }
  } else {
    console.error("Chart.js is not loaded.");
  }
}

function printLists() {
  // Open a new window for printing
  const printWindow = window.open("", "_blank");

  // Write the HTML content to the new window
  printWindow.document.write(
    "<html><head><title>InControl | Print Lists</title></head><body>"
  );
  printWindow.document.write(document.getElementById("lists").innerHTML);
  printWindow.document.write("</body></html>");

  // Close the document and focus on the new window for printing
  printWindow.document.close();
  printWindow.focus();

  // Print the content
  printWindow.print();

  // Close the new window after printing
  printWindow.close();
}

//  window.onload event listener
//  to include the initial updateIncomeList and updateExpensesList calls
window.onload = function () {
  // Load income and expense transactions from local storage
  incomeTransactions =
    JSON.parse(localStorage.getItem("incomeTransactions")) || [];
  expenseTransactions =
    JSON.parse(localStorage.getItem("expenseTransactions")) || [];

  // Load total income and total expenses from local storage
  let totalIncome = parseFloat(localStorage.getItem("totalIncome")) || 0;
  let totalExpenses = parseFloat(localStorage.getItem("totalExpenses")) || 0;

  // Update the total income and total expenses elements on the page
  document.getElementById("total-income").textContent = totalIncome.toFixed(2);
  document.getElementById("total-expenses").textContent =
    totalExpenses.toFixed(2);

  // The Chart.js
  updateChartWithTotal();

  // Initially hide the emogi container
  const emogiContainer = document.getElementById("emogi");
  emogiContainer.style.display = "none";

  // Show all income transactions and expenses on page load
  updateIncomeList();
  updateExpensesList();
  updatePieCharts();

  // Setup search button click event
  // Update the button click event to get the correct search type
  // Add an event listener for the search buttons
  const searchIncomeButton = document.getElementById("searchIncome");
  if (searchIncomeButton) {
    searchIncomeButton.addEventListener("click", function () {
      const searchValue = document.getElementById("searchIncome").value;
      searchData(searchValue, "income");
    });
  }

  // Update the event listener for the search expenses button
  const searchExpenseButton = document.getElementById("searchExpense");
  if (searchExpenseButton) {
    searchExpenseButton.addEventListener("click", function () {
      const searchValue = document.getElementById("searchExpense").value;
      searchData(searchValue, "expense");
    });
  }
  // Update the remaining balance and emoji display
  updateRemainingBalance();

  // Retrieve and apply the visibility state of search blocks from local storage
  const searchBlockVisibility = localStorage.getItem("searchBlockVisibility");
  const searchBlocksVisibility = localStorage.getItem("searchBlocksVisibility");

  if (searchBlockVisibility === "visible") {
    toggleSearchBlock(true);
  }

  if (searchBlocksVisibility === "visible") {
    toggleSearchBlocks(true);
  }
};
