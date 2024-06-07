class FoodReservationSystem {
  constructor() {
    // this.menu = []; // Array to store the food menu
    this.orderList = []; // Array to store the orders
    this.cookingList = []; // Array to store the cooking orders
    this.readyList = []; // Array to store the ready orders
  }

  Order(foodName, quantity) {
    console.log(quantity);
    const order = {
      food: foodName,
      quantity: quantity,
      date: new Date(),

      orderDetail: function () {
        var day = this.date.getDate();
        var month = this.date.getMonth() + 1;
        var year = this.date.getFullYear();
        return (
          this.food +
          " " +
          "No:" +
          this.quantity +
          " " +
          day +
          "/" +
          month +
          "/" +
          year
        );
      },
      readyListItem: function () {
        return this.food + " " + "No:" + this.quantity;
      },
    };

    // Add the order to the order list

    this.orderList.push(order);
    this.cookOrder(order);
  }
  clearOrders() {
    this.orderList = [];
    this.cookingList = [];
    this.readyList = [];
  }
  cookOrder(order) {
    // Calculate cooking time estimate
    const cookingTime = order.quantity * 5; // Assuming 5 seconds per food item

    // Create a cooking box with order details
    const cookingBox = {
      order: order,
      cookingTime: cookingTime,
    };

    // Add the cooking box to the cooking list
    this.cookingList.push(cookingBox);
    // //method for removing orderlist
    // const orderIndex = this.orderList.indexOf(order);
    // if (orderIndex !== -1) {
    //   this.orderList.splice(orderIndex, 1);
    // }
    // Start the countdown for cooking time
    this.startCountdown(cookingBox);
    // this.printToScreen(this.readyList, "readyFood");/////////////////
    // Clear the orderList after pushing its data into the cookingList
  }

  // Method to start the countdown for cooking time
  startCountdown(cookingBox) {
    let countdown = cookingBox.cookingTime;
    let cookingFoodOutput = "";
    for (const item of this.cookingList) {
      cookingFoodOutput += `<li>${item.order.orderDetail()}</li>`;
      document.getElementById("cookingFood").innerHTML =
        cookingFoodOutput + "timer: " + countdown;

      // document.getElementById("timer").innerHTML = "timer: " + countdown;

      const countdownInterval = setInterval(() => {
        countdown--;
        // document.getElementById("timer").innerHTML = "timer: " + countdown;
        document.getElementById("cookingFood").innerHTML =
          cookingFoodOutput + "timer: " + countdown;
        if (countdown === 0) {
          // Move the order to the ready list
          this.readyList.push(cookingBox.order);

          // Remove the order from the cooking list
          const index = this.cookingList.indexOf(cookingBox);
          if (index !== -1) {
            this.cookingList.splice(index, 1);
            let updateCookingFoodOutput = "";
            for (const item of this.cookingList) {
              updateCookingFoodOutput = item.order.orderDetail() + "<br>";
            }
            document.getElementById("cookingFood").innerHTML =
              updateCookingFoodOutput;
          }

          clearInterval(countdownInterval);

          // Update the readyFood element with the updated ready list
          let readyListOutput = "";
          for (const item of this.readyList) {
            readyListOutput = item.readyListItem() + "<br>";
          }
          document.getElementById("readyFood").innerHTML = readyListOutput;

          // Remove the order from the ready list after 5 seconds
          setTimeout(() => {
            const readyIndex = this.readyList.indexOf(cookingBox.order);
            if (readyIndex !== -1) {
              this.readyList.splice(readyIndex, 1);
              // Update the readyFood element with the updated ready list after removal
              let updatedReadyListOutput = "";
              for (const item of this.readyList) {
                updatedReadyListOutput = item.readyListItem() + "<br>";
              }
              document.getElementById("readyFood").innerHTML =
                updatedReadyListOutput;
            }
          }, 5000);
        }
      }, 1000);
    }
  }
}

