let drop = document.querySelector('.drop');
let drop2 = document.querySelector('.drop2');

/* drop active */

document.querySelector('#user_btn').addEventListener('click', () => {
  drop.classList.toggle('active');
});

document.querySelector('#user_footer_btn').addEventListener('click', () => {
  drop2.classList.toggle('active');
});

drop.addEventListener('click', () => {
  drop.classList.remove('active');
});

drop2.addEventListener('click', () => {
  drop2.classList.remove('active');
});

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

// Cart

// Get quantity input and subtotal element
var quantityInput = document.getElementById('quantity');
var subtotalElement = document.getElementById('subtotal');

// Get plus and minus buttons
var plusBtn = document.getElementById('plusBtn');
var minusBtn = document.getElementById('minusBtn');

// Add event listener for plus button
plusBtn.addEventListener('click', function () {
  var quantity = parseInt(quantityInput.value);
  quantityInput.value = quantity + 1;
  calculateSubtotal();
});

// Add event listener for minus button
minusBtn.addEventListener('click', function () {
  var quantity = parseInt(quantityInput.value);
  if (quantity > 1) {
    quantityInput.value = quantity - 1;
    calculateSubtotal();
  }
});

// Add event listener for quantity input
quantityInput.addEventListener('change', function () {
  calculateSubtotal();
});

const calculation = document.querySelector('#calculation');
// Function to calculate subtotal
function calculateSubtotal() {
  var quantity = parseInt(quantityInput.value);
  var price = 19.99; // Update with actual product price
  var subtotal = quantity * price;
  calculation.textContent = `Jami ${quantity} ta`;
  subtotalElement.textContent = '$' + subtotal.toFixed(2);
}
