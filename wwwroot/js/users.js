let currentPage = 1;
let pageSize = 5;
let searchQuery = '';

function loadUsers() {
    fetch(`/Main/GetUsers?page=${currentPage}&pageSize=${pageSize}&searchQuery=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            renderUsers(data.items);
            updatePagination(data);
        });
}

function renderUsers(users) {
    const tbody = document.querySelector('.users-table tbody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td><img src="images/Default_pfp.svg.png" alt="" width="30px" class="mx-2">${user.firstname} ${user.lastname}</td>
                <td>${user.email}</td>
                <td>${user.phonenumber}</td>
                <td>${user.role}</td>
                <td><span class="status-${user.status ? 'active' : 'inactive'}">${user.status ? 'active' : 'inactive'}</span></td>
                <td>
                    <i class="material-icons" onclick="editUser(${user.userid})">edit</i>
                    <i class="material-icons" data-bs-toggle="modal" data-bs-target="#confirmmodal" onclick="setDeleteUserId(${user.userid})">delete</i>
                </td>
            </tr>
        `;
    });
}

function updatePagination(data) {
    const paginationInfo = document.querySelector('.pagination-container .text-muted');
    paginationInfo.textContent = `Showing ${(data.pageNumber - 1) * data.pageSize + 1} - ${Math.min(data.pageNumber * data.pageSize, data.totalItems)} of ${data.totalItems}`;
    
    const prevButton = document.querySelector('.pagination .page-item:first-child');
    const nextButton = document.querySelector('.pagination .page-item:last-child');
    
    prevButton.classList.toggle('disabled', data.pageNumber === 1);
    nextButton.classList.toggle('disabled', data.pageNumber === data.totalPages);
}

document.querySelector('.form-select').addEventListener('change', (e) => {
    pageSize = parseInt(e.target.value);
    currentPage = 1;
    loadUsers();
});

document.querySelector('.search-textbox').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 1;
    loadUsers();
});

document.querySelector('.pagination').addEventListener('click', (e) => {
    if (e.target.closest('.page-link')) {
        e.preventDefault();
        const isNext = e.target.closest('.page-item:last-child');
        const isPrev = e.target.closest('.page-item:first-child');
        
        if (isNext) currentPage++;
        if (isPrev) currentPage--;
        
        loadUsers();
    }
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});
