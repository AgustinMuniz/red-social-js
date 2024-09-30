const urlBase = 'https://jsonplaceholder.typicode.com/posts' // Esta es la URL con la que interactuaremos
let posts = [] // Iniciamos los posteos como un array vacío

function getData() {
    fetch(urlBase)
        .then(res => res.json())
        .then(data => {
            posts = data
            console.log(posts); // Muestra el array de posts obtenidos desde la API
            renderPostList()
        })
        .catch(error => console.error('Error al llamar a la API:', error))
}

getData()

function renderPostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `
            <strong>${post.title}</strong>
            <p>${post.body}</p>
            <button onclick="editPost(${post.id})">Editar</button>
            <button onclick="deletePost(${post.id})">Borrar</button>

            <div id="editForm-${post.id}" class="editForm" style="display:none">
                <label for="editTitle-${post.id}">Titulo: </label>
                <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
                <label for="editBody-${post.id}">Comentario: </label>
                <textarea id="editBody-${post.id}" required>${post.body}</textarea>
                <button onclick="updatePost(${post.id})">Actualizar</button>
            </div>
        `;
        postList.appendChild(listItem);
    });
}

function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() === '' || postBody.trim() === '') {
        alert('Los campos son obligatorios');
        return;
    }

    // Asigna manualmente un nuevo ID único calculando el mayor ID actual
    const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;

    // Colocamos un console.log para ver el nuevo ID generado manualmente
    console.log('Nuevo ID generado manualmente:', newId);

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            id: newId,  // Asignamos el nuevo ID
            title: postTitle,
            body: postBody,
            userId: 1,  // También puedes manejar el userId si lo necesitas
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        // Usamos el ID manual en lugar del que devuelve la API
        data.id = newId;
        console.log('Post creado con el ID:', data.id);  // Verificamos el ID en la respuesta también
        posts.unshift(data);
        renderPostList();
        postTitleInput.value = '';
        postBodyInput.value = '';
    })
    .catch(error => console.error('Error al querer crear posteo: ', error));
}


function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`,{
        method: 'PUT',
        body: JSON.stringify({
          id: id,
          title: editTitle,
          body: editBody,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(res => res.json())
      .then(data => {
        const index = posts.findIndex(post => post.id === data.id)
        if (index != -1) {
            posts[index] = data
        }else{
            alert('Hubo un error al actualizar la información del posteo')
        }
        renderPostList()
      })
      .catch(error => console.error('Error al querer actualizar posteo: ', error));
    }

function deletePost(id) {
    fetch(`${urlBase}/${id}`,{
        method: 'DELETE',
    })
    .then(res => {
        if(res.ok){
            posts = posts.filter(post => post.id != id)
            renderPostList()
        } else {
            alert('Hubo un error y no se pudo eliminar el posteo')
        }
    })
    .catch(error => console.error('Hubo un error: ', error))
}