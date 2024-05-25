document.addEventListener('DOMContentLoaded', async () => {
    const userSelect = document.getElementById('userId');
    const groupSelect = document.getElementById('groupId');
    const groupSelectAction = document.getElementById('groupIdAction');
    const actionSelect = document.getElementById('actionId');

    // fetch and populate user IDs and names
    const usersResponse = await fetch('/users');
    const users = await usersResponse.json();
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id; 
        option.textContent = user.name;
        userSelect.appendChild(option);
    });

    // fetch and populate group IDs and names
    const groupsResponse = await fetch('/groups');
    const groups = await groupsResponse.json();
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id; 
        option.textContent = group.name;
        groupSelect.appendChild(option);
        groupSelectAction.appendChild(option.cloneNode(true));
    });

    // fetch and populate action IDs and names
    const actionsResponse = await fetch('/actions');
    const actions = await actionsResponse.json();
    actions.forEach(action => {
        const option = document.createElement('option');
        option.value = action.id;
        option.textContent = action.name;
        actionSelect.appendChild(option);
    });

    // user-group association form submission event
    document.getElementById('userGroupForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const userId = userSelect.value;
        const groupId = groupSelect.value;

        const response = await fetch('/user_groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, groupId })
        });

        if (response.ok) {
            alert('User-Group Association created successfully');
        } else {
            alert('Error creating User-Group Association');
        }

        loadAssociations();
    });

    // group-action association form submission event
    document.getElementById('groupActionForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const groupId = groupSelectAction.value;
        const actionId = actionSelect.value;

        const response = await fetch('/group_actions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ groupId, actionId })
        });

        if (response.ok) {
            alert('Group-Action Association created successfully');
        } else {
            alert('Error creating Group-Action Association');
        }
    });


    // user form submission event
    document.getElementById('userForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('User added successfully');
            this.reset();
        } else {
            alert('Error adding user');
        }
    });

    // group form submission event
    document.getElementById('groupForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Group added successfully');
            this.reset();
        } else {
            alert('Error adding group');
        }
    });

    // action form submission event
    document.getElementById('actionForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/actions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Action added successfully');
            this.reset();
        } else {
            alert('Error adding action');
        }
    });
    // load associations and fill table
    async function loadAssociations() {
        const associationsResponse = await fetch('/associations');
        const associations = await associationsResponse.json();
        const tableBody = document.querySelector('#associationsTable tbody');
        tableBody.innerHTML = '';
    
        associations.forEach(association => {
            const row = document.createElement('tr');
            
            const userIdCell = document.createElement('td');
            userIdCell.textContent = association.user_id || '';
            row.appendChild(userIdCell);
            
            const userNameCell = document.createElement('td');
            userNameCell.textContent = association.user_name || '';
            row.appendChild(userNameCell);
            
            const userEmailCell = document.createElement('td');
            userEmailCell.textContent = association.user_email || '';
            row.appendChild(userEmailCell);

            const groupNameCell = document.createElement('td');
            groupNameCell.textContent = association.group_name || '';
            row.appendChild(groupNameCell);
            
            const actionNameCell = document.createElement('td');
            actionNameCell.textContent = association.action_name || '';
            row.appendChild(actionNameCell);
            
            const editCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editAssociation(association));
            editCell.appendChild(editButton);
            row.appendChild(editCell);
            
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.dataset.userId = association.user_id;
            deleteButton.dataset.groupId = association.group_id;
            deleteButton.addEventListener('click', (e) => deleteAssociation(e));
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);
            
            tableBody.appendChild(row);
        });
    }
    

    async function editAssociation(association) {
        alert('Edit functionality not implemented yet');
    }

    async function deleteAssociation(event) {
        const userId = event.target.dataset.userId;
        const groupId = event.target.dataset.groupId;
        
        if (!userId || !groupId) {
            alert('User ID or Group ID is missing');
            return;
        }
    
        const deleteUrl = `/user_groups/${userId}/${groupId}`;
        console.log(`Deleting association: ${deleteUrl}`); 
        
        try {
            const response = await fetch(deleteUrl, { method: 'DELETE' });
            if (response.ok) {
                alert('Association deleted successfully');
    
                // Eliminar la fila completa del HTML
                const row = event.target.closest('tr');
                if (row) {
                    row.remove();
                }
            } else {
                alert('Error deleting association');
            }
        } catch (error) {
            console.error('Error deleting association:', error);
            alert('Error deleting association');
        }
    }
    
    loadAssociations();
});