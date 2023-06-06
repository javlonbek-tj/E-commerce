const drop = document.querySelector('.drop');
const footerDrop = document.querySelector('.footerDrop');

/* drop active */
if (drop) {
  document.querySelector('#user_btn').addEventListener('click', () => {
    drop.classList.toggle('active');
  });
  drop.addEventListener('click', () => {
    drop.classList.remove('active');
  });
  document.body.addEventListener('click', event => {
    if (!event.target.closest('#user_nav')) {
      drop.classList.remove('active');
    }
  });
}

if (footerDrop) {
  document.querySelector('#user_footer_btn').addEventListener('click', () => {
    footerDrop.classList.toggle('active');
  });

  footerDrop.addEventListener('click', () => {
    footerDrop.classList.remove('active');
  });
  document.body.addEventListener('click', event => {
    if (!event.target.closest('.mobile__footer')) {
      footerDrop.classList.remove('active');
    }
  });
}

// Add productInfo input
function addInput() {
  const container = document.getElementById('inputContainer');
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="mb-3 me-3">
  <label for="titleInput" class="form-label">Nomi:</label>
  <input type="text"id="title" class="fs-3 form-control" name="title[]" />
  </div>
  <div class="mb-3 me-3">
    <label for="description" class="form-label">Tavsifi:</label>
    <input type="text" id="description" class="fs-3 form-control" name="description[]" />  
  </div>
  <div class="d-flex align-self-center">
  <button type="button" class="text-danger" onclick="removeInput(this)">O'chirish</button>
  </div>
    `;
  div.classList.add('d-md-flex');
  container.insertAdjacentElement('beforeend', div);
}

// remove productInfo input
function removeInput(button) {
  const div = button.parentNode.parentNode;
  div.parentNode.removeChild(div);
}
