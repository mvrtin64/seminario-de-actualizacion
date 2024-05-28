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

    // edit form submission event 
    document.getElementById('editForm').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const userId = this.getAttribute('data-user-id');
        const groupId = this.getAttribute('data-group-id');
    
        const updatedData = {
            userName: document.getElementById('editUserName').value,
            userEmail: document.getElementById('editUserEmail').value,
            groupName: document.getElementById('editGroupName').value,
        };
    
        try {
            const response = await fetch(`/associations/${userId}/${groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
    
            if (response.ok) {
                alert('Association updated successfully');
                closeEditModal();
                loadAssociations(); 
            } else {
                alert('Error updating association');
            }
        } catch (error) {
            console.error('Error updating association:', error);
            alert('Error updating association');
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
            editButton.setAttribute('data-user-id', association.user_id);
            editButton.setAttribute('data-user-name', association.user_name);
            editButton.setAttribute('data-user-email', association.user_email);
            editButton.setAttribute('data-group-id', association.group_id);
            editButton.setAttribute('data-group-name', association.group_name);
            editButton.addEventListener('click', openEditModal);
            editCell.appendChild(editButton);
            row.appendChild(editCell);
            
            
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('data-user-id', association.user_id);
            deleteButton.setAttribute('data-group-id', association.group_id);
            deleteButton.addEventListener('click', (e) => deleteAssociation(e));
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);
            
            tableBody.appendChild(row);
        });
    }
    
    function openEditModal(event) {
        const userId = event.target.getAttribute('data-user-id');
        const userName = event.target.getAttribute('data-user-name');
        const userEmail = event.target.getAttribute('data-user-email');
        const groupId = event.target.getAttribute('data-group-id');
        const groupName = event.target.getAttribute('data-group-name');

    
        document.getElementById('editUserName').value = userName;
        document.getElementById('editUserEmail').value = userEmail;
        document.getElementById('editGroupName').value = groupName;
    
        document.getElementById('editForm').setAttribute('data-user-id', userId);
        document.getElementById('editForm').setAttribute('data-group-id', groupId);
    
        document.getElementById('editModal').style.display = 'block';
    
        loadGroupOptions(groupId);
    }
    
    function closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
    }
    
    async function loadGroupOptions(selectedGroupId) {
        try {
            const response = await fetch('/groups');
            const groups = await response.json();

            const groupSelect = document.getElementById('editGroupName');
            groupSelect.innerHTML = '';

            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.name;
                option.textContent = group.name;
                if (group.id == selectedGroupId) {
                    option.selected = true;
                }
                groupSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading groups:', error);
        }
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