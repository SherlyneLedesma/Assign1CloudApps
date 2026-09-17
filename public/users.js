const API_URL = '/users';

// Run initial fetch when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();

    // Hook up the refresh button click event using id="refresh"
    const refreshBtn = document.getElementById('refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchUsers);
    }
});

// Handle Form Submission
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const passwdInput = document.getElementById('passwd');
    const emailInput = document.getElementById('email');

    const userData = {
        username: usernameInput.value,
        lastname: lastNameInput.value,
        firstname: firstNameInput.value,
        passwd: passwdInput.value,
        email: emailInput.value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            // Reset all inputs
            lastNameInput.value = '';
            firstNameInput.value = '';
            passwdInput.value = '';
            usernameInput.value = '';
            emailInput.value = '';
            
            fetchUsers(); // Refresh the table setup
        } else {
            const err = await response.json();
            alert(`Error: ${err.error}`);
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
});

// Fetch users from API and update DOM table
async function fetchUsers() {
    // Target the exact case-sensitive ID matching your HTML: UserTableBody
    const tableBody = document.getElementById('UserTableBody');
    const timestampSpan = document.getElementById('timestamp');
    
    try {
        const response = await fetch(API_URL);
        const users = await response.json();

        tableBody.innerHTML = ''; // Clear table entries

        users.forEach(user => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.lastname}</td>
                <td>${user.firstname}</td>
                <td>${user.email}</td>
                <td>${user.username}</td>
                <td>${user.passwd}</td>
            `;

            tableBody.appendChild(row);
        });

        // Update timestamp upon successful fetch with styling matching Bootstrap
        if (timestampSpan) {
            const currentTime = new Date().toLocaleTimeString();
            timestampSpan.className = "text-muted ms-3 align-middle";
            timestampSpan.textContent = `Last updated: ${currentTime}`;
        }

    } catch (error) {
        console.error('Error fetching users:', error);
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error loading users.</td></tr>';
        
        // Update timestamp text to reflect the error
        if (timestampSpan) {
            timestampSpan.className = "text-danger ms-3 align-middle";
            timestampSpan.textContent = 'Error updating list';
        }
    }
}
