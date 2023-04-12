function addInput() {
  const container = document.getElementById('inputContainer');
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="mb-3 me-3">
  <label for="titleInput" class="form-label">Title:</label>
  <input type="text"id="title" class="fs-3 form-control" name="title[]" />
  </div>
  <div class="mb-3 me-3">
    <label for="description" class="form-label">Description:</label>
    <input type="text" id="description" class="fs-3 form-control" name="description[]" />  
  </div>
  <div class="d-flex align-self-center">
  <button type="button" class="text-danger" onclick="removeInput(this)">O'chirish</button>
  </div>
    `;
  div.classList.add('d-md-flex');
  container.insertAdjacentElement('beforeend', div);
}

function removeInput(button) {
  const div = button.parentNode.parentNode;
  div.parentNode.removeChild(div);
}
