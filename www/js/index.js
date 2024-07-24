document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("deviceready", onDeviceReady, false);
    document.getElementById('searchBar').addEventListener('input', filterContacts);
    document.getElementById('addContactForm').addEventListener('submit', addContact);
    document.getElementById('editContactForm').addEventListener('submit', editContact);
    document.addEventListener("backbutton", onBackKeyDown, false); // Gestion du bouton de retour
});

let contacts = [];
let filteredContacts = [];

function onDeviceReady() {
    loadPhoneContacts();
}

function loadPhoneContacts() {
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    options.hasPhoneNumber = true;
    var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.emails];
    navigator.contacts.find(fields, onSuccess, onError, options);
}

function onSuccess(foundContacts) {
    contacts = foundContacts; // Save the contacts in a global variable
    contacts.sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""));
    filteredContacts = contacts;
    renderContacts();
}

function onError(contactError) {
    alert('Error: ' + contactError);
}

function renderContacts() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    filteredContacts.forEach((contact, index) => {
        const displayName = contact.displayName || "No Name";
        const phoneNumber = (contact.phoneNumbers && contact.phoneNumbers.length > 0) ? contact.phoneNumbers[0].value : "No Number";

        const li = document.createElement('li');
        li.className = 'contact-item';
        li.innerHTML = `
            <a href="#detailsPage" data-transition="slide" onclick="viewContact(${index})">
                <h2>${displayName}</h2>
                <p>${phoneNumber}</p>
            </a>
            <a href="#editContactPage" data-transition="slide" onclick="loadEditContact(${index})">Modifier</a>
            <button onclick="deleteContact(${index})" class="bg-red-500 text-white p-2 rounded">Supprimer</button>
        `;
        contactList.appendChild(li);
    });
    $('#contactList').listview('refresh');
}

function filterContacts() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    filteredContacts = contacts.filter(contact => {
        const displayName = contact.displayName || "No Name";
        return displayName.toLowerCase().includes(searchTerm);
    });
    renderContacts();
}

function addContact(event) {
    event.preventDefault();
    const newContact = navigator.contacts.create();
    newContact.name = document.getElementById('nom').value;
    newContact.displayName = document.getElementById("prenom").value + " " + document.getElementById('nom').value;
    newContact.phoneNumbers = [{ type: 'mobile', value: document.getElementById('telephone').value }];
    newContact.emails = [{ type: 'home', value: document.getElementById('email').value }];


    // alert(JSON.stringify(newContact))
    // alert(displayName.phoneNumbers)
    // alert(displayName.emails)
    // alert(newContact.displayName)
    newContact.save(onAddSuccess, onAddError);
}

function onAddSuccess(contact) {
    alert('Contact ajouté avec succès!');
    document.getElementById('addContactForm').reset();
    loadPhoneContacts();
    $.mobile.changePage('#homePage');
}

function onAddError(contactError) {
    alert('Error: ' + contactError);
}

function viewContact(index) {
    const contact = filteredContacts[index];
    const detailsName = document.getElementById('detailsName');
    const detailsPhone = document.getElementById('detailsPhone');
    const detailsEmail = document.getElementById('detailsEmail');

    detailsName.textContent = contact.displayName || "No Name";
    detailsPhone.textContent = (contact.phoneNumbers && contact.phoneNumbers.length > 0) ? contact.phoneNumbers[0].value : "No Number";
    detailsEmail.textContent = (contact.emails && contact.emails.length > 0) ? contact.emails[0].value : "No Email";
}

function loadEditContact(index) {
    const contact = filteredContacts[index];
    document.getElementById('editId').value = index;
    document.getElementById('editNom').value = contact.displayName || "";
    document.getElementById('editTelephone').value = (contact.phoneNumbers && contact.phoneNumbers.length > 0) ? contact.phoneNumbers[0].value : "";
    document.getElementById('editEmail').value = (contact.emails && contact.emails.length > 0) ? contact.emails[0].value : "";
}

function editContact(event) {
    event.preventDefault();
    const index = document.getElementById('editId').value;
    const contact = filteredContacts[index];

    contact.displayName = document.getElementById('editNom').value;
    contact.phoneNumbers = [{ type: 'mobile', value: document.getElementById('editTelephone').value }];
    contact.emails = [{ type: 'home', value: document.getElementById('editEmail').value }];

    contact.save(onEditSuccess, onEditError);
}

function onEditSuccess() {
    alert('Contact mis à jour avec succès!');
    loadPhoneContacts();
    $.mobile.changePage('#homePage');
}

function onEditError(contactError) {
    alert('Error: ' + contactError);
}

function deleteContact(index) {
    const contact = filteredContacts[index];
    contact.remove(onDeleteSuccess, onDeleteError);
}

function onDeleteSuccess() {
    alert('Contact supprimé avec succès!');
    loadPhoneContacts();
    $.mobile.changePage('#homePage');
}

function onDeleteError(contactError) {
    alert('Error: ' + contactError);
}

function onBackKeyDown() {
    if ($.mobile.activePage.attr('id') !== 'homePage') {
        $.mobile.changePage('#homePage');
    } else {
        navigator.app.exitApp();
    }
}
