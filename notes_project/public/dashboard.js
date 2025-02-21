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
async function logout() {
  try {
    const response = await fetch("/logout", {
      method: "GET",
    });

    if (response.ok) {
      window.location.href = "/"; // Redirect to homepage or login page
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("An error occurred during logout:", error);
  }
}
// to delete note 
async function deleteNote(noteId) {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch("/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ noteId })
        });
        if (response.ok) {
          location.reload(); // Reload to reflect changes
        } else {
          alert("Failed to delete the note.");
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
}
  

function searchNotes() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let notes = document.getElementsByClassName("note-card");
  let searchContainer = document.querySelector(".searchnote");
  let noResultsMessage = document.getElementById("noResultsMessage");

  // Remove any existing "No results" message
  if (noResultsMessage) {
      noResultsMessage.remove();
  }

  let found = false;

  for (let i = 0; i < notes.length; i++) {
      let titleElement = notes[i].getElementsByClassName("note-title")[0];
      let contentElement = notes[i].getElementsByClassName("note-content")[0];

      if (titleElement && contentElement) {
          let title = titleElement.innerText.toLowerCase();
          let content = contentElement.innerText.toLowerCase();

          if (title.includes(input) || content.includes(input)) {
              notes[i].click(); // Auto-click the matching note
              found = true;
              break; // Stop after the first match
          }
      }
  }

  // If no match is found, append a message below the search box
  if (!found) {
      let message = document.createElement("p");
      message.id = "noResultsMessage";
      message.innerText = "❌ No matching notes found.";
      message.style.color = "white";
      message.style.marginTop = "10px";
      message.style.background = "rgba(255, 0, 0, 0.2)";
      message.style.padding = "8px";
      message.style.borderRadius = "8px";

      searchContainer.appendChild(message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.querySelector(".searchnote button");

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission or default behavior
      searchButton.click(); // Trigger the search button click
    }
  });
});








  


