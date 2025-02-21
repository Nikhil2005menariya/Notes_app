// Open Note Modal
function openNoteModal(title, content) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalContent").innerText = content;
    document.getElementById("noteModal").style.display = "flex";
}

// Close Note Modal
function closeNoteModal() {
    document.getElementById("noteModal").style.display = "none";
}

// Open New Note Popup
function createNewNote() {
    document.getElementById("newNotePopup").style.display = "flex";
}

// Close New Note Popup
function closeNewNotePopup() {
    document.getElementById("newNotePopup").style.display = "none";
}
// Save New Note
function saveNote() {
    let title = document.getElementById("noteTitle").value.trim();
    let content = document.getElementById("noteContent").value.trim();

    if (title === "" || content === "") {
        alert("Please enter both title and content for the note.");
        return;
    }

    let newNote = document.createElement("div");
    newNote.classList.add("note-card");
    newNote.innerHTML = `
        <h2 class="note-title">${title}</h2>
        <p class="note-content">Click to view full note...</p>
        <span class="note-date">📅 Due: ${new Date().toLocaleDateString()}</span>
    `;
    newNote.onclick = function () {
        openNoteModal(title, content);
    };

    document.querySelector(".notes").appendChild(newNote);

    // Clear input fields
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";

    // Close popup
    closeNewNotePopup();
}

// Close popup when clicking outside
window.onclick = function (event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
};

// Open Profile Update Form
function openProfileUpdateForm() {
    document.getElementById("profileUpdatePopup").style.display = "flex";
}

// Close Profile Update Form
function closeProfileUpdateForm() {
    document.getElementById("profileUpdatePopup").style.display = "none";
}

// Save Profile Changes
function saveProfile() {
    const newName = document.getElementById("newName").value;
    const newEmail = document.getElementById("newEmail").value;

    if (newName) {
        document.getElementById("profileName").textContent = newName;
    }
    if (newEmail) {
        document.getElementById("profileEmail").textContent = newEmail;
    }

    // Close the popup after saving
    closeProfileUpdateForm();
}

