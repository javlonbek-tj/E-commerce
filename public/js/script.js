let drop = document.querySelector('.drop');
let drop2 = document.querySelector('.drop2');

/* drop active */

/* document.querySelector('#user_btn').addEventListener('click', () => {
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
}); */

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

// Get all cart items
const cartItems = document.querySelectorAll('.cart-item');

// Loop through all cart items
cartItems.forEach(cartItem => {
  // Get quantity input and subtotal element for current cart item
  const quantityInput = cartItem.querySelector('.quantity-input');
  const subtotalElement = cartItem.querySelector('.subtotal');
  const prodId = cartItem.querySelector('#prodId').value;

  // Get plus and minus buttons for current cart item
  const plusBtn = cartItem.querySelector('.plus-btn');
  const minusBtn = cartItem.querySelector('.minus-btn');

  let quantity;
  if (quantityInput) {
    quantity = quantityInput.value;
  }

  // Add event listener for plus button
  if (plusBtn) {
    plusBtn.addEventListener('click', async function () {
      quantity = parseInt(quantityInput.value);
      quantityInput.value = quantity + 1;
      calculateSubtotal();
      const url = '/cart/increaseQty'; // replace with your endpoint URL
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ quantity, prodId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Handle success
          console.log('Product added to cart successfully!');
        } else {
          // Handle error
          console.error('Failed to add product to cart');
        }
      } catch (error) {
        // Handle error
        console.error('Failed to fetch data', error);
      }
    });
  }

  // Add event listener for minus button
  if (minusBtn) {
    minusBtn.addEventListener('click', async function () {
      quantity = parseInt(quantityInput.value);
      if (quantity > 1) {
        quantityInput.value = quantity - 1;
        calculateSubtotal();
        const url = '/cart/decreaseQty'; // replace with your endpoint URL
        try {
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ quantity, prodId }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            // Handle success
            console.log('Product added to cart successfully!');
          } else {
            // Handle error
            console.error('Failed to add product to cart');
          }
        } catch (error) {
          // Handle error
          console.error('Failed to fetch data', error);
        }
      }
    });
  }

  // Add event listener for quantity input
  if (quantityInput) {
    quantityInput.addEventListener('change', function () {
      calculateSubtotal();
    });
  }

  const productPriceElement = cartItem.querySelector('#productPrice');
  let price;
  if (productPriceElement) {
    price = productPriceElement.innerText;
  }
  const calculation = cartItem.querySelector('#calculation');
  if (calculation) {
    calculation.textContent = `Jami ${quantity} ta`;
  }

  if (subtotalElement) {
    const total = (quantity * parseFloat(price)).toFixed(2);
    subtotalElement.textContent = `${total} UZS`;
  }

  // Function to calculate subtotal
  function calculateSubtotal() {
    quantity = parseInt(quantityInput.value);
    let subtotal = quantity * parseFloat(price);
    subtotal = subtotal.toFixed(2);
    calculation.textContent = `Jami ${quantity} ta`;
    subtotalElement.textContent = subtotal + ' ' + 'UZS';
  }
});

//Cart

// JavaScript
const carts = document.querySelectorAll('#cart');
carts.forEach(cart => {
  cart.addEventListener('submit', async event => {
    event.preventDefault(); // prevent form submission
    const headerCart = document.querySelector('.headerCart');
    const prodId = event.target.querySelector('#prodId').value; // get prodId value
    const url = '/cart'; // replace with your endpoint URL
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ prodId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Handle success
        const res = await response.json();
        console.log('Product added to cart successfully!');
        headerCart.textContent = `${res.data.cartProducts.length}`;
      } else {
        // Handle error
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      // Handle error
      console.error('Failed to fetch data', error);
    }
  });
});

// JavaScript code
const deleteCartForms = document.querySelectorAll('.deleteCart');
deleteCartForms.forEach(deleteCartForm => {
  deleteCartForm.addEventListener('submit', async event => {
    event.preventDefault();

    // Get the cart item ID from the hidden input field in the current form
    const cartItemId = deleteCartForm.querySelector('.cartItemId').value;

    try {
      // Make a POST request to delete the cart item
      const response = await fetch('/deleteCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItemId }),
      });

      // Check if the request was successful
      if (response.ok) {
        // Handle the success response
        deleteCartForm.closest('.cart-item').remove();
        console.log(`Cart item with ID ${cartItemId} deleted successfully.`);
      } else {
        // Handle the error response
        console.error(
          `Failed to delete cart item with ID ${cartItemId}:`,
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      // Handle any exceptions or network errors
      console.error(`Error occurred while deleting cart item with ID ${cartItemId}:`, error);
    }
  });
});
