document.addEventListener('DOMContentLoaded', function () {

    // SHOPPING CART START
        const cartList = document.getElementById('cart-list');
        const ingredientList = document.getElementById('ingredient-list');

        checkForBase();

        // Add click event listener to the ingredient list
        ingredientList.addEventListener('click', function (event) {
            const clickedIngredient = event.target.closest('.ingredient');
            if (clickedIngredient) {
                const ingredientName = clickedIngredient.dataset.name;
                const isBase = clickedIngredient.dataset.base === '1';
                if (isBase) {
                    // Remove any existing base from the cart
                    const existingBase = cartList.querySelector('[data-base="1"]');
                    if (existingBase) {
                        existingBase.remove();
                    }
                }

                // Add the ingredient to the cart
                const cartItem = document.createElement('li');
                cartItem.textContent = ingredientName;
                cartItem.dataset.base = isBase ? '1' : '0';
                if (isBase) {
                    cartList.insertBefore(cartItem, cartList.firstChild); // Base ingredients will always be at the top of the cart list
                }
                else {
                    const baseInCart = cartList.querySelector('[data-base="1"]');
                    const ingredientCount = cartList.children.length;
                    if (baseInCart) {
                        if (ingredientCount < 6) {
                            cartList.appendChild(cartItem);
                        } else {
                            showNotification("Please limit your number of ingredients to a maximum of 6.");
                        }
                    } else {
                        showNotification("You haven't picked a base yet. Please choose one of the bases marked in blue.");
                    }
                }
                checkForBase();
            }
        });

        // Add click event listener to the cart list for removal
        cartList.addEventListener('click', function (event) {
            const clickedCartItem = event.target.closest('li');
            if (clickedCartItem) {
                cartList.removeChild(clickedCartItem);
                checkForBase();
            }
        });


        function checkForBase() {
            const firstCartItem = cartList.querySelector('li');
            const infoBox = cartList.querySelector('.info-box');
            const payment = document.getElementById('payment');
            const price_sum = document.getElementById('sum-ingredients');
            const fee = document.getElementById('potion-fee');
            const price = document.getElementById('potion-price');
            const buttonBuy = document.getElementById('button-buy');

            if (firstCartItem && firstCartItem.dataset.base == 1) {
                const infoBox = cartList.querySelector('.info-box');
                if (infoBox) {
                    cartList.removeChild(infoBox);
                }

                // Handle price
                (async () => {
                    const [ingredient_sum, totalPrice, poisonous, dubious] = await calculatePrice();
                    let sumString = '<div class="sum-item"><span class="sum-text">Price of ingredients:</span><span class="sum-number">' + ingredient_sum + 'A</span></div>';

                    let feeString = '<b>Fees</b><br /><div class="fee-item"><span class="fee-description">Brewing and shipping:</span><span class="fee-price">2.0A</span></div>';
                    if (poisonous) {
                        feeString += '<div class="fee-item"><span class="fee-description">Poisonous contents:</span><span class="fee-price">0.5A</span></div>';
                    }
                    if (dubious) {
                        feeString += '<div class="fee-item"><span class="fee-description">Dubious contents:</span><span class="fee-price">1.0A</span></div>';
                    }
                    let priceString = 'Total: ' + totalPrice + ' Aurum';
                    price_sum.innerHTML = sumString;
                    fee.innerHTML = feeString;
                    price.innerHTML = priceString;
                    payment.style.visibility = 'visible';
                })();
            } else if (!infoBox) {
                const newInfoBox = document.createElement('div');
                newInfoBox.textContent = 'Please pick exactly one of the blue base ingredients.';
                newInfoBox.classList.add('info-box');
                cartList.insertBefore(newInfoBox, cartList.firstChild);
                payment.style.visibility = 'hidden';
            }
        }

        function calculatePrice() {
            const cartItems = cartList.getElementsByTagName('li');

            const fetchPromises = [];
            const results = [];

            for (const cartItem of cartItems) {
                ingredient_name = cartItem.textContent;

                const fetchPromise = fetch('/get_ingredient_info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ingredient_name: ingredient_name }),
                })
                .then(response => response.json())
                .then(data => {
                    // Push the data into an array so we can later examine it when all promises are done.
                    results.push(data[0]);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

                fetchPromises.push(fetchPromise);
            }

            // Wait for all fetch operations to complete before continuing
            return Promise.all(fetchPromises).then(() => {
                let totalPrice = 0;
                let price = 0;
                let poisonous = false;
                let dubious = false;
                results.forEach(data => {
                    if ('price' in data) {
                        price = data.price;
                        totalPrice += price;
                    }
                    if ('is_poisonous' in data && data.is_poisonous == 1) {
                        poisonous = true;
                    }
                    if ('is_dubious' in data && data.is_dubious == 1) {
                        dubious = true;
                    }
                });

                let ingredient_sum = totalPrice;

                if (poisonous) {
                    totalPrice += 0.5;
                }
                if (dubious) {
                    totalPrice += 1.0;
                }
                totalPrice += 2.0; // Brewing and shipping charge
                return [ingredient_sum.toFixed(1), totalPrice.toFixed(1), poisonous, dubious];
            });
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            // Set a timeout to remove the notification after a few seconds
            setTimeout(function () {
                document.body.removeChild(notification);
            }, 3000);
        }

        // Buy button
        const buyButton = document.getElementById('button-buy');
        buyButton.addEventListener('click', function () {
            showNotification('Thank you for your purchase!');
            reset()
        });

        // Reset everything after buying
        function reset() {
            // Clear cart list
            while (cartList.firstChild) {
                cartList.removeChild(cartList.firstChild);
            }

            // Remove price and buy button
            checkForBase();

            // Uncheck filter checkboxes
            const filterCheckboxes = document.querySelectorAll('.checkbox-container input');
            filterCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    checkbox.checked = false;
                    checkbox.dispatchEvent(new Event('change')); // Simulates a real click in the checkbox so the SQL query gets updated
                }
            });
        }
    // SHOPPING CART END


    // FILTER START
        function updateIngredientList(updatedData) {
            const ingredientList = document.getElementById('ingredient-list');

            // Clear existing ingredients
            ingredientList.innerHTML = '';

            // Iterate through the updated data and create new ingredient elements
            updatedData.forEach(ingredient => {
                const newIngredient = document.createElement('div');
                newIngredient.className = 'ingredient';
                newIngredient.setAttribute('data-name', ingredient.name);
                newIngredient.setAttribute('data-base', ingredient.is_base);
                if (ingredient.is_base == 1) {
                    newIngredient.classList.add('base');
                }
                newIngredient.innerHTML = `
                    <div class="ingredient-name">${ingredient.name}</div>
                    <div class="ingredient-desc">${ingredient.description}</div>
                    ${ingredient.is_base == 1 ? '<div class="ingredient-base">Base ingredient - pick exactly one.</div>' : ''}
                    ${ingredient.is_vegan == 1 ? '<div class="ingredient-vegan">VEGAN</div>' : ''}
                    ${ingredient.is_poisonous == 1 ? '<div class="ingredient-poison">POISONOUS</div>' : ''}
                    ${ingredient.is_dubious == 1 ? '<div class="ingredient-dubious">DUBIOUS</div>' : ''}
                    ${ingredient.tastes_bad == 1 ? '<div class="ingredient-taste">BAD TASTE</div>' : ''}
                    <div class="ingredient-effect">${ingredient.effect}</div>
                    <div class="ingredient-price">${ingredient.price}</div>
                `;

                ingredientList.appendChild(newIngredient);
            });
        }

        const activeFilters = [];
        // Get all checkboxes
        const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');

        checkboxes.forEach(function (checkbox) {
            // Reset checkbox state on page load
            checkbox.checked = false;
            // Add change event listener to each checkbox
            checkbox.addEventListener('change', function () {
                // Get the data-filter value
                const filterValue = checkbox.parentElement.dataset.filter;

                // Check if filter is already active
                const filterIndex = activeFilters.indexOf(filterValue);
                if (filterIndex === -1) {
                    activeFilters.push(filterValue); // Add filter
                    // Handle poison filters deactivating each other:
                    if (filterValue === 'showPoison') {
                        poisonFilterIndex = activeFilters.indexOf('hidePoison');
                        if (poisonFilterIndex != -1) {
                            const hidePoisonCheckbox = document.getElementById('hidePoison');
                            hidePoisonCheckbox.checked = false;
                            const hidePoisonCollapsibleCheckbox = document.getElementById('hidePoisonCollapsible');
                            if(hidePoisonCollapsibleCheckbox) {
                                hidePoisonCollapsibleCheckbox.checked = false;
                            }
                            activeFilters.splice(poisonFilterIndex, 1);
                        }
                    } else if (filterValue === 'hidePoison') {
                        poisonFilterIndex = activeFilters.indexOf('showPoison');
                        if (poisonFilterIndex != -1) {
                            const showPoisonCheckbox = document.getElementById('showPoison');
                            showPoisonCheckbox.checked = false;
                            const showPoisonCollapsibleCheckbox = document.getElementById('showPoisonCollapsible');
                            if(showPoisonCollapsibleCheckbox) {
                                showPoisonCollapsibleCheckbox.checked = false;
                            }
                            activeFilters.splice(poisonFilterIndex, 1);
                        }
                    }

                    // Also mark the collapsible filter as checked
                    const collapsibleCheckbox = document.getElementById(filterValue + 'Collapsible');
                    if(collapsibleCheckbox) {
                        collapsibleCheckbox.checked = true;
                    }

                } else {
                    activeFilters.splice(filterIndex, 1); // Remove filter
                    // Also uncheck the collapsible filter
                    const collapsibleCheckbox = document.getElementById(filterValue + 'Collapsible');
                    if(collapsibleCheckbox) {
                        collapsibleCheckbox.checked = false;
                    }
                }

                // Make an AJAX request to the server
                fetch('/update_filter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filters: activeFilters }),
                })
                .then(response => response.json())
                .then(data => {
                    updateIngredientList(data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            });
        });
    // FILTER END
    });