const reservationSystem = new FoodReservationSystem();
function selectedorder(id) {
  const foodItems = document.getElementById(id);
  const foodQuantityInput = document.getElementById("food-quantity");
  const orderButton = document.getElementById("order-button");
  let selectedFood = null; // Track the currently selected food item
  let availableQuantity = 0; // Track the available quantity for the selected food item

  foodItems.addEventListener("click", function () {
    selectedFood = foodItems.textContent;
    availableQuantity = parseInt(
      foodItems
        .querySelector("span")
        .textContent.replace("(", "")
        .replace(")", "")
    );
    const quantity = parseInt(foodQuantityInput.value);
    foodItems.style.backgroundColor = "#e6770084";

    if (selectedFood && quantity > 0) {
      orderButton.disabled = false;
    } else {
      orderButton.disabled = true;
    }
  });

  foodQuantityInput.addEventListener("input", function () {
    const quantity = parseInt(foodQuantityInput.value);

    if (selectedFood && quantity > 0) {
      orderButton.disabled = false;
    } else {
      orderButton.disabled = true;
    }
  });

  orderButton.addEventListener("click", function () {
    const quantity = parseInt(foodQuantityInput.value);
    if (quantity > availableQuantity) {
      // Show error message if ordered quantity exceeds available quantity
      if (selectedFood) {
        const errorMessage = `Error: Only ${availableQuantity} items of ${selectedFood} available`;
        alert(errorMessage);
        //directly go to ready list
        reservationSystem.readyList.push(
          (order = {
            food: selectedFood,
            quantity: quantity,
          })
        );
        let readyListOutput = "";
        for (const item of reservationSystem.readyList) {
          readyListOutput = item.food + " " + "No:" + item.quantity + "<br>";
        }
        document.getElementById("readyFood").innerHTML = readyListOutput;
        // Remove the order from the ready list after 5 seconds
        setTimeout(() => {
          const readyIndex = reservationSystem.readyList.indexOf(order);
          if (reservationSystem.readyIndex !== -1) {
            reservationSystem.readyList.splice(readyIndex, 1);
            // Update the readyFood element with the updated ready list after removal
            let updatedReadyListOutput = "";
            for (const item of reservationSystem.readyList) {
              updatedReadyListOutput =
                item.food + " " + "No:" + item.quantity + "<br>";
            }
            document.getElementById("readyFood").innerHTML =
              updatedReadyListOutput;
          }
        }, 5000);
      }

      foodItems.style.backgroundColor = "#fff";
      orderButton.disabled = true;
      // foodQuantityInput.value = "";
      selectedFood = null;
      availableQuantity = 0;
      return;
    }
    reservationSystem.clearOrders(); // Clear all order lists before getting a new order
    reservationSystem.Order(selectedFood, quantity);

    // Update the available quantity display
    availableQuantity -= quantity;
    foodItems.querySelector("span").textContent = `(${availableQuantity})`;

    // Reset selected item and quantity after clicking the order button
    foodItems.style.backgroundColor = "#fff";
    orderButton.disabled = true;
    // foodQuantityInput.value = "";
    selectedFood = null;
    availableQuantity = 0;
  });
  console.log(reservationSystem.orderList);
  console.log(reservationSystem.cookingList);
  console.log(reservationSystem.readyList);
}

// foodItems.addEventListener("click", function () {
//   selectedFood = foodItems.textContent;
//   const quantity = parseInt(foodQuantityInput.value);
//   foodItems.style.backgroundColor = "#e6770084";

//   if (selectedFood && quantity > 0) {
//     orderButton.disabled = false;
//   } else {
//     orderButton.disabled = true;
//   }
// });

// foodQuantityInput.addEventListener("input", function () {
//   const quantity = parseInt(foodQuantityInput.value);

//   if (selectedFood && quantity > 0) {
//     orderButton.disabled = false;
//   } else {
//     orderButton.disabled = true;
//   }
// });

// orderButton.addEventListener("click", function () {
//   const quantity = parseInt(foodQuantityInput.value);
//   reservationSystem.clearOrders(); // Clear all order lists before getting a new order
//   reservationSystem.Order(selectedFood, quantity);

//   // Reset selected item and quantity after clicking the order button
//   foodItems.style.backgroundColor = "#fff";
//   orderButton.disabled = true;
// });

// reservationSystem.orderList.pop();
// reservationSystem.cookingList.pop();
// reservationSystem.readyList.pop();
// let cookedFood = "";
// for (const x of this.cookingList) {
//   cookedFood += x + "<br>";
// }
// document.getElementById("cookingFood").innerHTML;

// let readyfood = "";
// for (const x of this.readyList) {
//   cookedFood += x + "<br>";
// }
// document.getElementById("readyList").innerHTML;
