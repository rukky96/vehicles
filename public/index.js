let cars = [];
let currentId = null;

async function fetchData() {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    try {
        const response = await fetch('/api/cars');
        const data = await response.json();
        cars = data;
        cars.forEach((car, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${car.brand}</td>
        <td>${car.model}</td>
        <td>${car.year}</td>
        <td>${car.color}</td>
        <td><button class="edit-button" style="margin-right: 5px;">Edit</button><button class="delete-button">Delete</button></td>
        `
        row.querySelector('.edit-button').addEventListener("click", () => {
            const brand = document.getElementById("brand");
            const model = document.getElementById("model");
            const year = document.getElementById("year");
            const color = document.getElementById("color");

            document.getElementById("edit-form").style.display = "flex";

            brand.value = `${car.brand}`;
            model.value = `${car.model}`;
            year.value = `${car.year}`;
            color.value = `${car.color}`;
            currentId = car.id;

        })

        tableBody.appendChild(row);
    })
        console.log(cars);
    } catch (error){
        console.log(error);
    }

    
}

document.getElementById("load-button").addEventListener("click", (e)=>{
    fetchData();
    
})

document.getElementById("cancel-button").addEventListener("click", (e) =>{
    document.getElementById("edit-form").style.display = "none";
})

document.getElementById("submit-button").addEventListener("click", async (e) => {
            const brand = document.getElementById("brand").value;
            const model = document.getElementById("model").value;
            const year = document.getElementById("year").value;
            const color = document.getElementById("color").value;


    try {
        const response = await fetch(`/api/cars/${currentId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    brand: brand,
                    model: model,
                    year: year,
                    color: color,
                }),
                
            }
        );
        const data = await response.json();
        console.log(data);
        document.getElementById("edit-form").style.display = "none";
        fetchData();
    } catch(error){
        console.log(error);
    }
})

document.getElementById('search-button').addEventListener("click", (e)=>{
    
})


