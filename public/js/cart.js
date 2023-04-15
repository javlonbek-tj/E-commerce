// Alert
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 2) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

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

  // Add event listener for plus button
  if (plusBtn) {
    plusBtn.addEventListener('click', async function () {
      quantityInput.value = parent(quantityInput.value) + 1;
      calculateSubtotal();
      const url = '/cart/increaseQty';
      try {
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ quantity, prodId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          console.log('Product quantiy has increased by one!');
        } else {
          // Handle error
          console.error('Failed to increase quantity');
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
      if (parent(quantityInput.value) > 1) {
        quantityInput.value = parent(quantityInput.value) - 1;
        calculateSubtotal();
        const url = '/cart/decreaseQty';
        try {
          const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ quantity, prodId }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (res.ok) {
            // Handle success
            console.log('Product quantity has decreased by One!');
          } else {
            // Handle error
            console.error('Failed to decrease quantity');
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

  // Function to calculate total price of product which is added tocart
  function calculateSubtotal() {
    let subtotal = quantity * parseFloat(price);
    subtotal = subtotal.toFixed(2);
    calculation.textContent = `Jami ${quantity} ta`;
    subtotalElement.textContent = subtotal + ' ' + 'UZS';

    const totalProdsPrice = document.querySelector('.totalProdsPrice');
    const total = Array.from(cartItems).reduce((accumulator, cartItem) => {
      const subtotalElement = cartItem.querySelector('.subtotal').textContent.split(' ')[0];
      return accumulator + +subtotalElement;
    }, 0);
    totalProdsPrice.textContent = total;
  }
});

// Total products price in the cart
const totalProdsPrice = document.querySelector('.totalProdsPrice');
const total = Array.from(cartItems).reduce((accumulator, cartItem) => {
  const subtotalElement = cartItem.querySelector('.subtotal').textContent.split(' ')[0];
  return accumulator + +subtotalElement;
}, 0);
if (totalProdsPrice) {
  totalProdsPrice.textContent = total;
}

// Add to cart request

const headerCartNumber = document.querySelector('.headerCartNumber');
const carts = document.querySelectorAll('#cartIcon');
carts.forEach(cart => {
  cart.addEventListener('submit', async event => {
    event.preventDefault();
    const prodId = event.target.querySelector('#prodId').value;
    const url = '/cart';
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
        showAlert('success', `Mahsulot savatcha qo'shildi`);
        const res = await response.json();
        console.log('Product added to cart successfully!');
        if (!res.data.hasProduct) {
          headerCartNumber.textContent = isNaN(parseInt(headerCartNumber.textContent))
            ? 1
            : parseInt(headerCartNumber.textContent) + 1;
        }
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

// Delete product from the cart

const deleteCartForms = document.querySelectorAll('.deleteCart');
deleteCartForms.forEach(deleteCartForm => {
  deleteCartForm.addEventListener('submit', async event => {
    event.preventDefault();
    const cartItemId = deleteCartForm.querySelector('.cartItemId').value;
    const subtotal = deleteCartForm.parentNode.firstElementChild.nextElementSibling.textContent.split(' ')[0];
    const cartProdsNumber = document.querySelector('.cartProdsNumber');

    try {
      const res = await fetch('/deleteCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItemId }),
      });

      // Check if the request was successful
      if (res.ok) {
        totalProdsPrice.textContent = +totalProdsPrice.textContent - +subtotal;
        cartProdsNumber.textContent = +cartProdsNumber.textContent - 1;
        deleteCartForm.closest('.cart-item').remove();
        headerCartNumber.textContent = isNaN(parseInt(headerCartNumber.textContent))
          ? 1
          : parseInt(headerCartNumber.textContent) - 1;
        console.log(`Cart item with ID ${cartItemId} deleted successfully.`);
      } else {
        console.error(`Failed to delete cart item with ID ${cartItemId}`);
      }
    } catch (error) {
      console.error(`Error occurred while deleting cart item with ID ${cartItemId}:`, error);
    }
  });
});
