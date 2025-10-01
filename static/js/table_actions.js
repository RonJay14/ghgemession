document.addEventListener("DOMContentLoaded", function () {
    // Handle Update Button Click
    document.addEventListener("click", function (event) {
        const updateButton = event.target.closest(".update-btn");
        if (updateButton) {
            const row = updateButton.closest("tr");
            const tableName = row.closest("table").getAttribute("data-table-name");
            const id = row.getAttribute("data-id");
            const cells = row.querySelectorAll("td");

            // Extract column names and values from the row
            const columnNames = Array.from(cells).map(cell => cell.getAttribute("data-column"));
            const columnValues = Array.from(cells).map(cell => cell.textContent.trim());

            // Populate the modal form with the data
            const modal = document.getElementById("updateModal");
            modal.querySelector("form").setAttribute("data-table-name", tableName);
            modal.querySelector("form").setAttribute("data-id", id);

            // Dynamically generate form fields
            const formFieldsContainer = modal.querySelector("#formFields");
            formFieldsContainer.innerHTML = ""; // Clear existing fields
            columnNames.forEach((columnName, index) => {
                if (columnName) { // Ensure the column name is valid
                    const fieldValue = columnValues[index] || "";

                    const formGroup = document.createElement("div");
                    formGroup.classList.add("form-group", "mb-3");

                    const label = document.createElement("label");
                    label.textContent = columnName.replace(/_/g, " ").toUpperCase(); // Format for readability
                    label.setAttribute("for", `field_${index}`);

                    const input = document.createElement("input");
                    input.type = "text";
                    input.classList.add("form-control");
                    input.name = columnName;
                    input.id = `field_${index}`;
                    input.value = fieldValue;

                    formGroup.appendChild(label);
                    formGroup.appendChild(input);
                    formFieldsContainer.appendChild(formGroup);
                }
            });

            // Show the modal
            modal.style.display = "block";
        }
    });

    // Handle Modal Form Submission for Update
    document.getElementById("updateForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const form = event.target;
        const tableName = form.getAttribute("data-table-name");
        const id = form.getAttribute("data-id");

        // Collect updated values from the form
        const updatedValues = {};
        form.querySelectorAll("input, select, textarea").forEach(input => {
            updatedValues[input.name] = input.value;
        });

        // Debugging: Log the data being sent
        console.log("Sending data to /update_record:", { tableName, id, updatedValues });

        // Send an update request to the server
        fetch(`/update_record`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tableName, id, updatedValues }),
        })
            .then(response => {
                if (response.ok) {
                    alert("Record updated successfully!");
                    location.reload(); // Reload the page to reflect changes
                } else {
                    alert("Failed to update the record.");
                }
            })
            .catch(error => console.error("Error:", error));
    });

    // Handle Delete Button Click
    document.addEventListener("click", function (event) {
        const deleteButton = event.target.closest(".delete-btn");
        if (deleteButton) {
            const row = deleteButton.closest("tr");
            const tableName = row.closest("table").getAttribute("data-table-name");
            const id = row.getAttribute("data-id");

            if (confirm("Are you sure you want to delete this record?")) {
                // Send a delete request to the server
                fetch(`/delete_record`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tableName, id }),
                })
                    .then(response => {
                        if (response.ok) {
                            alert("Record deleted successfully!");
                            row.remove(); // Remove the row from the table
                        } else {
                            alert("Failed to delete the record.");
                        }
                    })
                    .catch(error => console.error("Error:", error));
            }
        }
    });

    // Close Modal
    document.querySelector(".modal .close").addEventListener("click", function () {
        document.getElementById("updateModal").style.display = "none";
    });
});