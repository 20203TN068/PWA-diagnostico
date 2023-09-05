const resp = fetch('https://reqres.in/api/users?page=1');
let lastId = 0;

resp.then(response => response.json())
.then((json)=>{
    let content = document.getElementById('container').getElementsByTagName('tbody')[0];
    let htmlX = '';
    json.data.forEach(element =>{
        let htmlRow = `<tr id="row_${element.id}">
                            <td>${element.id}</td>
                            <td>${element.first_name}</td>
                            <td>${element.last_name}</td>
                            <td>${element.email}</td>
                            <td>
                                <a href="#" class="btn btn-primary" onclick="showModal(${element.id})">Detalles</a>
                                <a href="#" class="btn btn-warning" onclick="editUser(${element.id})">Editar</a>
                                <a href="#" class="btn btn-danger" onclick="deleteUser(${element.id})">Eliminar</a>
                            </td>
                       </tr>`;
        htmlX += htmlRow;
    });
    content.innerHTML = htmlX;

    lastId = Math.max(...json.data.map(e => e.id));

});


function showModal(id) {
    const myModal = new bootstrap.Modal(document.getElementById("showUser"), {});
    let content = document.getElementById("Modalbody");
    fetch(`https://reqres.in/api/users/${id}`)
        .then(response => {
            return response.json();
        })
        .then(json => {
            let htmlmodal = `<div class="modal-body">
                                <img src="${json.data.avatar}">
                                <p>${json.data.id}</p>
                                <p>Nombre: ${json.data.first_name}</p>
                                <p>Apellido: ${json.data.last_name}</p>
                                <p>E-mail: ${json.data.email}</p>
                             </div>`;
            content.innerHTML = htmlmodal;
            myModal.show();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById("addButton").addEventListener("click", function() {
  const myModal = new bootstrap.Modal(document.getElementById("addUserModal"), {});
  myModal.show();
});


function createUser() {
  lastId++; 

  let data = {
      first_name: document.getElementById("first_name").value || "vacío",
      last_name: document.getElementById("last_name").value || "vacío",
      email: document.getElementById("email").value || "vacío"
  };

  fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(json => {
      let content = document.getElementById('container').getElementsByTagName('tbody')[0];
      let newRow = `<tr>
                      <td>${lastId}</td>
                      <td>${data.first_name}</td>
                      <td>${data.last_name}</td>
                      <td>${data.email}</td>
                      <td>
                          <a href="#" class="btn btn-primary" onclick="showModal(${lastId})">Detalles</a>
                          <a href="#" class="btn btn-warning">Editar</a>
                          <a href="#" class="btn btn-danger">Eliminar</a>
                      </td>
                    </tr>`;
      content.innerHTML += newRow;

      myModal.hide();
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function editUser(id) {
  const editUserModal = new bootstrap.Modal(document.getElementById("editUserModal"), {});

  fetch(`https://reqres.in/api/users/${id}`)
  .then(response => response.json())
  .then(json => {
    document.getElementById("edit_first_name").value = json.data.first_name;
    document.getElementById("edit_last_name").value = json.data.last_name;
    document.getElementById("edit_email").value = json.data.email;
    
    editUserModal.show();
  });
}

function saveChanges(id) {
  let data = {
    first_name: document.getElementById("edit_first_name").value,
    last_name: document.getElementById("edit_last_name").value,
    email: document.getElementById("edit_email").value
  };

  fetch(`https://reqres.in/api/users/${id}`, {
    method: "PUT",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(json => {
    document.getElementById("first_name_" + id).innerText = json.first_name;
    document.getElementById("last_name_" + id).innerText = json.last_name;
    document.getElementById("email_" + id).innerText = json.email;
  });
}

function deleteUser(id) {
  fetch(`https://reqres.in/api/users/${id}`, {
    method: "DELETE"
  })
  .then(response => {
    if (response.status === 204) {
      const row = document.getElementById("row_" + id);
      if (row) {
        row.parentNode.removeChild(row);
      }
    } else {
      console.error("No se pudo eliminar el usuario");
    }
  })
  .catch(error => {
    console.error("Ocurrió un error al intentar eliminar el usuario:", error);
  });
}

