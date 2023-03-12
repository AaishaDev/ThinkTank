
      onload();
      getAllNotes();
      const dashMain = document.getElementById("dash-main");
      const dashBody = document.getElementById("dash-text-field-container");
      const noteTitle = document.getElementById("note-title");
      const noteContent = document.getElementById("note-content");
      const notesContainer = document.getElementById("all-notes-container");
      const showFavoriteNote = document.getElementById("favorite");
      const showAllNotes = document.getElementById("all");
      const usernameDisplay = document.getElementsByClassName("username");
      const editContainer = document.getElementById("note-edit-container");
      const editTitle = document.getElementById("note-title-edit");
      const editContent = document.getElementById("note-content-edit");
      const notify = document.getElementById("notify");
      let editId;

      const bgColor = [
        "",
        "bg1",
        "bg2",
        "bg3",
        "bg4",
        "",
        "",
        "bg1",
        "bg2",
        "bg3",
        "bg4",
        "",
        "",
        "bg1",
        "bg2",
        "bg3",
        "bg4",
      ];
      let allNotes;

      // Adding note UI
      document.getElementById("add-note").addEventListener("click", () => {
        dashMain.style.display = "none";
        dashBody.style.display = "initial";
        noteContent.value = "";
        noteTitle.value = "";
      });

      // Creating note
      async function createNote(e) {
       
        let token = localStorage.getItem("access_token");

       
        const note = {
          title: noteTitle.value,
          content: noteContent.value,
        };
        if (!note.title || !note.content) {
        
          notify.innerHTML = "Both field required!!";
        notify.style.display = "block";
        setTimeout(() => {
          notify.style.display = "none";
        }, 3000);
          return;
        }
        e.target.innerHTML = `<span class="progress material-symbols-outlined">
  magic_exchange
  </span>`;
        const res = await fetch("http://localhost:5000/notes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(note),
        });
        const data = await res.json();
        

        // For refreshing access token
        if (res.status === 403) {
          const refreshToken = localStorage.getItem("refresh_token");
          const refreshRes = await fetch("http://localhost:5000/refresh", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          const refreshData = await refreshRes.json();
          if (refreshRes.status === 401) {
            

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return;
          }
          localStorage.setItem("access_token", refreshData.accessToken);
          token = localStorage.getItem("access_token");
        

          const res = await fetch("http://localhost:5000/notes", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
          });
          const data = await res.json();
    
        }

        dashMain.style.display = "initial";
        dashBody.style.display = "none";
        e.target.innerHTML='Add'
        getAllNotes();
        notify.innerHTML = "Note Added!";
        notify.style.display = "block";
        setTimeout(() => {
          notify.style.display = "none";
        }, 3000);

      }

      // Mark note favorite
      async function handleFavoriteClicked(id, event) {
        

        let token = localStorage.getItem("access_token");

        if (!id) {
       
          return;
        }

        const res = await fetch(`http://localhost:5000/notes/${id}/favorite`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (event.target.classList.contains("favorite-icon--inactive")) {
          event.target.classList.remove("favorite-icon--inactive");
          event.target.classList.add("favorite-icon--active");
        } else {
          event.target.classList.remove("favorite-icon--active");
          event.target.classList.add("favorite-icon--inactive");
        }
        allNotes = data.notes;
       

        // For refreshing access token
        if (res.status === 403) {
          const refreshToken = localStorage.getItem("refresh_token");
          const refreshRes = await fetch("http://localhost:5000/refresh", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          const refreshData = await refreshRes.json();
          if (refreshRes.status === 401) {
            

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return;
          }
          localStorage.setItem("access_token", refreshData.accessToken);
          token = localStorage.getItem("access_token");
        

          const res = await fetch(
            `http://localhost:5000/notes/${id}/favorite`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          
        }
      }

      // Getting all notes of particular user
      async function getAllNotes() {
        let token = localStorage.getItem("access_token");

        const res = await fetch("http://localhost:5000/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 403) {
          const refreshToken = localStorage.getItem("refresh_token");
          const refreshRes = await fetch("http://localhost:5000/refresh", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          const refreshData = await refreshRes.json();
          if (refreshRes.status === 401) {
          

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return;
          }
          localStorage.setItem("access_token", refreshData.accessToken);
          token = localStorage.getItem("access_token");
         

          const res = await fetch("http://localhost:5000/notes", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { notes } = await res.json();
          
          if(!notes) return
          if (notes.length > 0) {
          
            notesContainer.innerHTML = "";
            notes.map((note, index) => {
              notesContainer.innerHTML += `<div class="note ${
                bgColor.length < index
                  ? bgColor[index]
                  : bgColor[bgColor.length - index]
              }">
              <div>
                <p class="title">${note.title.substring(0, 18)}${
                note.title.length > 18 ? "...." : ""
              }</p>
                <span onclick="handleFavoriteClicked('${
                  note.id
                }', event)" class="material-symbols-outlined t-icon ${
                note.isFavorite
                  ? "favorite-icon--active"
                  : "favorite-icon--inactive"
              }">favorite</span>
              </div>
              <p class="note-content">
                ${note.content.substring(0, 170)} ${
                note.content.length > 225 ? "...." : ""
              } 
              </p>
              <div class="note-overlay">
                <p onclick="handleEditClicked('${note.id}', '${note.title}', '${
                note.content
              }')">Edit</p>
            <p onclick="deleteNote('${note.id}',event)">Delete</p>
          </div>
            </div>
           
            
            `;
            });
          } else {
           
      
          }
          return;
        }

        const { notes } = await res.json();
        allNotes = notes;

    
        if(!notes) return
        // Displaying Notes
        if (notes.length > 0) {
         
          notesContainer.innerHTML = "";
          notes.map((note, index) => {
            notesContainer.innerHTML += `<div class="note ${
              bgColor.length < index
                ? bgColor[index]
                : bgColor[bgColor.length - index]
            }">
              <div>
                <p class="title">${note.title.substring(0, 18)}${
              note.title.length > 18 ? "...." : ""
            }</p>
                <span onclick="handleFavoriteClicked('${
                  note.id
                }', event)" class="material-symbols-outlined t-icon ${
              note.isFavorite
                ? "favorite-icon--active"
                : "favorite-icon--inactive"
            }">favorite</span>
              </div>
              <p class="note-content">
                ${note.content.substring(0, 170)} ${
              note.content.length > 225 ? "...." : ""
            } 
              </p>
              <div class="note-overlay">
                <p onclick="handleEditClicked('${note.id}', '${note.title}', '${
              note.content
            }')">Edit</p>
            <p onclick="deleteNote('${note.id}',event)">Delete</p>
          </div>
            </div>
           
            
            `;
          });
        } else {
         
          notesContainer.innerHTML=''
          notify.innerHTML = "No notes!!";
        notify.style.display = "block";
        setTimeout(() => {
          notify.style.display = "none";
        }, 3000);
        }
      }

      // Show favorite note
      showFavoriteNote.addEventListener("click", () => {
        showFavoriteNote.style.background = "#7695d8";
        showFavoriteNote.style.color = "white";
        showAllNotes.style.background = "white";
        showAllNotes.style.color = "#7695d8";
        notesContainer.innerHTML = "";
        const favoriteNotes = allNotes.filter((note) => note.isFavorite);

        if (favoriteNotes.length > 0) {
          favoriteNotes.map((note, index) => {
            notesContainer.innerHTML += `<div class="note ${
              bgColor.length < index
                ? bgColor[index]
                : bgColor[bgColor.length - index]
            }">
    <div>
      <p class="title">${note.title.substring(0, 18)}${
              note.title.length > 18 ? "...." : ""
            }</p>
      <span onclick="handleFavoriteClicked('${note.id}', event)" class=" ${
              note.isFavorite
                ? "favorite-icon--active"
                : "favorite-icon--inactive"
            } material-symbols-outlined t-icon favorite-icon--inactive">favorite</span>
    </div>
    <p class="note-content">
      ${note.content.substring(0, 170)} ${
              note.content.length > 225 ? "...." : ""
            } 
    </p>
    <div class="note-overlay">
      <p onclick="handleEditClicked('${note.id}', '${note.title}', '${
              note.content
            }')">Edit</p>
            <p onclick="deleteNote('${note.id}',event)">Delete</p>
          </div>
  </div>`;
          });
        } else {
          console.log("No favorite note found");
        }
      });
      // Show all notes
      showAllNotes.addEventListener("click", () => {
        showAllNotes.style.background = "#7695d8";
        showAllNotes.style.color = "white";
        showFavoriteNote.style.background = "white";
        showFavoriteNote.style.color = "#7695d8";

        if (allNotes.length > 0) {
          
          notesContainer.innerHTML = "";
          allNotes.map((note, index) => {
            notesContainer.innerHTML += `<div class="note ${
              bgColor.length < index
                ? bgColor[index]
                : bgColor[bgColor.length - index]
            }">
              <div>
                <p class="title">${note.title.substring(0, 18)}${
              note.title.length > 18 ? "...." : ""
            }</p>
                <span onclick="handleFavoriteClicked('${
                  note.id
                }', event)" class=" ${
              note.isFavorite
                ? "favorite-icon--active"
                : "favorite-icon--inactive"
            } material-symbols-outlined t-icon favorite-icon--inactive">favorite</span>
              </div>
              <p class="note-content">
                ${note.content.substring(0, 170)} ${
              note.content.length > 225 ? "...." : ""
            } 
              </p>
              <div class="note-overlay">
                <p onclick="handleEditClicked('${note.id}', '${note.title}', '${
              note.content
            }')">Edit</p>
            <p onclick="deleteNote('${note.id}', event)">Delete</p>
          </div>
            </div>`;
          });
        } else {
          
          notesContainer.innerHTML=""
          notify.innerHTML = "No notes!!";
        notify.style.display = "block";
        setTimeout(() => {
          notify.style.display = "none";
        }, 3000);
        }
      });

      // Handle Edit Click
      async function handleEditClicked(id, title, content) {
        editContainer.style.display = "block";
        editContent.value = content;
        editTitle.value = title;
        editId = id;
        

        // For note edit
      }
      async function editNote(e) {
     
        e.target.innerHTML = `<span class="progress material-symbols-outlined">
  magic_exchange
  </span>`;
        let token = localStorage.getItem("access_token");

    
        const editedNote = {
          title: editTitle.value,
          content: editContent.value,
        };
        if (!editedNote.title || !editedNote.content) {
        
          e.target.innerHTML = "Done";
          notify.innerHTML = "Both field required";
          notify.style.display = "block";
          setTimeout(() => {
            notify.style.display = "none";
          }, 3000);

          return;
        }

        const res = await fetch(`http://localhost:5000/notes/${editId}/edit`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedNote),
        });
        const data = await res.json();
        

        // For refreshing access token
        if (res.status === 403) {
          const refreshToken = localStorage.getItem("refresh_token");
          const refreshRes = await fetch("http://localhost:5000/refresh", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          const refreshData = await refreshRes.json();
          if (refreshRes.status === 401) {
         

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return;
          }
          localStorage.setItem("access_token", refreshData.accessToken);
          token = localStorage.getItem("access_token");
          

          const res = await fetch(
            `http://localhost:5000/notes/${editId}/edit`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(editedNote),
            }
          );
          const data = await res.json();
         
        }

        getAllNotes();
        editContainer.style.display = "none";
        e.target.innerHTML = "Done";
        notify.innerHTML = "Edit Done!!";
        notify.style.display = "block";
        setTimeout(() => {
          notify.style.display = "none";
        }, 3000);
      }
      // Delete Note
      async function deleteNote(id, e) {
       
        e.target.innerHTML = `<span class="progress material-symbols-outlined">
  magic_exchange
  </span>`;

        let token = localStorage.getItem("access_token");

        const res = await fetch(`http://localhost:5000/notes/${id}/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
       

        // For refreshing access token
        if (res.status === 403) {
          const refreshToken = localStorage.getItem("refresh_token");
          const refreshRes = await fetch("http://localhost:5000/refresh", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          const refreshData = await refreshRes.json();
          if (refreshRes.status === 401) {
           

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return;
          }
          localStorage.setItem("access_token", refreshData.accessToken);
          token = localStorage.getItem("access_token");
        

          const res = await fetch(`http://localhost:5000/notes/${id}/delete`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
         
        }

        notify.innerHTML = "Deleted";
        notify.style.display = "block";
        setTimeout(() => {
          notify.style.display = "none";
        }, 3000);
        e.target.innerHTML = "Delete";
        getAllNotes();
      }
      // Sidebar clicked of favorite
      function sideFavClick() {
        showFavoriteNote.click();
      }
      function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "./index.html";
      }
      async function onload() {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
       
          window.location.href = "./index.html";
          return;
        }
        let token = localStorage.getItem("access_token");

        const res = await fetch(`http://localhost:5000/notes/username`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        usernameDisplay[0].innerHTML = data.username;
        usernameDisplay[1].innerHTML = data.username;
      
      }
  