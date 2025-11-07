const carousel = document.querySelector('.carousel')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
const scrollStep = 270;

async function getProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();

        products.array.forEach(element => {
            const product = document.createElement('div');
            product.classList.add('product');
            product.innerHTML = `
                <img src="${element.image}" alt="${element.title}">
                <h3>${element.title}</h3>
                <p>${element.description}</p>
                <p>${element.price}</p>
            `;
            carousel.appendChild(product);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
    
    next.addEventListener('click', () => {
        carousel.scrollBy({
            left: scrollStep,
            behavior: 'smooth'
        });
    });
    prev.addEventListener('click', () => {
        carousel.scrollBy({
            left: -scrollStep,
            behavior: 'smooth'
        });
    });

    getProducts();
}